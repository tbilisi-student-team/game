import { AxiosRequestConfig } from 'axios';

import { HTTPClient } from '@/HTTPClient/index';

import Comment from './types/Comment';

export type CreateForumCommentToCommentRequest = {
  text: string,
  authorName: string,
  ParentCommentId: number,
}

export function createForumCommentToComment(data: CreateForumCommentToCommentRequest, config?: AxiosRequestConfig) {
  return HTTPClient.post<Comment[]>('/api/forum/comment/create/to-comment', data, config);
}
