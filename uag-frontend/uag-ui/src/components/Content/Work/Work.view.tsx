'use client';

import React, { useState } from 'react';
import { Button, Text, Fieldset, Grid, Image as MantineImage, Loader, Pill, Space, Group, Rating, ActionIcon } from '@mantine/core';
import { memo } from 'react';
import { useTranslations } from "next-intl";
import { WorkGetByIdResult } from '@/apis/openapi/works/useWorksGetById';
import { RiHeartAdd2Line } from "react-icons/ri";
import { useRouter } from 'next/navigation'; // useRouterをインポート

type WorkViewProps = {
  workData?: WorkGetByIdResult;
  loading: boolean;
  onOpen: () => void;
};

export const WorkView = memo(function WorkViewComponent({
  workData,
  loading,
  onOpen
}: WorkViewProps): JSX.Element {
  const t = useTranslations("");
  const [localIsLiked, setLocalIsLiked] = useState(false);
  const [localRating, setLocalRating] = useState<number | undefined>();
  const router = useRouter(); // useRouterフックを使用

  if (loading) {
    return <></>;
  }

  const handleRateClick = (rating: number) => {
    setLocalRating(rating);
  };

  const handleLikeClick = () => {
    setLocalIsLiked(!localIsLiked);
  };

  const handleTagClick = (tag: string | undefined) => {
    if (tag) {
      router.push(`/tag/${encodeURIComponent(tag)}`);
    }
  };

  const handleCreatorClick = (creator: string | undefined) => {
    if (creator) {
      router.push(`/creator/${encodeURIComponent(creator)}`);
    }
  };

  const handleCharacterClick = (character: string | undefined) => {
    if (character) {
      router.push(`/character/${encodeURIComponent(character)}`);
    }
  };

  const handleGenreClick = (genre: string | undefined) => {
    if (genre) {
      router.push(`/genre/${encodeURIComponent(genre)}`);
    }
  };

  return (
    <Fieldset legend={""}>
      <Grid justify="center" style={{ marginTop: '20px', marginBottom: '20px' }}>
        <Grid.Col span={{ base: 12, sm: 6, lg: 6 }} style={{ display: 'flex', justifyContent: 'center' }}>
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
                <Pill key={index} onClick={() => handleTagClick(tagItem.tag)} style={{ cursor: 'pointer' }}>
                  {tagItem.tag}
                </Pill>
              ))}
            </Pill.Group>
          </Group>
          <Group style={{ marginTop: '5px' }}>
            <Text>作者:</Text>
            {workData?.apiCreators?.map((creatorItem, index) => (
              <Pill key={index} onClick={() => handleCreatorClick(creatorItem.creator)} style={{ cursor: 'pointer' }}>
                {creatorItem.creator}
              </Pill>
            ))}
          </Group>
          <Group style={{ marginTop: '5px' }}>
            <Text>キャラクター名:</Text>
            {workData?.apiCharacters?.map((characterItem, index) => (
              <Pill key={index} onClick={() => handleCharacterClick(characterItem.character)} style={{ cursor: 'pointer' }}>
                {characterItem.character}
              </Pill>
            ))}
          </Group>
          <Group style={{ marginTop: '5px' }}>
            <Text>タイプ:</Text>
            <Pill onClick={() => handleGenreClick(workData?.apiWork?.genre)} style={{ cursor: 'pointer' }}>
              {workData?.apiWork?.genre}
            </Pill>
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