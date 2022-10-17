import { AxiosRequestConfig } from 'axios';

import { ypTechHTTPClient } from '@/YPTechHTTPClient/index';

export type GetTeamLeaders = {
    "ratingFieldName": string,
    "cursor": number,
    "limit": number
}

export function getTeamLeaders(data: GetTeamLeaders = {
    ratingFieldName: 'score',
    cursor: 0,
    limit: 10,
}, config?: AxiosRequestConfig) {
    return ypTechHTTPClient.post(`/leaderboard/${process.env.TEAM || 'tbilisi'}`, data, { withCredentials: true, ...config });
}
