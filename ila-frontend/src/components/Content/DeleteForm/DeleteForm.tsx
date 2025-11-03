'use client';

import React from 'react';
import { useDeleteForm } from './DeleteForm.hook';
import { DeleteFormView } from './DeleteForm.view';

type DeleteFormProps = {
  workId: string;
};

export const DeleteForm: React.FC<DeleteFormProps> = (
  { workId }
): JSX.Element => {
  const viewProps = useDeleteForm({ workId });
  return <DeleteFormView {...viewProps} />;
};

export default DeleteForm;