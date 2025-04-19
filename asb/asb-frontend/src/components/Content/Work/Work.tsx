import React from 'react';
import { useWork } from './Work.hook';
import { WorkView } from './Work.view';

type WorkProps = {
  workId: string;
};

export const Work: React.FC<WorkProps> = (
  { workId }
): JSX.Element => {
  const viewProps = useWork({ workId });
  return <WorkView {...viewProps} />;
};

export default Work;