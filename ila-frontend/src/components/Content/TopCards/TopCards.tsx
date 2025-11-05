'use client';

import React from 'react';
import { useTopCards } from './TopCards.hook';
import { TopCardsView } from './TopCards.view';

export const TopCards: React.FC = (): JSX.Element => {
  const viewProps = useTopCards();
  return <TopCardsView {...viewProps} />;
};

export default TopCards;