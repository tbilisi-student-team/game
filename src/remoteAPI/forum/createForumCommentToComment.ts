import { AxiosRequestConfig } from 'axios';

import { HTTPClient } from '@/HTTPClient/index';

import Comment from './types/Comment';

export type CreateForumCommentToCommentRequest = {
  text: string,
  authorName: string,
  ParentCommentId: number,
}

export function createForumCommentToComment(data: CreateForumCommentToCommentRequest, config?: AxiosRequestConfig) {
  return HTTPClient.post<{ comments: Comment[], comment: Comment }>('/api/forum/comment/create/to-comment', data, config);
}
