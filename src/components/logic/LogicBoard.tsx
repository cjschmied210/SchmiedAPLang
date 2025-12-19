import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { addNode, updateNodeContent, deleteNode } from '../../features/argument/argumentSlice';
import { Plus, Trash2 } from 'lucide-react';

const NodeCard: React.FC<{ nodeId: string }> = ({ nodeId }) => {
    const dispatch = useDispatch();
    const node = useSelector((state: RootState) => state.argument.nodes[nodeId]);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea
    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        dispatch(updateNodeContent({ id: nodeId, content: e.target.value }));
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    };

    if (!node) return null;

    const handleAddChild = () => {
        let childType: 'CLAIM' | 'EVIDENCE' = 'CLAIM';
        if (node.type === 'CLAIM') childType = 'EVIDENCE';
        if (node.type === 'EVIDENCE') return;

        dispatch(addNode({ parentId: nodeId, type: childType }));
    };

    const getStyles = () => {
        switch (node.type) {
            case 'THESIS': return { border: 'border-amber-400', bg: 'bg-amber-50/50' };
            case 'CLAIM': return { border: 'border-blue-400', bg: 'bg-blue-50/50' };
            case 'EVIDENCE': return { border: 'border-slate-300', bg: 'bg-white' };
            default: return { border: 'border-gray-200', bg: 'bg-white' };
        }
    };
    const styles = getStyles();

    return (
        <div className="flex flex-col items-center">
            {/* The Node Card */}
            <div
                className={`group relative w-72 p-4 rounded-xl shadow-sm border-l-4 ${styles.border} ${styles.bg} transition-all hover:shadow-md hover:-translate-y-1 bg-white`}
            >
                <div className="mb-2 flex justify-between items-center">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${node.type === 'THESIS' ? 'text-amber-600' : 'text-slate-400'}`}>
                        {node.type}
                    </span>
                    {node.type !== 'THESIS' && (
                        <button
                            onClick={() => dispatch(deleteNode(nodeId))}
                            className="text-slate-300 hover:text-red-500 transition-colors"
                        >
                            <Trash2 size={14} />
                        </button>
                    )}
                </div>

                <textarea
                    ref={textareaRef}
                    value={node.content}
                    onChange={handleInput}
                    placeholder={`Enter ${node.type.toLowerCase()}...`}
                    rows={1}
                    className="w-full text-sm font-serif border-none resize-none focus:ring-0 p-0 bg-transparent min-h-[2rem] overflow-hidden leading-relaxed"
                />

                {/* Add Button */}
                {node.type !== 'EVIDENCE' && (
                    <button
                        onClick={handleAddChild}
                        className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:border-indigo-400 shadow-sm transition-all z-20 hover:scale-110"
                        title="Add child node"
                    >
                        <Plus size={14} />
                    </button>
                )}
            </div>

            {/* Recursion & Connectors */}
            {node.children.length > 0 && (
                <div className="flex flex-col items-center">
                    {/* Vertical line down from parent */}
                    <div className="h-8 w-px bg-gray-300"></div>

                    {/* Horizontal connector line */}
                    {/* Only show if multiple children, spans from first child center to last child center */}
                    <div className="relative flex gap-8">
                        {/* The horizontal bar that sits above the children */}
                        {node.children.length > 1 && (
                            <div className="absolute -top-px left-0 right-0 h-px bg-gray-300 mx-[9rem]" />
                            // 9rem is roughly half the card width (w-72 = 18rem). This ensures the line starts/ends at centers.
                            // However, flex gap makes this calc tricky.
                            // Easier: Use the pseudo-element tree approach or just accept simple disjointed lines.
                            // Let's rely on the CSS tree trick wrapper.
                        )}

                        {/* Actually, let's use the CSS Tree structure wrapper here, it's cleaner than manual divs */}
                        {node.children.map((childId, index) => (
                            <div key={childId} className="relative flex flex-col items-center pt-8">
                                {/* Connector Lines Logic for this specific child relative to siblings */}
                                {node.children.length > 1 && (
                                    <>
                                        {/* Line Up */}
                                        <div className="absolute top-0 h-8 w-px bg-gray-300 left-1/2 -translate-x-1/2" />
                                        {/* Horizontal Top Bar Segments */}
                                        {index === 0 && (
                                            <div className="absolute top-0 h-px bg-gray-300 left-1/2 w-1/2 right-0 translate-x-px" /> // Right half only
                                        )}
                                        {index === node.children.length - 1 && (
                                            <div className="absolute top-0 h-px bg-gray-300 right-1/2 w-1/2 left-0 -translate-x-px" /> // Left half only
                                        )}
                                        {index > 0 && index < node.children.length - 1 && (
                                            <div className="absolute top-0 h-px bg-gray-300 w-full left-0" /> // Full width
                                        )}
                                    </>
                                )}
                                {/* Single child doesn't need horizontal bars, just the vertical line from parent (rendered above) connects to... Wait, parent rendered 1 vertical line. */}
                                {/* If single child, parent vertical line connects directly. If multiple, parent connects to horizontal bar. */}

                                <NodeCard nodeId={childId} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export const LogicBoard: React.FC = () => {
    const rootId = useSelector((state: RootState) => state.argument.rootId);

    return (
        <div className="w-full h-full overflow-auto bg-[#F8FAFC] p-12 custom-scrollbar">
            {/* Dot Grid Background */}
            <div className="fixed inset-0 z-0 opacity-40 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(#94A3B8 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                }}
            />

            <div className="relative z-10 min-w-max flex justify-center pb-20 mt-8">
                <NodeCard nodeId={rootId} />
            </div>
        </div>
    );
};
