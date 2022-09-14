import { AxiosRequestConfig } from 'axios';

import { ypTechHTTPClient } from '@/YPTechHTTPClient/index';

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
  return ypTechHTTPClient.get<GetUserByIdResponse>(`/user/${data.id}`, config);
}
