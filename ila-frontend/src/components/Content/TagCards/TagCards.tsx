'use client';

import React from 'react';
import { useTagCards } from './TagCards.hook';
import { TagCardsView } from './TagCards.view';

type TagCardsProps = {
  tag: string;
};

export const TagCards: React.FC<TagCardsProps> = ({ tag }): JSX.Element => {
  const viewProps = useTagCards({ tag });
  return <TagCardsView {...viewProps} />;
};

export default TagCards;