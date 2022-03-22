import { configureStore } from '@reduxjs/toolkit';
import unitReducer from './features/unit';

export const store = configureStore({
  reducer: {
    unit: unitReducer,
  },
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
