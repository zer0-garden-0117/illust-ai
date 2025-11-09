import { ActionIcon, AspectRatio, Card, Flex, Group, Image, Skeleton, Space, Text } from '@mantine/core';
import { useRouter } from 'next/navigation';
import React from 'react';
import type { components } from "../../../generated/services/ila-v1";
import { SkeltonIcon } from '../SkeltonIcon/SkeltonIcon';

export type ApiWorkWithTag = components["schemas"]["ApiWorkWithTag"];

interface ImageCardWithUserProps {
  data: ApiWorkWithTag | undefined;
  index: number;
}

export const ImageCardWithUser = ({ data, index }: ImageCardWithUserProps) => {
  const router = useRouter();
  const [imgLoaded, setImgLoaded] = React.useState(false);

  return (
    <Card
      p="md"
      radius="md"
      withBorder
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
              style={{ width: '100%', height: '100%', opacity: imgLoaded ? 1 : 0, transition: 'opacity 200ms ease', cursor: 'pointer' }}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgLoaded(true)}
              loading="lazy"
              onClick={() => {
                // data.statusがpostedの時はillust/[workId]に遷移し、それ以外の時はillust/history/[workId]に遷移
                data?.apiWork?.status === 'posted' ?
                  router.push(`/illust/${data?.apiWork?.workId}`) :
                  router.push(`/illust/history/${data?.apiWork?.workId}`)
              }}
            />
        </Skeleton>
      </AspectRatio>
      </Card.Section>

      {/* アイコン */}
      <Card.Section>
      <Flex gap={5} ml={10} mr={10} mb={10} mt={10} align="center">
        <SkeltonIcon
          profileImageUrl={data?.apiWork?.profileImageUrl}
          width={35}
          height={35}
          marginTop={0}
          isClickable={!!data?.apiWork?.customUserId}
          onClick={() => router.push(`/user/${data?.apiWork?.customUserId}`)}
        />
        <Flex direction="column" justify="center" style={{ flex: 1, minWidth: 0 }}>
          <Text
            fz="md"
            fw={700}
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: 'block',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
            {data?.apiWork?.description}
          </Text>
          <Text fz="xs" c="dimmed">
            {data?.apiWork?.userName}
          </Text>
        </Flex>
      </Flex>
      </Card.Section>
    </Card>
  );
};

ImageCardWithUser.displayName = 'ImageCardWithUser';