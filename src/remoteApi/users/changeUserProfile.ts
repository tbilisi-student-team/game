import { AxiosRequestConfig } from 'axios';

import { httpClient } from 'core';
import { UserResponse } from 'remoteApi';

export type ChangeUserProfileRequest = {
  first_name: string,
  second_name: string,
  display_name: string,
  login: string,
  email: string,
  phone: string,
}

export type ChangeUserProfileResponse = UserResponse;

export function changeUserProfile(data: ChangeUserProfileRequest, config?: AxiosRequestConfig) {
  return httpClient.put('/user/profile', data, config);
}
