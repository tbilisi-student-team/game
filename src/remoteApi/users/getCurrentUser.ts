import { AxiosRequestConfig } from 'axios';

import { httpClient } from 'core';

export type GetCurrentUserResponse = {
  id: number,
  first_name: string,
  second_name: string,
  display_name: string,
  login: string,
  email: string,
  phone: string,
  avatar: string,
}

export function getCurrentUser(config?: AxiosRequestConfig) {
  return httpClient.get('/auth/user', { withCredentials: true, ...config });
}
