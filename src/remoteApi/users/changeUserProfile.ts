import { AxiosRequestConfig } from 'axios';

import { httpClient } from 'core';

export type ChangeUserProfileRequest = {
  first_name: string,
  second_name: string,
  display_name: string,
  login: string,
  email: string,
  phone: string,
}

export type ChangeUserProfileResponse = {
  id: number,
  first_name: string,
  second_name: string,
  display_name: string,
  login: string,
  email: string,
  phone: string,
  avatar: string,
}

export type ChangeUserProfileErrorResponse = {
  reason: string,
}

export function changeUserProfile(data: ChangeUserProfileRequest, config?: AxiosRequestConfig) {
  return httpClient.put('/user/profile', data, config);
}
