'use client';

import { useFirebaseAuthContext } from '@/providers/auth/firebaseAuthProvider';
import { Button, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';

type FollowButtonViewProps = {
  isFollowState?: boolean;
  onFollow: () => void;
  onUnfollow: () => void;
};

export default function FollowButtonView({ isFollowState, onFollow, onUnfollow }: FollowButtonViewProps) {
  const { user } = useFirebaseAuthContext();
  const [isHover, setIsHover] = useState(false);
  const [justFollowed, setJustFollowed] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);

  const onHandleFollow = () => {
    if (!isFollowState) {
      setJustFollowed(true);
      onFollow();
    } else {
      open();
    }
  };

  const handleConfirmUnfollow = () => {
    setJustFollowed(false);
    onUnfollow();
    close();
  };

  const handleMouseLeave = () => {
    setIsHover(false);
    setJustFollowed(false);
  };

  if (!user) return null;

  return (
    <>
      <Button
        onClick={onHandleFollow}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={handleMouseLeave}
        variant="outline"
        size="sm"
        color={
          isFollowState
            ? (isHover && !justFollowed ? 'red' : 'gray')
            : 'blue'
        }
        radius="xl"
        disabled={justFollowed}
      >
        {isFollowState
          ? (isHover && !justFollowed ? 'フォロー解除' : 'フォロー中')
          : 'フォロー'}
      </Button>

      <Modal
        opened={opened}
        onClose={close}
        title="フォロー解除"
        centered
        radius={"md"}
      >
        <Text mb="md">このユーザーのフォローを解除します。よろしいですか？</Text>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <Button variant="default" onClick={close} radius="xl">
            キャンセル
          </Button>
          <Button color="red" onClick={handleConfirmUnfollow} radius="xl">
            フォロー解除
          </Button>
        </div>
      </Modal>
    </>
  );
}