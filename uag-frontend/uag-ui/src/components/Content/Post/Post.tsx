import React from 'react';
import { usePost } from './Post.hook';
import { PostView } from './Post.view';

export const Post: React.FC = (): JSX.Element => {
  const viewProps = usePost();
  return <PostView {...viewProps} />;
};

export default Post;