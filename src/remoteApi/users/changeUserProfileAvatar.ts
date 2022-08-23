import { AxiosRequestConfig } from 'axios';

import { httpClient } from 'core';

export type ChangeUserAvatarRequest = FormData;

export function changeUserProfileAvatar(data: ChangeUserAvatarRequest, config?: AxiosRequestConfig) {
  return httpClient.put('/user/profile/avatar', data, { withCredentials: true, ...config });
}
