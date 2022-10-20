import { configureStore } from '@reduxjs/toolkit';

import { currentUserReducer, leaderboardReducer } from './slices';

export const reduxStore = configureStore({
  reducer: {
    currentUser: currentUserReducer,
    leaderboard: leaderboardReducer
  },
});
