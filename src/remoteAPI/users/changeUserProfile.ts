import { AxiosRequestConfig } from 'axios';

import { ypTechHTTPClient } from '@/YPTechHTTPClient/index';
import { UserResponse } from './types';

export type ChangeUserProfileRequest = Omit<UserResponse, 'id' | 'avatar'>;

export type ChangeUserProfileResponse = UserResponse;

export function changeUserProfile(data: ChangeUserProfileRequest, config?: AxiosRequestConfig) {
  return ypTechHTTPClient.put<ChangeUserProfileResponse>('/user/profile', data, { withCredentials: true, ...config });
}
