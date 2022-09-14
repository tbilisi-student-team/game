import { AxiosRequestConfig } from 'axios';

import { httpClient } from 'core';

export type GetUserByIdRequest = {
  id: number,
}

export type GetUserByIdResponse = {
  id: number,
  first_name: string,
  second_name: string,
  display_name: string,
  login: string,
  email: string,
  phone: string,
  avatar: string,
}

export function getUserById(data: GetUserByIdRequest, config?: AxiosRequestConfig) {
  return httpClient.get(`/user/${data.id}`, config);
}
