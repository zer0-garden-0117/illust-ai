'use client';

import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { Button, Text, Fieldset, Grid, Pill, Group, Rating, ActionIcon, Modal, Transition } from '@mantine/core';
import { memo } from 'react';
import { useTranslations } from "next-intl";
import { RiHeartAdd2Line } from "react-icons/ri";
import { GoDownload } from "react-icons/go";
import AuthModal from '@/components/Header/AuthModal/AuthModal';
import { WorkGetByIdResult } from '@/apis/openapi/works/useWorksGetById';
import { usePathname } from 'next/navigation';

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

// CustomImageコンポーネントをメモ化して、画像の再レンダリングを防ぐ
const CustomImage = memo(({ src, alt, index, onDisplayComplete }: { src: string; alt: string; index: number; onDisplayComplete: () => void }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const currentImgRef = imgRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsVisible(true);
        });
      },
      { threshold: 0.1 }
    );

    if (currentImgRef) observer.observe(currentImgRef);

    return () => {
      if (currentImgRef) observer.unobserve(currentImgRef);
    };
  }, []);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  useEffect(() => {
    if (isVisible && isLoaded) {
      onDisplayComplete(); // 画像の表示が完了したら通知
    }
  }, [isVisible, isLoaded, onDisplayComplete]);

  const shouldDisplay = isVisible && isLoaded;

  return (
    <div ref={imgRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <img
        src={src}
        alt={alt}
        onLoad={handleImageLoad}
        style={{
          maxWidth: '350px',
          width: '100%',
          height: '100%',
          opacity: shouldDisplay ? 1 : 0,
          transform: shouldDisplay ? 'translateY(0)' : 'translateY(20px)',
          transition: `opacity 0.3s ease-in-out ${index * 0.1}s, transform 0.3s ease-in-out ${index * 0.1}s`,
        }}
      />
      {!shouldDisplay && <div style={{ maxWidth: '350px', width: '100%', height: '100%', backgroundColor: 'transparent', position: 'absolute', top: 0, left: 0 }} />}
    </div>
  );
});
CustomImage.displayName = 'CustomImage';

const RatingAndLikeControls = memo(
  ({ localRating, localIsLiked, onRateClick, onLikeClick }: { localRating?: number; localIsLiked: boolean; onRateClick: (rating: number) => void; onLikeClick: () => void }) => (
    <Group style={{ marginTop: '5px' }}>
      <Text>レビュー:</Text>
      <Rating value={localRating} onChange={onRateClick} />
      <ActionIcon
        variant="transparent"
        color="gray"
        style={{
          color: localIsLiked ? 'red' : 'gray',
          transition: 'color 0.3s ease',
          padding: 0,
          marginLeft: '-10px',
        }}
        onClick={onLikeClick}
      >
        <RiHeartAdd2Line />
      </ActionIcon>
    </Group>
  ),
  (prevProps, nextProps) => prevProps.localRating === nextProps.localRating && prevProps.localIsLiked === nextProps.localIsLiked
);
RatingAndLikeControls.displayName = 'RatingAndLikeControls';

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
  const [isImageDisplayed, setIsImageDisplayed] = useState(false);
  const pathname = usePathname();

  useLayoutEffect(() => {
    // スクロールイベントで位置をリアルタイムに保存
    const handleScroll = () => {
      if (!loading) {
        sessionStorage.setItem(`scrollPosition-${pathname}`, window.scrollY.toString());
      } 
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      // コンポーネントがアンマウントされる際にイベントリスナーを削除
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname, loading]);

  // 画像表示が完了したときにスクロール位置を復元
  useEffect(() => {
    if (isImageDisplayed) {
      const savedPosition = sessionStorage.getItem(`scrollPosition-${pathname}`);
      const targetPosition = savedPosition ? parseInt(savedPosition, 10) : 0;
      setTimeout(() => {
        console.log(`Scrolling to position: ${targetPosition}`);
        window.scrollTo(0, targetPosition);
      }, 100);
    }
  }, [isImageDisplayed, pathname]);

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
    if (!isoString) return '';
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  return (
    <>
      <Fieldset
        legend=""
        style={{
          border: isImageDisplayed ? '1px solid #ccc' : 'none',
          opacity: isImageDisplayed ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out',
        }}
      >
        <Grid justify="center" style={{ marginTop: '20px', marginBottom: '20px' }}>
          <Grid.Col span={{ base: 12, sm: 6, lg: 6 }} style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <CustomImage
              src={isAuthenticated ? (workData?.apiWork?.titleImgUrl || '') : (workData?.apiWork?.watermaskImgUrl || '')}
              alt={workData?.apiWork?.mainTitle || "Image without title"}
              index={0}
              onDisplayComplete={() => setIsImageDisplayed(true)}
            />
          </div>
          </Grid.Col>
          <Grid.Col
            span={{ base: 12, sm: 6, lg: 6 }}
            style={{
              opacity: isImageDisplayed ? 1 : 0,
              transition: 'opacity 0.5s ease-in-out', // 情報表示のフェードイン効果
            }}
          >
            <Group style={{ marginTop: '20px' }}>
              <Text>タイトル:</Text>
              <Text>{workData?.apiWork?.mainTitle}</Text>
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
            <RatingAndLikeControls
              localRating={localRating}
              localIsLiked={localIsLiked}
              onRateClick={handleRateClick}
              onLikeClick={handleLikeClick}
            />
            <Group style={{ marginTop: '5px' }}>
              <Text>ダウンロード:</Text>
              <Button
                onClick={handleDownloadClick}
                variant="light"
                color="gray"
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

      <AuthModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />

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
            maxHeight: '100vh',
            overflow: 'hidden'
          }
        }}
      >
        <Transition
          mounted={opened}
          transition="fade"
          duration={600}
          timingFunction="ease"
        >
          {(styles) => (
            <img
              src={isAuthenticated ? workData?.apiWork?.titleImgUrl : workData?.apiWork?.watermaskImgUrl}
              alt="Preview Image"
              style={{
                maxWidth: '100vw',
                maxHeight: 'calc(100vh - 50px)',
                objectFit: 'contain',
                display: 'block',
                margin: 0,
                ...styles,
              }}
            />
          )}
        </Transition>
      </Modal>
    </>
  );
});
WorkView.displayName = 'WorkView';