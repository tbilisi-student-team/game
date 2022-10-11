import { AxiosRequestConfig } from 'axios';

import { ypTechHTTPClient } from '@/YPTechHTTPClient/index';;

export type AddNewLeader = {
  "data": {"username": string, "score": number, "id": number, "game": string},
  "ratingFieldName": "score",
  "teamName": "tbilisi"
}

export function addNewLeader(data: AddNewLeader, config?: AxiosRequestConfig) {
  return ypTechHTTPClient.post('/leaderboard', data, { withCredentials: true, ...config });
}