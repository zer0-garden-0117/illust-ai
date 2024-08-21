import React, { memo } from 'react';
import { useTemplate } from './Template.hook';
import { TemplateView } from './Template.view';

type Props = Parameters<typeof useTemplate>[0];

export const Template: React.FC<Props> = memo((props: Props): JSX.Element => {
  const viewProps = useTemplate(props);
  return <TemplateView {...viewProps} />;
});

export default Template;