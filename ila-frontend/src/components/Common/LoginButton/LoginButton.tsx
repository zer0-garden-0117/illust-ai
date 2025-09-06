'use client';

import React from 'react';
import { useLoginButton } from './LoginButton.hook';
import LoginButtonView from './LoginButton.view';

type LoginButtonProps = {
  onSuccess?: () => void;
};

export const LoginButton: React.FC<LoginButtonProps> = (
  { onSuccess }
): JSX.Element => {
  const viewProps = useLoginButton({ onSuccess });
  return <LoginButtonView {...viewProps} />;
};

export default LoginButton;