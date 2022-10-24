import { AxiosRequestConfig } from 'axios';

import { HTTPClient } from '@/HTTPClient/index';

import Topic from './types/Topic';

export type CreateForumTopicRequest = {
  title: string,
  text: string,
  authorName: string,
}

export function createForumTopic(data: CreateForumTopicRequest, config?: AxiosRequestConfig) {
  return HTTPClient.post<Topic>('/api/forum/topic/create', data, config);
}
