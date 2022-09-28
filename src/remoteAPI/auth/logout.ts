import { AxiosRequestConfig } from 'axios';

import { ypTechHTTPClient } from '@/YPTechHTTPClient/index';

export function logout(config?: AxiosRequestConfig) {
  return ypTechHTTPClient.post('/auth/logout', undefined, config);
}
