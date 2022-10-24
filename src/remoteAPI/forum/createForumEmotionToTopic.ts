import { AxiosRequestConfig } from 'axios';

import { HTTPClient } from '@/HTTPClient/index';

import Emotion from './types/Emotion';

export type CreateForumEmotionToTopicRequest = {
  text: string,
  authorName: string,
  TopicId: number,
}

export function createForumEmotionToTopic(data: CreateForumEmotionToTopicRequest, config?: AxiosRequestConfig) {
  return HTTPClient.post<Emotion[]>('/api/forum/emotion/create/to-topic', data, config);
}
