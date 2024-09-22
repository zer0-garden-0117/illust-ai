'use client';

import React, { useState } from 'react';
import { Button, Text, Fieldset, Grid, Image as MantineImage, Loader, Pill, Space, Group, Rating, ActionIcon } from '@mantine/core';
import { memo } from 'react';
import { useTranslations } from "next-intl";
import { WorkGetByIdResult } from '@/apis/openapi/works/useWorksGetById';
import { RiHeartAdd2Line } from "react-icons/ri";

type PostViewProps = {
  workData?: WorkGetByIdResult;
  loading: boolean;
  onOpen: () => void;
};

export const PostView = memo(function PostViewComponent({
  workData,
  loading,
  onOpen
}: PostViewProps): JSX.Element {
  const t = useTranslations("");
  const [localIsLiked, setLocalIsLiked] = useState();
  const [localRating, setLocalRating] = useState();

  if (loading) {
    return <></>;
  }

  const handleRateClick = (rating: number) => {
  };


  const handleLikeClick = () => {
  };


  return (
    <Fieldset legend={t('')}>
      <Grid justify="center" style={{ marginTop: '20px', marginBottom: '20px' }}>
        <Grid.Col span={{ base: 12, sm: 6, lg: 6 }} style={{ display: 'flex', justifyContent: 'center' }}>
          <Space h="md" />
          <Space h="md" />
          <Space h="md" />
          <Space h="md" />
          {workData?.apiWork?.titleImgUrl ? (
            <MantineImage
              src={workData.apiWork.titleImgUrl}
              style={{ maxWidth: '350px' }}
            />
          ) : (
            <p>No image available</p>
          )}
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, lg: 6 }}>
          <Group style={{ marginTop: '20px' }}>
            <Text>タイトル:</Text>
            <Text>
              {workData?.apiWork?.mainTitle}
            </Text>
          </Group>
          <Group style={{ marginTop: '5px' }}>
            <Text>タグ:</Text>
            <Pill.Group gap={3}>
              {workData?.apiTags?.map((tagItem, index) => (
                <Pill key={index}>{tagItem.tag}</Pill>
              ))}
            </Pill.Group>
          </Group>
          <Group style={{ marginTop: '5px' }}>
            <Text>作者:</Text>
            {workData?.apiCreators?.map((creatorItem, index) => (
              <Pill key={index}>{creatorItem.creator}</Pill>
            ))}
          </Group>
          <Group style={{ marginTop: '5px' }}>
            <Text>キャラクター名:</Text>
            {workData?.apiCharacters?.map((characterItem, index) => (
              <Pill key={index}>{characterItem.character}</Pill>
            ))}
          </Group>
          <Group style={{ marginTop: '5px' }}>
            <Text>タイプ:</Text>
            <Pill>{workData?.apiWork?.genre}</Pill>
          </Group>
          <Group style={{ marginTop: '5px' }}>
            <Text>更新日:</Text>
            <Text>{workData?.apiWork?.updatedAt}</Text>
          </Group>
          <Group style={{ marginTop: '5px' }}>
            <Text>レビュー:</Text>
            <Rating value={localRating} onChange={handleRateClick} />
          </Group>
          <Group style={{ marginTop: '5px' }}>
            <Text>お気に入り:</Text>
            <ActionIcon
              variant="transparent"
              color="gray"
              style={{
                color: localIsLiked ? 'red' : 'gray',
                transition: 'color 0.3s ease',
                padding: 0,
                marginLeft: '-10px',
              }}
              onClick={handleLikeClick}
            >
              <RiHeartAdd2Line />
            </ActionIcon>
          </Group>
          <Group style={{ marginTop: '5px' }}>
            <Text>ダウンロード:</Text>
            <Text>ダウンロード</Text>
          </Group>
        </Grid.Col>
      </Grid>
    </Fieldset>
  );
});