import { AxiosRequestConfig } from 'axios';

import { ypTechHTTPClient } from '@/YPTechHTTPClient/index';;

export type DataToSend = {"username": string, "score": number, "id": number, "game": string}
export type AddNewLeader = {
  "data": DataToSend,
  "ratingFieldName": "score",
  "teamName": "tbilisi"
}

export function addNewLeader(data: DataToSend, config?: AxiosRequestConfig) {
  const dataToSend = {
    "data": data,
    "ratingFieldName": "score",
    "teamName": "tbilisi"
  }
  return ypTechHTTPClient.post('/leaderboard', dataToSend, { withCredentials: true, ...config });
}