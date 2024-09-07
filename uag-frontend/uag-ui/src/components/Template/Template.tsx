import React from 'react';
import { useTemplate } from './Template.hook';
import { TemplateView } from './Template.view';

export const Template: React.FC = (): JSX.Element => {
  const viewProps = useTemplate();
  return <TemplateView {...viewProps} />;
};

export default Template;