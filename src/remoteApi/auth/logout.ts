import { AxiosRequestConfig } from 'axios';

import { httpClient } from '../../Core';

export function logout(config?: AxiosRequestConfig) {
  return httpClient.post('/auth/logout', undefined, config)
}
