import { createSlice, createAsyncThunk, SerializedError } from '@reduxjs/toolkit';

import { Status } from '@/types/index';
import { getAllLeaders } from '@/remoteAPI/index';

type AllLeadersData = [{
  username: string,
  id: number,
  score: number,
  team?: string,
}]

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

export const fetchAllLeadersData = createAsyncThunk('leaderboard/fetchData', async () => {
  const data={
    "ratingFieldName": "score",
    "cursor": 0,
    "limit": 100
  }
  const axiosResponse = await getAllLeaders(data);

  const allLeadersData = axiosResponse.data;
  console.log('allLeadersData', allLeadersData)
  return allLeadersData;
});

const leaderboardSlice = createSlice({
  name: 'leadersboard',
  initialState: INITIAL_STATE,
  reducers: {
    updateLeaderboard(state, action) {
      state.data = action.payload;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchAllLeadersData.pending, (state, action) => {
        state.status = Status.Pending;
      })
      .addCase(fetchAllLeadersData.rejected, (state, action) => {
        state.status = Status.Rejected;
        state.error = action.error;
      })
      .addCase(fetchAllLeadersData.fulfilled, (state, action) => {
        state.status = Status.Fulfilled;
        state.data = action.payload;
      })
  }
})

export const leaderboardReducer = leaderboardSlice.reducer;

export const { updateLeaderboard } = leaderboardSlice.actions;

export const selectLeaderboardData = (state: State) => state.data;
export const selectLeaderboardStatus = (state: State) => state.status;
export const selectLeaderboardError = (state: State) => state.error;
