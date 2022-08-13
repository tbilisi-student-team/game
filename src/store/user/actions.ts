import { createAsyncThunk } from '@reduxjs/toolkit';
import { authController } from '../../components/AuthController';

export const getUserData = createAsyncThunk('user/fetchUserInfo', async () =>
  authController
    .getUserInfo()
    .then((response) => response.data)
    .catch(() => {}),
);
