import { AxiosRequestConfig } from 'axios';

import { httpClient } from '../../Core';

export type SignUpRequest = {
  first_name: string,
  second_name: string,
  login: string,
  email: string,
  password: string,
  phone: string,
}

export function signup(data: SignUpRequest, config?: AxiosRequestConfig) {
  return httpClient.post('/auth/signup', data, config)
}
