'use client';

import React, { useEffect, useState } from 'react';
import { Button, Text, Fieldset, Grid, Image as MantineImage, Loader, Pill, Space, Group, Rating, ActionIcon, Modal, Transition } from '@mantine/core';
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
  const [isImageVisible, setIsImageVisible] = useState(false); // 通常時の画像表示状態を管理

  useEffect(() => {
    console.log("loading:", loading)
    console.log("titleImgUrl:", workData?.apiWork?.titleImgUrl)
    if (workData?.apiWork?.titleImgUrl) {
      setIsImageVisible(true); // 画像がロードされたら true に設定
    }
  }, [loading]);

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

  const formatDate = (isoString: string | undefined) => {
    if (!isoString) return ''; // 日付がない場合の処理
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月は0から始まるため+1
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  if (loading) {
    return <></>;
  }

  return (
    <>
      {!loading && (
        <Fieldset legend={""}>
          <Grid justify="center" style={{ marginTop: '20px', marginBottom: '20px' }}>
            <Grid.Col span={{ base: 12, sm: 6, lg: 6 }} style={{ display: 'flex', justifyContent: 'center' }}>
              {/* 通常時の画像表示にトランジションを追加 */}
              <Transition
                mounted={isImageVisible} // 画像が表示されるときにトランジションを実行
                transition="fade-up"
                duration={500}
                timingFunction="ease"
              >
                {(styles) => {
                  console.log('Transition mounted state:', isImageVisible); // mounted状態をログに出力
                  return workData?.apiWork?.titleImgUrl ? (
                    <MantineImage
                      src={workData.apiWork.titleImgUrl}
                      style={{ maxWidth: '350px', ...styles }} // トランジションのスタイルを適用
                      onClick={() => setOpened(true)}
                    />
                  ) : (
                    <p>No image available</p>
                  );
                }}
              </Transition>
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
                <Text>ジャンル:</Text>
                <Pill onClick={() => onGenreClick(workData?.apiWork?.genre)} style={{ cursor: 'pointer' }}>
                  {workData?.apiWork?.genre}
                </Pill>
              </Group>
              <Group style={{ marginTop: '5px' }}>
                <Text>更新日:</Text>
                <Text>{formatDate(workData?.apiWork?.updatedAt)}</Text>
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
                  radius="xl"
                  leftSection={<GoDownload size={14} />}
                >
                  Download
                </Button>
              </Group>
            </Grid.Col>
          </Grid>
        </Fieldset>
      )}
      {/* ログインモーダル */}
      <AuthModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />

      {/* モーダルでの画像表示にトランジションを追加 */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        size="auto"
        padding={0}
        centered
        withCloseButton={false}
        transitionProps={{ transition: 'fade-up', duration: 600, timingFunction: 'linear' }}
        styles={{
          content: {
            maxHeight: '100vh',  // モーダル自体が画面の高さを超えないようにする
            overflow: 'hidden'   // 縦スクロールを防ぐ
          }
        }}
      >
        <Transition
          mounted={opened} // モーダルが開いているときにトランジションを実行
          transition="fade"
          duration={600}
          timingFunction="ease"
        >
          {(styles) => (
            <MantineImage
              src={workData?.apiWork?.titleImgUrl}
              alt="Preview Image"
              style={{
                maxWidth: '100vw',
                maxHeight: 'calc(100vh - 50px)',
                objectFit: 'contain',
                display: 'block',
                margin: 0,
                ...styles, // トランジションのスタイルを適用
              }}
            />
          )}
        </Transition>
      </Modal>
    </>
  );
});