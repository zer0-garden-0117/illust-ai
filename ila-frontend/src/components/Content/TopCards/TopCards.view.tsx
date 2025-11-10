'use client';

import React, { memo } from 'react';
import { Card, Center, Button, Space, SimpleGrid, Text, Group } from '@mantine/core';
import { ImageCardWithUser } from '../ImageCardWithUser/ImageCardWithUser';
import { IconFilter2 } from '@tabler/icons-react';
import { PublicWorksGetResult } from '@/apis/openapi/publicworks/usePublicWorksGetByFilterInfinite';

type TopCardsViewProps = {
  worksData: PublicWorksGetResult | undefined;
  illustNum: number;
  isSubmitting: boolean;
  handleMoreClick: () => void;
  handleFollowClick: () => void;
};

export const TopCardsView = memo(function WorkViewComponent({
  worksData,
  illustNum,
  isSubmitting,
  handleMoreClick,
  handleFollowClick
}: TopCardsViewProps): JSX.Element {
  const loadedCount = worksData?.works?.length ?? 0;
  const skeletonCount =
    worksData && illustNum > loadedCount ? illustNum - loadedCount : 0;
  const isMoreView =
    worksData && worksData.totalWorksCount && (worksData.totalWorksCount >= (worksData.works?.length ?? 0) + 1);

  return (
    <>
      <Card withBorder padding="md" radius="md">
        <Group justify="space-between">
          <Text fz="md" fw={700} mb="xs">
            新着
          </Text>
          <Button
            radius={"xl"}
            variant="outline"
            size="xs"
            onClick={handleFollowClick}
            disabled={isSubmitting} 
            leftSection={
            <IconFilter2
              size={16}
              style={{ display: 'block' }}
            />
          }
          >
            フォロー中のみ表示
          </Button>
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
TopCardsView.displayName = 'TopCardsView';