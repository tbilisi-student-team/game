import { AxiosRequestConfig } from 'axios';

import { httpClient } from 'core';

export function logout(config?: AxiosRequestConfig) {
  return httpClient.post('/auth/logout', undefined, config)
}
