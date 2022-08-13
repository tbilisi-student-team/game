import { createSlice } from '@reduxjs/toolkit';
import { UserState } from './types';
import { getUserData } from './actions';

const initialState: UserState = {
  data: null,
  loading: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(getUserData.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { reducer } = userSlice;
