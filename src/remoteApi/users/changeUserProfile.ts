import { AxiosRequestConfig } from 'axios';

import { httpClient } from 'core';
import { UserResponse } from 'remoteApi';

export type ChangeUserProfileRequest = Omit<UserResponse, 'id' | 'avatar'>;

export type ChangeUserProfileResponse = UserResponse;

export function changeUserProfile(data: ChangeUserProfileRequest, config?: AxiosRequestConfig) {
  return httpClient.put('/user/profile', data, { withCredentials: true, ...config });
}
