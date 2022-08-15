import { AxiosRequestConfig } from 'axios';

import { httpClient } from 'core';

export type ChangeUserProfileAvatarRequest = FormData;

export type ChangeUserProfileAvatarResponse = {
  id: number,
  first_name: string,
  second_name: string,
  display_name: string,
  login: string,
  email: string,
  phone: string,
  avatar: string,
}

export type ChangeUserProfileAvatarErrorResponse = {
  reason: string,
}

export function changeUserProfileAvatar(data: ChangeUserProfileAvatarRequest, config?: AxiosRequestConfig) {
  return httpClient.put('/user/profile/avatar', data, config);
}
