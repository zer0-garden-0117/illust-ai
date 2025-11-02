'use client';

import React from 'react';
import { usePostedWork } from './PostedWork.hook';
import { PostedWorkView } from './PostedWork.view';

type PostedWorkProps = {
  workId: string;
};

export const Work: React.FC<PostedWorkProps> = (
  { workId }
): JSX.Element => {
  const viewProps = usePostedWork({ workId });
  return <PostedWorkView {...viewProps} />;
};

export default Work;