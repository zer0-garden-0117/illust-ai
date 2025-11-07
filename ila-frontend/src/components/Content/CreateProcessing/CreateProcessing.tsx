'use client';

import React from 'react';
import { useCreateProcessing } from './CreateProcessing.hook';
import { CreateProcessingView } from './CreateProcessing.view';

type CreateProcessingrops = {
  workId: string;
};

export const CreateProcessing: React.FC<CreateProcessingrops> = (
  { workId }
): JSX.Element => {
  const viewProps = useCreateProcessing({ workId });
  return <CreateProcessingView {...viewProps} />;
};

export default CreateProcessing;