import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Annotation, RhetoricalVerb, SpacecatData, RhetoricalContextType } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { db, auth } from '../../firebase';
import { collection, addDoc, query, where, getDocs, doc, updateDoc, Timestamp } from 'firebase/firestore';

// Define the shape of our state
interface AnalysisState {
    annotations: Annotation[];
    activeAnnotationId: string | null;
    sidebarOpen: boolean;
    rhetoricalContext: RhetoricalContextType | null;
    status: 'idle' | 'loading' | 'failed';
}

const initialState: AnalysisState = {
    annotations: [],
    activeAnnotationId: null,
    sidebarOpen: true,
    rhetoricalContext: null,
    status: 'idle',
};

// ------------------------------------------------------------------
// THUNK: Fetch Annotations from Firestore
// ------------------------------------------------------------------
export const fetchAnnotations = createAsyncThunk(
    'analysis/fetchAnnotations',
    async (textId: string) => {
        if (!auth.currentUser) return [];

        const q = query(
            collection(db, 'annotations'),
            where('textId', '==', textId),
            where('userId', '==', auth.currentUser.uid)
        );

        const querySnapshot = await getDocs(q);
        const fetchedNotes: Annotation[] = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            fetchedNotes.push({
                id: doc.id,
                ...data,
                // Convert Firestore Timestamp to ISO string if needed, or if stored as string keep as is
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
            } as Annotation);
        });

        return fetchedNotes;
    }
);

// ------------------------------------------------------------------
// THUNK: Save New Annotation to Firestore
// ------------------------------------------------------------------
export const saveAnnotation = createAsyncThunk(
    'analysis/saveAnnotation',
    async (annotation: Annotation) => {
        if (!auth.currentUser) throw new Error("User not authenticated");

        // We don't save the 'id' field to Firestore as the doc ID; we let Firestore generate one,
        // OR we use the UUID we generated. Let's start by adding a new doc.
        // Ideally, we want the local ID to match the Firestore ID if possible, 
        // but typically we addDoc and get an ID back. 
        // For simplicity in this prototype: Save the whole object.

        const docRef = await addDoc(collection(db, 'annotations'), {
            ...annotation,
            userId: auth.currentUser.uid,
            createdAt: Timestamp.now()
        });

        // Return the ID assigned by Firestore (or keep our local UUID if we prefer to manage it there)
        // Here we'll just return the annotation as is, confirming save success.
        return { ...annotation, firestoreId: docRef.id };
    }
);

export const updateAnnotationInDb = createAsyncThunk(
    'analysis/updateAnnotationInDb',
    async ({ id, changes }: { id: string; changes: Partial<Annotation> }) => {
        // In a real app, map local UUID 'id' to Firestore Document ID
        // For this prototype, we're assuming we might query by 'id' field or similar.
        // BUT: Since we used addDoc above, the 'id' in Redux is a uuidv4, not the Firestore doc ID.
        // A robust solution requires querying for the doc where 'id' == uuid.

        const q = query(collection(db, 'annotations'), where('id', '==', id));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            const docRef = snapshot.docs[0].ref;
            await updateDoc(docRef, changes);
        }
        return { id, changes };
    }
);

const analysisSlice = createSlice({
    name: 'analysis',
    initialState,
    reducers: {
        // When user selects text, we create a local temp annotation immediately for UI responsivenes
        // Then we can trigger the save thunk.
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
    extraReducers: (builder) => {
        builder
            .addCase(fetchAnnotations.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAnnotations.fulfilled, (state, action) => {
                state.status = 'idle';
                // Merge fetched annotations, avoiding duplicates if any
                state.annotations = action.payload;
            })
            .addCase(saveAnnotation.fulfilled, (state, action) => {
                // Already added optimistically via createAnnotation, so standard "do nothing" or sync ID
            });
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
