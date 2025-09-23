'use client';

import React from 'react';
import { useLogoutButton } from './LogoutButton.hook';
import LogoutButtonView from './LogoutButton.view';

type LogoutButtonProps = {
  onSuccess?: () => void;
};

export const LogoutButton: React.FC<LogoutButtonProps> = (
  { onSuccess }
): JSX.Element => {
  const viewProps = useLogoutButton({ onSuccess });
  return <LogoutButtonView {...viewProps} />;
};

export default LogoutButton;