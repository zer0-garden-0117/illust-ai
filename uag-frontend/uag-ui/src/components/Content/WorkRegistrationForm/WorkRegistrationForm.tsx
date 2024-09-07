import React from 'react';
import { useWorkRegistrationForm } from './WorkRegistrationForm.hook';
import { WorkRegistrationFormView } from './WorkRegistrationForm.view';

export const WorkRegistrationForm: React.FC = (): JSX.Element => {
  const viewProps = useWorkRegistrationForm();
  return <WorkRegistrationFormView {...viewProps} />;
};

WorkRegistrationForm.displayName = 'WorkRegistrationForm';

export default WorkRegistrationForm;