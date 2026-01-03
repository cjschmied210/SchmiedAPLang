import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Annotation, RhetoricalVerb, SpacecatData, RhetoricalContextType } from '../../types';
import { v4 as uuidv4 } from 'uuid';

interface AnalysisState {
    annotations: Annotation[];
    activeAnnotationId: string | null;
    sidebarOpen: boolean;
    rhetoricalContext: RhetoricalContextType | null;
}

const initialState: AnalysisState = {
    annotations: [],
    activeAnnotationId: null,
    sidebarOpen: true,
    rhetoricalContext: null,
};

const analysisSlice = createSlice({
    name: 'analysis',
    initialState,
    reducers: {
        createAnnotation: (state, action: PayloadAction<{
            textId: string;
            start: number;
            end: number;
            text: string;
        }>) => {
            const newAnnotation: Annotation = {
                id: uuidv4(),
                textId: action.payload.textId,
                anchorStart: action.payload.start,
                anchorEnd: action.payload.end,
                selectedText: action.payload.text,
                content: '',
                createdAt: new Date().toISOString(),
            };
            state.annotations.push(newAnnotation);
            state.activeAnnotationId = newAnnotation.id;
            state.sidebarOpen = true;
        },
        setRhetoricalContext: (state, action: PayloadAction<RhetoricalContextType>) => {
            state.rhetoricalContext = action.payload;
        },
        updateAnnotationContent: (state, action: PayloadAction<{ id: string; content: string }>) => {
            const ann = state.annotations.find((a) => a.id === action.payload.id);
            if (ann) {
                ann.content = action.payload.content;
            }
        },
        setRhetoricalVerb: (state, action: PayloadAction<{ id: string; verb: RhetoricalVerb }>) => {
            const ann = state.annotations.find((a) => a.id === action.payload.id);
            if (ann) {
                ann.verb = action.payload.verb;
            }
        },
        setSpacecatData: (state, action: PayloadAction<{ id: string; data: Partial<SpacecatData> }>) => {
            const ann = state.annotations.find((a) => a.id === action.payload.id);
            if (ann) {
                ann.templateData = { ...ann.templateData, ...action.payload.data };
            }
        },
        deleteAnnotation: (state, action: PayloadAction<string>) => {
            state.annotations = state.annotations.filter((a) => a.id !== action.payload);
            if (state.activeAnnotationId === action.payload) {
                state.activeAnnotationId = null;
            }
        },
        setActiveAnnotation: (state, action: PayloadAction<string | null>) => {
            state.activeAnnotationId = action.payload;
        },
    },
});

export const {
    createAnnotation,
    updateAnnotationContent,
    setRhetoricalVerb,
    setSpacecatData,
    deleteAnnotation,
    setActiveAnnotation,
    setRhetoricalContext,
} = analysisSlice.actions;

export default analysisSlice.reducer;
