import { AxiosRequestConfig } from 'axios';

import { HTTPClient } from '@/HTTPClient/index';

import Comment from './types/Comment';

export type GetForumCommentCommentsByParentCommentIdRequestData = {
  parentCommentId: number,
}

export function getForumCommentCommentsByParentCommentId(data: GetForumCommentCommentsByParentCommentIdRequestData, config?: AxiosRequestConfig) {
  return HTTPClient.get<Comment[]>(`/api/forum/comment/comments?parentCommentId=${data.parentCommentId}`, config);
}
