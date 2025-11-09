'use client';

import React from 'react';
import { Group, Image, ActionIcon, Skeleton, Menu } from '@mantine/core';
import { IconHeart, IconHeartFilled, IconShare, IconMenu2, IconEdit, IconTrash } from '@tabler/icons-react';
import { useFirebaseAuthContext } from '@/providers/auth/firebaseAuthProvider';

type WorkActionGroupProps = {
  workId: string;
  workCustomUserId?: string;
  thumbnailImgUrl?: string;
  isLiked?: boolean;
  isSubmitting: boolean;
  onOpen: () => void;
  onLikeClick: (workId: string) => void;
  onEditClick: (workId: string) => void;
  onDeleteClick: (workId: string) => void;
};

export const WorkActionGroup = ({
  workId,
  workCustomUserId,
  thumbnailImgUrl,
  isLiked,
  isSubmitting,
  onOpen,
  onLikeClick,
  onEditClick,
  onDeleteClick,
}: WorkActionGroupProps) => {
  const { user } = useFirebaseAuthContext();

  const iconButtonStyle = {
    backgroundColor: 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-5))',
    '&:hover': {
      backgroundColor: 'light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-6))',
    },
  };

  return (
    <Group justify="flex-end">
      {/* サムネイル画像 */}
      <Image
        src={thumbnailImgUrl}
        style={{ cursor: 'pointer' }}
        onClick={onOpen}
        alt=""
      />

      {/* いいね */}
      {/* userがない場合は非表示 */}
      {user && (
        <ActionIcon style={iconButtonStyle} onClick={() => onLikeClick(workId)}>
          {isSubmitting ? (
            <Skeleton width={16} height={16} />
          ) : isLiked ? (
            <IconHeartFilled size={16} color="var(--mantine-color-red-6)" />
        ) : (
          <IconHeart size={16} color="var(--mantine-color-gray-6)" />
        )}
        </ActionIcon>
      )}

      {/* シェア */}
      <ActionIcon style={iconButtonStyle}>
        <IconShare size={16} color="var(--mantine-color-blue-6)" />
      </ActionIcon>

      {/* メニュー */}
      {/* customUserIdとuser.customUserIdが一致する場合のみ表示 */}
      {user && workCustomUserId === user.customUserId && (
        <Menu shadow="md">
          <Menu.Target>
            <ActionIcon style={iconButtonStyle}>
              <IconMenu2 size={16} color="var(--mantine-color-gray-6)" />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconEdit size={14} />}
              onClick={() => onEditClick(workId)}
            >
              編集
            </Menu.Item>
            <Menu.Item
              color="red"
              leftSection={<IconTrash size={14} />}
              onClick={() => onDeleteClick(workId)}
            >
              削除
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      )}
    </Group>
  );
};