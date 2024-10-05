import React from 'react';
import { useRoulette } from './Roulette.hook';
import { RouletteView } from './Roulette.view';

export const Roulette: React.FC = (): JSX.Element => {
  const viewProps = useRoulette();
  return <RouletteView {...viewProps} />;
};

export default Roulette;