import axios, { AxiosInstance } from 'axios';
import qs from 'qs';
import { baseUrl } from './consts';

export abstract class BaseApi {
  protected http: AxiosInstance;

  protected constructor(endpoint: string) {
    this.http = axios.create({
      baseURL: `${baseUrl}${endpoint}`,
      timeout: 5000,
      withCredentials: true,
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'indices' }),
    });
  }
}
