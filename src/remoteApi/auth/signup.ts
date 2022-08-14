import { AxiosRequestConfig } from 'axios';

import { httpClient } from 'core';

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

export type SignUpErrorResponseData = {
  reason: string,
}

export function signup(data: SignUpRequest, config?: AxiosRequestConfig) {
  return httpClient.post('/auth/signup', data, config)
}
