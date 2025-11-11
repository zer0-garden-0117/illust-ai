'use client';

import React, { memo } from 'react';
import { Card, Center, Button, Space, SimpleGrid, Text, Group, Skeleton } from '@mantine/core';
import { ImageCardWithUser } from '../ImageCardWithUser/ImageCardWithUser';
import { IconStar, IconStarFilled } from '@tabler/icons-react';
import { useFirebaseAuthContext } from '@/providers/auth/firebaseAuthProvider';
import { PublicWorksTagsGetResult } from '@/apis/openapi/publicworks/usePublicWorksTagsGetInfinite';
import { UsersTagGetResult } from '@/apis/openapi/myusers/useUsersTagGet';

type TagCardsViewProps = {
  tag: string;
  worksData: PublicWorksTagsGetResult | undefined;
  favoriteTagsData: UsersTagGetResult | undefined;
  illustNum: number;
  isSubmitting: boolean;
  handleMoreClick: () => void;
  handleFavoriteClick: (tag: string) => void;
};

export const TagCardsView = memo(function WorkViewComponent({
  tag,
  worksData,
  illustNum,
  favoriteTagsData,
  isSubmitting,
  handleMoreClick,
  handleFavoriteClick
}: TagCardsViewProps): JSX.Element {
  const { user } = useFirebaseAuthContext();
  const loadedCount = worksData?.works?.length ?? 0;
  const skeletonCount =
    worksData && illustNum > loadedCount ? illustNum - loadedCount : 0;
  const isMoreView =
    worksData && worksData.totalWorksCount && (worksData.totalWorksCount >= (worksData.works?.length ?? 0) + 1);
  const iconButtonStyle = {
    backgroundColor: 'light-dark(var(--mantine-color-white-0), var(--mantine-color-dark-5))',
    '&:hover': {
      backgroundColor: 'light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-6))',
    },
  };

  return (
    <>
      <Card withBorder padding="md" radius="md">
        <Group justify="space-between">
          <Text fz="md" fw={700} mb="xs">
            #{tag}
          </Text>
        {user && (
          <>
            {isSubmitting ? (
              <Skeleton width={20} height={20} />
            ) : favoriteTagsData?.isLiked ? (
                <Button
                  radius={"xl"}
                  variant="outline"
                  size="xs"
                  onClick={() => handleFavoriteClick("test")}
                  disabled={isSubmitting} 
                  leftSection={
                  <IconStarFilled
                    size={16}
                    style={{ display: 'block' }}
                  />
                  }
                >
                  お気に入り登録済
                </Button>
          ) : (
                <Button
                  radius={"xl"}
                  variant="outline"
                  size="xs"
                  onClick={() => handleFavoriteClick("test")}
                  disabled={isSubmitting} 
                  leftSection={
                  <IconStar
                    size={16}
                    style={{ display: 'block' }}
                  />
                  }
                >
                  お気に入り登録
                </Button>
          )}
          </>
        )}

        </Group>
        <Space h="xs" />

        {/* newの作品 */}
        <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 4, xl: 4 }} spacing={{ base: 20 }}>
          {/* Skeleton */}
          {!worksData &&
            Array.from({ length: illustNum }).map((_, idx) => (
              <ImageCardWithUser key={idx} data={{}} index={idx} />
            ))
          }

          {/* 取得済みデータの表示 */}
          {worksData?.works?.map((work, idx) => (
            <ImageCardWithUser key={work.apiWork?.workId} data={work} index={idx} />
          ))}

          {/* もっと見るの再取得の分だけ Skeleton を末尾に追加 */}
          {worksData &&
            skeletonCount > 0 &&
            Array.from({ length: skeletonCount }).map((_, idx) => (
              <ImageCardWithUser
                key={`more-skeleton-${idx}`}
                data={{}}
                index={loadedCount + idx}
              />
            ))}
        </SimpleGrid>
        <Space h="xs" />

        {/* もっとボタン */}
        {isMoreView && (
        <Center>
          <Button
            onClick={handleMoreClick}
            loading={isSubmitting}
            radius="xl"
          >
            もっと見る
          </Button>
        </Center>
        )}

      </Card>
    </>
  );
});
TagCardsView.displayName = 'TagCardsView';