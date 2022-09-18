import {AxiosRequestConfig} from 'axios';

import {YP_TECH_BASE_URL} from "@/config/index";

export const AXIOS_REQUEST_TO_YP_TECH_CONFIG: AxiosRequestConfig = {
  baseURL: 'https://ya-praktikum.tech/api/v2',//TODO hack to fix undefined
  timeout: 20000,
}
