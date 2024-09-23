'use client';

import React, { useState } from 'react';
import { Button, Text, Fieldset, Grid, Image as MantineImage, Loader, Pill, Space, Group, Rating, ActionIcon, Modal } from '@mantine/core';
import { memo } from 'react';
import { useTranslations } from "next-intl";
import { RiHeartAdd2Line } from "react-icons/ri";
import { WorkGetByIdResult } from '@/apis/openapi/works/useWorksGetById';
import { GoDownload } from "react-icons/go";
import AuthModal from '@/components/Header/AuthModal/AuthModal';

type WorkViewProps = {
  workData?: WorkGetByIdResult;
  loading: boolean;
  localIsLiked: boolean;
  localRating?: number;
  onRateClick: (rating: number) => void;
  onLikeClick: () => void;
  onTagClick: (tag: string | undefined) => void;
  onCreatorClick: (creator: string | undefined) => void;
  onCharacterClick: (character: string | undefined) => void;
  onGenreClick: (genre: string | undefined) => void;
  isAuthenticated: boolean;
};

export const WorkView = memo(function WorkViewComponent({
  workData,
  loading,
  localIsLiked,
  localRating,
  onRateClick,
  onLikeClick,
  onTagClick,
  onCreatorClick,
  onCharacterClick,
  onGenreClick,
  isAuthenticated
}: WorkViewProps): JSX.Element {
  const t = useTranslations("");
  const [opened, setOpened] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const handleLikeClick = () => {
    if (!isAuthenticated) {
      setLoginModalOpen(true);
      return;
    }
    onLikeClick();
  };

  const handleRateClick = (rating: number) => {
    if (!isAuthenticated) {
      setLoginModalOpen(true);
      return;
    }
    onRateClick(rating);
  };

  const handleDownloadClick = () => {
    if (!isAuthenticated) {
      setLoginModalOpen(true);
      return;
    }
    setOpened(true);
  };

  if (loading) {
    return <></>;
  }

  return (
    <>
      <Fieldset legend={""}>
        <Grid justify="center" style={{ marginTop: '20px', marginBottom: '20px' }}>
          <Grid.Col span={{ base: 12, sm: 6, lg: 6 }} style={{ display: 'flex', justifyContent: 'center' }}>
            {workData?.apiWork?.titleImgUrl ? (
              <MantineImage
                src={workData.apiWork.titleImgUrl}
                style={{ maxWidth: '350px' }}
                onContextMenu={(e) => e.preventDefault()}
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
                  <Pill key={index} onClick={() => onTagClick(tagItem.tag)} style={{ cursor: 'pointer' }}>
                    {tagItem.tag}
                  </Pill>
                ))}
              </Pill.Group>
            </Group>
            <Group style={{ marginTop: '5px' }}>
              <Text>作者:</Text>
              {workData?.apiCreators?.map((creatorItem, index) => (
                <Pill key={index} onClick={() => onCreatorClick(creatorItem.creator)} style={{ cursor: 'pointer' }}>
                  {creatorItem.creator}
                </Pill>
              ))}
            </Group>
            <Group style={{ marginTop: '5px' }}>
              <Text>キャラクター名:</Text>
              {workData?.apiCharacters?.map((characterItem, index) => (
                <Pill key={index} onClick={() => onCharacterClick(characterItem.character)} style={{ cursor: 'pointer' }}>
                  {characterItem.character}
                </Pill>
              ))}
            </Group>
            <Group style={{ marginTop: '5px' }}>
              <Text>タイプ:</Text>
              <Pill onClick={() => onGenreClick(workData?.apiWork?.genre)} style={{ cursor: 'pointer' }}>
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
              <Button
                onClick={handleDownloadClick}
                variant="light"
                color='gray'
                size="xs"
                radius="xs"
                leftSection={<GoDownload size={14} />}
              >
                Download
              </Button>
            </Group>
          </Grid.Col>
        </Grid>
      </Fieldset>
      <AuthModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        size="auto"
        padding="xl"
        centered
        withCloseButton={false}
      >
        <MantineImage src={workData?.apiWork?.titleImgUrl} alt="Preview Image" />
      </Modal>
    </>
  );
});