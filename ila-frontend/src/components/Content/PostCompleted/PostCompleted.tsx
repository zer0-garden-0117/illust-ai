'use client';

import React from 'react';
import { usePostCompleted } from './PostCompleted.hook';
import { PostCompletedView } from './PostCompleted.view';

type PostCompletedProps = {
  workId: string;
};

export const PostCompleted: React.FC<PostCompletedProps> = (
  { workId }
): JSX.Element => {
  const viewProps = usePostCompleted({ workId });
  return <PostCompletedView {...viewProps} />;
};

export default PostCompleted;