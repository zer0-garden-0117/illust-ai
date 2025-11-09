import { ActionIcon, AspectRatio, Card, Group, Image, Skeleton, Text } from '@mantine/core';
import { useRouter } from 'next/navigation';
import React from 'react';
import type { components } from "../../../generated/services/ila-v1";

export type ApiWorkWithTag = components["schemas"]["ApiWorkWithTag"];

interface ImageCardProps {
  data: ApiWorkWithTag | undefined;
  index: number;
}

export const ImageCard = ({ data, index }: ImageCardProps) => {
  const router = useRouter();
  const [imgLoaded, setImgLoaded] = React.useState(false);

  return (
    <Card
      p="md"
      radius="md"
      withBorder
      style={{ cursor: 'pointer' }}
      onClick={() => {
        // data.statusがpostedの時はillust/[workId]に遷移し、それ以外の時はillust/history/[workId]に遷移
        data?.apiWork?.status === 'posted' ?
          router.push(`/illust/${data?.apiWork?.workId}`) :
          router.push(`/illust/history/${data?.apiWork?.workId}`)
      }}
    >
      {/* 画像 */}
      <Card.Section>
      <AspectRatio ratio={1 / Math.sqrt(2)}>
        <Skeleton
          visible={!imgLoaded || data?.apiWork?.thumbnailImgUrl === ''}
          h="106%"
          w="100%"
          radius="sm"
        >
          <Image
            src={data?.apiWork?.thumbnailImgUrl}
            alt={data?.apiWork?.mainTitle || 'Image without title'}
            style={{ width: '100%', height: '100%', opacity: imgLoaded ? 1 : 0, transition: 'opacity 200ms ease' }}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgLoaded(true)}
            loading="lazy"
          />
        </Skeleton>
      </AspectRatio>
      </Card.Section>

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
          {data?.apiWork?.mainTitle}
        </Text>
      </Group>

      {/* 生成日時 */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px'}}>
          {data?.apiWork?.createdAt ? (
            // 日付は2025/03/15(土)のように表示
            <Text fz="xs" color="dimmed">
            <span>
              {new Date(data.apiWork.createdAt).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                weekday: 'short',
              })}
            </span>
            </Text>
          ) : (
            <Skeleton width={90} height={10} radius="sm" />
          )}
      </div>

    </Card>
  );
};

ImageCard.displayName = 'ImageCard';