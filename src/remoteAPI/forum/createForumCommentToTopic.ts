import { AxiosRequestConfig } from 'axios';

import { HTTPClient } from '@/HTTPClient/index';

import Comment from './types/Comment';

export type CreateForumCommentToTopicRequest = {
  text: string,
  authorName: string,
  TopicId: number,
}

export function createForumCommentToTopic(data: CreateForumCommentToTopicRequest, config?: AxiosRequestConfig) {
  return HTTPClient.post<{ comments: Comment[], comment: Comment }>('/api/forum/comment/create/to-topic', data, config);
}
