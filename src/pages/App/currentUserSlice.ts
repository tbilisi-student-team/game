import { createSlice, createAsyncThunk, SerializedError, PayloadAction } from '@reduxjs/toolkit';

import { Status, CurrentUserData } from 'types';
import { getCurrentUser } from 'remoteApi';

type State = {
  data: CurrentUserData | null,
  status: Status,
  error: SerializedError | null,
}

const INITIAL_STATE: State = {
  data: null,
  status: Status.Idle,
  error: null,
};

export const fetchCurrentUserData = createAsyncThunk('currentUser/fetchData', async () => {
  const axiosResponse = await getCurrentUser();

  const currentUserData = axiosResponse.data as CurrentUserData;

  return currentUserData;
})

const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState: INITIAL_STATE,
  reducers: {
    updateCurrentUserData(state, action: PayloadAction<CurrentUserData>) {
      state.data = action.payload;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchCurrentUserData.pending, (state, action) => {
        state.status = Status.Pending;
      })
      .addCase(fetchCurrentUserData.rejected, (state, action) => {
        state.status = Status.Rejected;
        state.error = action.error;
      })
      .addCase(fetchCurrentUserData.fulfilled, (state, action) => {
        state.status = Status.Fulfilled;
        state.data = action.payload;
      })
  }
})

export default currentUserSlice.reducer;

export const { updateCurrentUserData } = currentUserSlice.actions;

export const selectCurrentUserData = (state: State) => state.data;
export const selectCurrentUserStatus = (state: State) => state.status;
export const selectCurrentUserError = (state: State) => state.error;


