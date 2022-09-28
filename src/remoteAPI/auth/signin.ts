import { AxiosRequestConfig } from 'axios';

import { ypTechHTTPClient } from '@/YPTechHTTPClient/index';

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
  return ypTechHTTPClient.post('/auth/signin', data, { withCredentials: true, ...config });
}
