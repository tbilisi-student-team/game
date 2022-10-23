import { AxiosRequestConfig } from 'axios';

import { HTTPClient } from '@/HTTPClient/index';

import Topic from './types/Topic';

export function getForumTopics(config?: AxiosRequestConfig) {
  return HTTPClient.get<Topic[]>(`/api/forum/topics/all`, config);
}
