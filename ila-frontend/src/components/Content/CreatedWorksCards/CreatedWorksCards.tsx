'use client';

import React from 'react';
import { useCreatedWorksCards } from './CreatedWorksCards.hook';
import { CreatedWorksCardsView } from './CreatedWorksCards.view';
import type { components } from "../../../generated/services/ila-v1";
export type WorksUserFilterTypeQueryParam = components["parameters"]["WorksUserFilterTypeQueryParam"];

type CreatedWorksCardsProps = {
  customUserId: string;
  page: number;
  userWorksFilterType: WorksUserFilterTypeQueryParam;
};

export const CreatedWorksCards: React.FC<CreatedWorksCardsProps> = ({ customUserId, page, userWorksFilterType }): JSX.Element => {
  const viewProps = useCreatedWorksCards({ customUserId, page, userWorksFilterType });
  return <CreatedWorksCardsView {...viewProps} />;
};

export default CreatedWorksCards;