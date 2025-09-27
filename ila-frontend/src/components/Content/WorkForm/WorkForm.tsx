'use client';

import React from 'react';
import { useWorkForm } from './WorkForm.hook';
import { WorkFormView } from './WorkForm.view';

type WorkFormProps = {
  workId: string;
};

export const WorkForm: React.FC<WorkFormProps> = (
  { workId }
): JSX.Element => {
  const viewProps = useWorkForm({ workId });
  return <WorkFormView {...viewProps} />;
};

export default WorkForm;