import { AxiosRequestConfig } from 'axios';

import { HTTPClient } from '@/HTTPClient/index';

import Comment from './types/Comment';

export type GetForumTopicCommentsByTopicIdRequestData = {
  topicId: number,
}

export function getForumTopicCommentsByTopicId(data: GetForumTopicCommentsByTopicIdRequestData, config?: AxiosRequestConfig) {
  return HTTPClient.get<Comment[]>(`/api/forum/topic/comments?topicId=${data.topicId}`, config);
}
