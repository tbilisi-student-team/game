import { AxiosRequestConfig } from 'axios';

import { HTTPClient } from '@/HTTPClient/index';

import Comment from './types/Comment';

export type GetForumTopicEmotionsByTopicIdRequestData = {
  topicId: number,
}

export function getForumTopicEmotionsByTopicId(data: GetForumTopicEmotionsByTopicIdRequestData, config?: AxiosRequestConfig) {
  return HTTPClient.get<Comment[]>(`/api/forum/topic/emotions?topicId=${data.topicId}`, config);
}
