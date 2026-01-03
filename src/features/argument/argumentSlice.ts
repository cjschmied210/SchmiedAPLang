import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export type NodeType = 'THESIS' | 'CLAIM' | 'EVIDENCE';

export interface ArgumentNode {
    id: string;
    type: NodeType;
    content: string;
    parentId: string | null;
    children: string[]; // Keep track of children IDs for easy traversal
}

interface ArgumentState {
    nodes: Record<string, ArgumentNode>; // Normalized state for easier updates
    rootId: string;
}

// FIX: Use a static string for the root ID to prevent initialization crashes.
// uuidv4() at the top level can fail if the environment isn't ready.
const initialRootId = 'root-node';

const initialState: ArgumentState = {
    nodes: {
        [initialRootId]: {
            id: initialRootId,
            type: 'THESIS',
            content: '',
            parentId: null,
            children: [],
        },
    },
    rootId: initialRootId,
};

const argumentSlice = createSlice({
    name: 'argument',
    initialState,
    reducers: {
        addNode: (state, action: PayloadAction<{ parentId: string; type: NodeType }>) => {
            const { parentId, type } = action.payload;
            const parent = state.nodes[parentId];

            if (parent) {
                const newNodeId = uuidv4();
                const newNode: ArgumentNode = {
                    id: newNodeId,
                    type,
                    content: '',
                    parentId,
                    children: [],
                };

                state.nodes[newNodeId] = newNode;
                parent.children.push(newNodeId);
            }
        },
        updateNodeContent: (state, action: PayloadAction<{ id: string; content: string }>) => {
            const node = state.nodes[action.payload.id];
            if (node) {
                node.content = action.payload.content;
            }
        },
        deleteNode: (state, action: PayloadAction<string>) => {
            const nodeId = action.payload;
            const node = state.nodes[nodeId];

            if (node && node.parentId) {
                // Remove from parent's children list
                const parent = state.nodes[node.parentId];
                if (parent) {
                    parent.children = parent.children.filter(id => id !== nodeId);
                }

                // Recursive delete is complex in reducer, simplified here: 
                // In a real app we'd delete all descendants. 
                // For now, we'll just delete the node and let orphans exist (or handle in selector).
                // Better approach: cascade delete.
                const nodesToDelete = [nodeId];
                let i = 0;
                while (i < nodesToDelete.length) {
                    const currentId = nodesToDelete[i];
                    const current = state.nodes[currentId];
                    if (current) {
                        nodesToDelete.push(...current.children);
                    }
                    i++;
                }
                nodesToDelete.forEach(id => delete state.nodes[id]);
            }
        },
        // Optional reorder/move logic could go here
    },
});

export const { addNode, updateNodeContent, deleteNode } = argumentSlice.actions;
export default argumentSlice.reducer;
