type ForumComment = {
  id: number,
  authorName: string,
  text: string,
  createdAt: Date,
  updatedAt: Date,
  TopicId: number,
  ChildCommentId: number | null,
  ParentCommentId: number | null,
};

export default ForumComment;
