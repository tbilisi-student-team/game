import { configureStore } from '@reduxjs/toolkit';

import { currentUserReducer } from './slices';

export const reduxStore = configureStore({
  reducer: {
    currentUser: currentUserReducer,
  },
});
