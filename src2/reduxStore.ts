import { configureStore } from '@reduxjs/toolkit';
import currentUserReducer from 'pages/App/currentUserSlice';

export const reduxStore = configureStore({
  reducer: {
    currentUser: currentUserReducer,
  },
});

export type RootState = ReturnType<typeof reduxStore.getState>;
export type AppDispatch = typeof reduxStore.dispatch;
