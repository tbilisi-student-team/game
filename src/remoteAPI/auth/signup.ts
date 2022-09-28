import { AxiosRequestConfig } from 'axios';

import { ypTechHTTPClient } from '@/YPTechHTTPClient/index';

export type SignUpRequest = {
  first_name: string,
  second_name: string,
  login: string,
  email: string,
  password: string,
  phone: string,
}

export type SignUpResponse = {
  id: number,
}

export type SignUpErrorResponse = {
  reason: string,
}

export function signup(data: SignUpRequest, config?: AxiosRequestConfig) {
  return ypTechHTTPClient.post<SignUpResponse>('/auth/signup', data, config);
}
