'use client';

import { useFirebaseAuthContext } from '@/providers/auth/firebaseAuthProvider';
import { Button, Group } from '@mantine/core';

type LogoutButtonViewProps = {
  onLogout: () => void;
  isDisable: boolean;
};


export default function LogoutButtonView({ onLogout, isDisable }: LogoutButtonViewProps) {
  const { user } = useFirebaseAuthContext();

  // 認証済
  if (user) {
    return (
      <Group>
        <Button 
          onClick={onLogout} 
          variant="outline" 
          color="red"
          size="sm"
          radius={"xl"}
          disabled={isDisable}
        >
          Logout
        </Button>
      </Group> 
    )
  }
}