import React from 'react';
import { usePost } from './Post.hook';
import { PostView } from './Post.view';

type PostProps = {
  workId: number;
};

export const Post: React.FC<PostProps> = (
  { workId }
): JSX.Element => {
  const viewProps = usePost({ workId });
  return <PostView {...viewProps} />;
};

export default Post;