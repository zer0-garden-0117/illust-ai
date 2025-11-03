'use client';

import React from 'react';
import { useEditForm } from './EditForm.hook';
import { EditFormView } from './EditForm.view';

type EditFormProps = {
  workId: string;
};

export const EditForm: React.FC<EditFormProps> = (
  { workId }
): JSX.Element => {
  const viewProps = useEditForm({ workId });
  return <EditFormView {...viewProps} />;
};

export default EditForm;