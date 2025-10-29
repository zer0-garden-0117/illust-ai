import { ActionIcon, AspectRatio, Card, Group, Image, Skeleton, Text } from '@mantine/core';
import { useIntersection } from '@mantine/hooks';
import { useRouter } from 'next/navigation';
import React from 'react';
import type { components } from "../../../../generated/services/ila-v1";

export type ApiWork = components["schemas"]["ApiWork"];

interface ImageCardsForHistoryProps {
  data: ApiWork;
  index: number;
}

export const ImageCardsForHistory = ({ data, index }: ImageCardsForHistoryProps) => {
  const router = useRouter();
  const { ref, entry } = useIntersection({
    root: null,
    threshold: 0.2,
  });
  const [imgLoaded, setImgLoaded] = React.useState(false);

  return (
    <Card
      ref={ref}
      p="md"
      radius="md"
      withBorder
      style={{ cursor: 'pointer' }}
      onClick={() => {router.push(`/draw/history/${data.workId}`)}}
    >
      {/* 画像 */}
      <AspectRatio ratio={1 / Math.sqrt(2)}>
        <Skeleton
          visible={!imgLoaded || data.thumbnailImgUrl === ''}
          h="100%"
          w="100%"
          radius="sm"
        >
          <div style={{ cursor: 'pointer', width: '100%', height: '100%' }}>
            <Image
              src={data.thumbnailImgUrl}
              alt={data.mainTitle || 'Image without title'}
              style={{ width: '100%', height: '100%', opacity: imgLoaded ? 1 : 0, transition: 'opacity 200ms ease' }}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgLoaded(true)}
              loading="lazy"
            />
          </div>
        </Skeleton>
      </AspectRatio>

      {/* タイトル */}
      <Group style={{ width: '100%', overflow: 'hidden' }}>
        <Text
          mt={5}
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {data.mainTitle}
        </Text>
      </Group>

      {/* アクション */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
        <ActionIcon variant="transparent" color="gray">
          test
        </ActionIcon>
      </div>
    </Card>
  );
};

ImageCardsForHistory.displayName = 'ImageCardsForHistory';