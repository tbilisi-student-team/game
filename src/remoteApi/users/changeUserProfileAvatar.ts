import { AxiosRequestConfig } from 'axios';

import { httpClient } from 'core';

export type ChangeUserProfileAvatarRequest = FormData;

export function changeUserProfileAvatar(data: ChangeUserProfileAvatarRequest, config?: AxiosRequestConfig) {
  return httpClient.put('/user/profile/avatar', data, { withCredentials: true, ...config });
}
