import { AxiosRequestConfig } from 'axios';

import { httpClient } from 'core';

export type SignInRequest = {
  login: string,
  password: string,
}
export type SignInResponse = {
  id: number,
}

export type SignInErrorResponse = {
  reason: string,
}
export function signin(data: SignInRequest, config?: AxiosRequestConfig) {
  return httpClient.post('/auth/signin', data, { withCredentials: true, ...config });
}
