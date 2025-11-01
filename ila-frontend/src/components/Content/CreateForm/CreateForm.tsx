'use client';

import React from 'react';
import { useCreateWork } from './CreateForm.hook';
import { CreateWorkView } from './CreateForm.view';

export const CreateWork: React.FC = (): JSX.Element => {
  const viewProps = useCreateWork();
  return <CreateWorkView {...viewProps} />;
};

export default CreateWork;