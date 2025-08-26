'use client';

import { useFirebaseAuthContext } from '@/providers/auth/firebaseAuthProvider';
import { Button, Group, Avatar, Text, Loader } from '@mantine/core';

interface AuthButtonProps {
  onSuccess?: () => void;
}

export default function AuthButton({ onSuccess }: AuthButtonProps) {
  const { user, loading, twitterSignIn, signOut } = useFirebaseAuthContext();
  
  const handleTwitterLogin = async () => {
    try {
      const result = await twitterSignIn();
      console.log('Twitter username:', result.additionalUserInfo);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return <Loader size="sm" />;
  }

  return (
    <Group>
      {user ? (
        <Group>
          <Avatar 
            src={user.photoURL} 
            alt="Profile"
            radius="xl"
            size="md"
          />
          <div>
            <Text size="sm" fw={500}>
              Welcome, {user.displayName}!
            </Text>
            <Text size="xs" c="dimmed">
              {user.email}
            </Text>
          </div>
          <Button 
            onClick={handleSignOut} 
            variant="outline" 
            color="red"
            size="sm"
          >
            Logout
          </Button>
        </Group>
      ) : (
        <Button 
          onClick={handleTwitterLogin} 
          leftSection={
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          }
          color="blue"
          size="md"
        >
          Sign in with Twitter
        </Button>
      )}
    </Group>
  );
}