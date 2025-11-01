'use client';

import React from 'react';
import { usePostForm } from './PostForm.hook';
import { PostFormView } from './PostForm.view';

type PostFormProps = {
  workId: string;
};

export const PostForm: React.FC<PostFormProps> = (
  { workId }
): JSX.Element => {
  const viewProps = usePostForm({ workId });
  return <PostFormView {...viewProps} />;
};

export default PostForm;