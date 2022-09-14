import { AxiosRequestConfig } from 'axios';

import { ypTechHTTPClient } from '@/YPTechHTTPClient/index';;

export type ChangeUserAvatarRequest = FormData;

export function changeUserProfileAvatar(data: ChangeUserAvatarRequest, config?: AxiosRequestConfig) {
  return ypTechHTTPClient.put('/user/profile/avatar', data, { withCredentials: true, ...config });
}
