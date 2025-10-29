import { ActionIcon, AspectRatio, Card, Group, Image, Text } from '@mantine/core';
import { useIntersection } from '@mantine/hooks';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
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
  const [hasAppeared, setHasAppeared] = React.useState(false);

  useEffect(() => {
    if (entry?.isIntersecting) {
      setHasAppeared(true);
    }
  }, [entry]);

  return (
    <Card
      ref={ref}
      p="md"
      radius="md"
      withBorder
      style={{
        opacity: hasAppeared ? 1 : 0,
        transform: hasAppeared ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`,
        cursor: 'pointer'
      }}
      onClick={() => {router.push(`/draw/history/${data.workId}`)}}
    >
      {/* 画像 */}
      <AspectRatio ratio={1 / Math.sqrt(2)}>
        <div style={{ cursor: 'pointer' }}>
          <Image
            src={data.thumbnailImgUrl}
            alt={data.mainTitle || 'Image without title'}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
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