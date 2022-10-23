type ForumComment = {
  id: number,
  authorName: string,
  text: string,
  createdAt: string,
  updatedAt: string,
  TopicId: number,
  ChildCommentId: number | null,
  ParentCommentId: number | null,
};

export default ForumComment;
