'use client';

import React from 'react';
import { useDrawForm } from './DrawForm.hook';
import { DrawFormView } from './DrawForm.view';

export const DrawForm: React.FC = (): JSX.Element => {
  const viewProps = useDrawForm();
  return <DrawFormView {...viewProps} />;
};

export default DrawForm;