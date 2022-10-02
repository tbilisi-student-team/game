import { AxiosRequestConfig } from 'axios';

import { ypTechHTTPClient } from '@/YPTechHTTPClient/index';;

export type AddNewLeader = {
  "data": {"name": string, "score": number},
  "ratingFieldName": "score",
  "teamName": "tbilisi"
}

export function addNewLeader(data: AddNewLeader, config?: AxiosRequestConfig) {
  return ypTechHTTPClient.post('/leaderboard', data, { withCredentials: true, ...config });
}