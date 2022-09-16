import {AxiosRequestConfig} from 'axios';

import {YP_TECH_BASE_URL} from "@/config/index";

export const AXIOS_REQUEST_TO_YP_TECH_CONFIG: AxiosRequestConfig = {
  baseURL: YP_TECH_BASE_URL,
  timeout: 20000,
}
