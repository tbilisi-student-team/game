import {AxiosRequestConfig, AxiosResponse} from 'axios';

import { ypTechHTTPClient } from '@/YPTechHTTPClient/index';

export type SignInRequest = {
  login: string,
  password: string,
}

export type SignInResponse = string;

export type SignInErrorResponse = {
  reason: string,
}
export function signin(data: SignInRequest, config?: AxiosRequestConfig): Promise<AxiosResponse<SignInResponse>> {
  return ypTechHTTPClient.post('/auth/signin', data, { withCredentials: true, ...config });
}
