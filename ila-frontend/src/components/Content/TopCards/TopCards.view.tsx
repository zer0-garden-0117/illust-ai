'use client';

import React, { memo } from 'react';
import { Card, Center, Button, Space, SimpleGrid } from '@mantine/core';
import { PublicWorksGetResult } from '@/apis/openapi/works/usePublicWorksGet';
import { ImageCard } from '../ImageCard/ImageCard';

type TopCardsViewProps = {
  worksData: PublicWorksGetResult | undefined;
  illustNum: number;
  isSubmitting: boolean;
  handleMoreClick: () => Promise<void>;
};

export const TopCardsView = memo(function WorkViewComponent({
  worksData,
  illustNum,
  isSubmitting,
  handleMoreClick
}: TopCardsViewProps): JSX.Element {
  const loadedCount = worksData?.works?.length ?? 0;
  const skeletonCount =
    worksData && illustNum > loadedCount ? illustNum - loadedCount : 0;
  const isMoreView =
    worksData && worksData.totalWorksCount && (worksData.totalWorksCount >= (worksData.works?.length ?? 0) + 4);
  console.log('totalWorksCount:', worksData?.totalWorksCount);
  console.log('worksData.works?.length:', worksData?.works?.length);

  return (
    <>
      <Card withBorder padding="md" radius="md">

        {/* newの作品 */}
        <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 4, xl: 4 }} spacing={{ base: 20 }}>
          {/* Skeleton */}
          {!worksData &&
            Array.from({ length: illustNum }).map((_, idx) => (
              <ImageCard key={idx} data={{}} index={idx} />
            ))
          }

          {/* 取得済みデータの表示 */}
          {worksData?.works?.map((work, idx) => (
            <ImageCard key={work.apiWork?.workId} data={work} index={idx} />
          ))}

          {/* もっと見るの再取得の分だけ Skeleton を末尾に追加 */}
          {worksData &&
            skeletonCount > 0 &&
            Array.from({ length: skeletonCount }).map((_, idx) => (
              <ImageCard
                key={`more-skeleton-${idx}`}
                data={{}}
                index={loadedCount + idx}
              />
            ))}
        </SimpleGrid>
        <Space h="md" />

        {/* もっとボタン */}
        {isMoreView && (
        <Center>
          <Button
            variant="outline"
            onClick={handleMoreClick}
            loading={isSubmitting}
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