import { createAsyncThunk, createSlice, SerializedError } from '@reduxjs/toolkit';

import { Status } from '@/types/index';
import { getTeamLeaders } from '@/remoteAPI/index';
import { RootState } from '@/reduxStore/types';

export type AllLeadersData = Leader[];

export type Leader = {
  data: LeaderData,
}

export type LeaderData = {
  username: string,
  id: number,
  score: number,
  game: string,
}

type State = {
  data: AllLeadersData | null,
  status: Status,
  error: SerializedError | null,
}

const INITIAL_STATE: State = {
  data: null,
  status: Status.Idle,
  error: null,
};

export const fetchTeamLeadersData = createAsyncThunk('leaderboard/fetchTeamData', async () => {console.log('th')
  const axiosResponse = await getTeamLeaders();
  return axiosResponse.data.filter((item: Leader) => item.data.game === 'Pew');
});

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState: INITIAL_STATE,
  reducers: {
    updateLeaderboard(state, action) {
      state.data = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTeamLeadersData.pending, (state, action) => {
        state.status = Status.Pending;
      })
      .addCase(fetchTeamLeadersData.rejected, (state, action) => {
        state.status = Status.Rejected;
        state.error = action.error;
      })
      .addCase(fetchTeamLeadersData.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) {
          state.data = action.payload.sort((a, b) => {
            return Number(a.data.score) < Number(b.data.score) ? 1 : -1;
          });
          state.status = Status.Fulfilled;
        }
        else {
          state.status = Status.Rejected;
        }
      })
  }
})

export const leaderboardReducer = leaderboardSlice.reducer;

export const { updateLeaderboard } = leaderboardSlice.actions;

export const selectLeaderboardData = (state: RootState) => state.leaderboard.data;
export const selectLeaderboardStatus = (state: State) => state.status;
export const selectLeaderboardError = (state: State) => state.error;
