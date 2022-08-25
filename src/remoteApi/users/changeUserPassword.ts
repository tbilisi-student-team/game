import { AxiosRequestConfig } from 'axios';

import { httpClient } from 'core';

export type ChangeUserPasswordRequest = {
  oldPassword: string,
  newPassword: string,
}

export function changeUserPassword(data: ChangeUserPasswordRequest, config?: AxiosRequestConfig) {
  return httpClient.put('/user/password', data, config);
}
