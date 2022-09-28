import { AxiosRequestConfig } from 'axios';

import { ypTechHTTPClient } from '@/YPTechHTTPClient/index';

export type ChangeUserPasswordRequest = {
  oldPassword: string,
  newPassword: string,
}

export function changeUserPassword(data: ChangeUserPasswordRequest, config?: AxiosRequestConfig) {
  return ypTechHTTPClient.put('/user/password', data, config);
}
