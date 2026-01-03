import { configureStore } from '@reduxjs/toolkit';
import analysisReducer from './features/analysis/analysisSlice';
import argumentReducer from './features/argument/argumentSlice';

export const store = configureStore({
    reducer: {
        analysis: analysisReducer,
        argument: argumentReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
