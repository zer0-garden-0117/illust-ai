'use client';

import React from 'react';
import { useUserWorkCards } from './UserWorksCards.hook';
import { UserWorkCardsView } from './UserWorksCards.view';
import type { components } from "../../../generated/services/ila-v1";
export type PublicWorksUserFilterTypeQueryParam = components["parameters"]["PublicWorksUserFilterTypeQueryParam"];

type UserWorkCardsProps = {
  customUserId: string;
  page: number;
  userWorksFilterType: PublicWorksUserFilterTypeQueryParam;
};

export const UserWorkCards: React.FC<UserWorkCardsProps> = ({ customUserId, page, userWorksFilterType }): JSX.Element => {
  const viewProps = useUserWorkCards({ customUserId, page, userWorksFilterType });
  return <UserWorkCardsView {...viewProps} />;
};

export default UserWorkCards;