import { ypTechHTTPClient } from '@/YPTechHTTPClient/index';
import { CurrentUserData } from '@/types/index';
import {AxiosRequestConfig} from "axios";

export function getCurrentUser(config?: AxiosRequestConfig) {
  return ypTechHTTPClient.get<CurrentUserData>('/auth/user', { withCredentials: true, ...config });
}
