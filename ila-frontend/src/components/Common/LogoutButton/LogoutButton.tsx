'use client';

import React from 'react';
import { useLogoutButton } from './LogoutButton.hook';
import LogoutButtonView from './LogoutButton.view';

type LogoutButtonProps = {
  onSuccess?: () => void;
  isDisable? : boolean;
};

export const LogoutButton: React.FC<LogoutButtonProps> = (
  { onSuccess, isDisable }
): JSX.Element => {
  const viewProps = useLogoutButton({ onSuccess, isDisable });
  return <LogoutButtonView {...viewProps} />;
};

export default LogoutButton;