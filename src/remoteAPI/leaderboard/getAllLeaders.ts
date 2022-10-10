import { AxiosRequestConfig } from 'axios';

import { ypTechHTTPClient } from '@/YPTechHTTPClient/index';;

export type GetAllLeaders = {
  "ratingFieldName": string,
  "cursor": number,
  "limit": number
}

export function getAllLeaders(data: GetAllLeaders, config?: AxiosRequestConfig) {
  return ypTechHTTPClient.post('/leaderboard/all', data, { withCredentials: true, ...config });
}