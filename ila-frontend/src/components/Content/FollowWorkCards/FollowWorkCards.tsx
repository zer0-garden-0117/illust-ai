'use client';

import React from 'react';
import { useFollowWorkCards } from './FollowWorkCards.hook';
import { FollowWorkCardsView } from './FollowWorkCards.view';

export const FollowWorkCards: React.FC = (): JSX.Element => {
  const viewProps = useFollowWorkCards();
  return <FollowWorkCardsView {...viewProps} />;
};

export default FollowWorkCards;