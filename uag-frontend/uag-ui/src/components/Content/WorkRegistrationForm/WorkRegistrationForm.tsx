import React, { memo } from 'react';
import { useWorkRegistrationForm } from './WorkRegistrationForm.hook';
import { WorkRegistrationFormView } from './WorkRegistrationForm.view';

export const WorkRegistrationForm: React.FC = memo((): JSX.Element => {
  const viewProps = useWorkRegistrationForm();
  return <WorkRegistrationFormView {...viewProps} />;
});

export default WorkRegistrationForm;