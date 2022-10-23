import { AxiosRequestConfig } from 'axios';

import { HTTPClient } from '@/HTTPClient/index';

import Topic from './types/Topic';

export type GetForumTopicByTopicIdRequestData = {
  topicId: number,
}

export function getForumTopicByTopicId(data: GetForumTopicByTopicIdRequestData, config?: AxiosRequestConfig) {
  return HTTPClient.get<Topic>(`/api/forum/topic?topicId=${data.topicId}`, config);
}
