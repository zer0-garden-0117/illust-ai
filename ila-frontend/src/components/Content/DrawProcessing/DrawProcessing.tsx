'use client';

import React from 'react';
import { useWorkForm } from './DrawProcessing.hook';
import { WorkFormView } from './DrawProcessing.view';

type DrawProcessingrops = {
  workId: string;
};

export const WorkForm: React.FC<DrawProcessingrops> = (
  { workId }
): JSX.Element => {
  const viewProps = useWorkForm({ workId });
  return <WorkFormView {...viewProps} />;
};

export default WorkForm;