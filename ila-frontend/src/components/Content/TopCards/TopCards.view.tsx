'use client';

import React, { memo } from 'react';
import { Group, Card, Grid, Image, Textarea, AspectRatio, Center, Button, Loader, Space, SimpleGrid } from '@mantine/core';
import { IconCheck, IconPencil } from '@tabler/icons-react';
import { PublicWorksGetResult } from '@/apis/openapi/works/usePublicWorksGet';
import { ImageCard } from '../ImageCard/ImageCard';

type TopCardsViewProps = {
  worksData: PublicWorksGetResult | undefined;
  isSubmitting: boolean;
  handleMoreClick: () => Promise<void>;
};

export const TopCardsView = memo(function WorkViewComponent({
  worksData,
  isSubmitting,
  handleMoreClick
}: TopCardsViewProps): JSX.Element {
  return (
    <>
      <Card withBorder padding="md" radius="md">

        {/* newの作品 */}
        <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 4, xl: 4 }} spacing={{ base: 20 }}>
        {!worksData &&
          Array.from({ length: 12 }).map((_, idx) => (
            <ImageCard key={idx} data={{}} index={idx} />
          ))
        }
          {worksData?.works?.map((work, idx) => (
            <ImageCard key={work.apiWork?.workId} data={work} index={idx} />
          ))}
        </SimpleGrid>
        <Space h="md" />

        {/* もっとボタン */}
        <Center>
          <Button
            variant="outline"
            onClick={handleMoreClick}
            loading={isSubmitting}
          >
            もっと見る
          </Button>
        </Center>

      </Card>
    </>
  );
});
TopCardsView.displayName = 'TopCardsView';