'use client';

import { useFirebaseAuthContext } from '@/providers/auth/firebaseAuthProvider';
import { Button, Group, Avatar, Text, Loader } from '@mantine/core';
import { useEffect } from 'react';

type FollowButtonViewProps = {
  onFollow: () => void;
};


export default function FollowButtonView({ onFollow }: FollowButtonViewProps) {

  return (
    <Button 
      onClick={onFollow} 
      variant="outline" 
      size="sm"
    >
      Follow
    </Button>
  )
}