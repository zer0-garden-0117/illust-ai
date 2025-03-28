'use client';

import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { Button, Text, Fieldset, Grid, Pill, Group, Rating, ActionIcon, Modal, Transition, Image, Card } from '@mantine/core';
import { memo } from 'react';
import { useLocale, useTranslations } from "next-intl";
import { RiHashtag, RiHeartAdd2Line, RiUserLine, RiFileLine, RiStackLine } from "react-icons/ri";
import { CiHeart } from "react-icons/ci";
import { GoDownload } from "react-icons/go";
import AuthModal from '@/components/Header/AuthModal/AuthModal';
import { WorkGetByIdResult } from '@/apis/openapi/works/useWorksGetById';
import { usePathname } from 'next/navigation';
import { BiSolidInvader } from 'react-icons/bi';
import { MdOutlineWatchLater } from 'react-icons/md';
import { FaRegStar } from 'react-icons/fa';

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
      <Image
        src={src}
        alt={alt}
        radius="md"
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

const RatingControls = memo(
  ({ localRating, onRateClick, t }: { localRating?: number; onRateClick: (rating: number) => void; t: any}) => (
    <Group style={{ marginTop: '5px' }}>
      <Text>
        <FaRegStar
          style={{
            position: 'relative',
            fontSize: '14px',
            color: "hotpink",
            marginRight: "3px"
          }}
        />
        {t("review")}
      </Text>
      <Rating value={localRating} onChange={onRateClick} />
    </Group>
  ),
  (prevProps, nextProps) => prevProps.localRating === nextProps.localRating
);
RatingControls.displayName = 'RatingControls';

const LikeControls = memo(
  ({ localIsLiked, onLikeClick, t }: { localIsLiked: boolean; onLikeClick: () => void; t:any }) => (
    <Group style={{ marginTop: '5px' }}>
      <Text>
      <CiHeart
        style={{
          position: 'relative',
          fontSize: '14px',
          color: "hotpink",
          marginRight: "3px"
        }}
      />
        {t("liked")}
      </Text>
      <ActionIcon
        variant="transparent"
        color="gray"
        style={{
          color: localIsLiked ? 'hotpink' : 'gray',
          transition: 'color 0.3s ease',
          padding: 0,
          marginLeft: '-10px',
        }}
        onClick={onLikeClick}
      >
        <RiHeartAdd2Line/>
      </ActionIcon>
    </Group>
  ),
  (prevProps, nextProps) => prevProps.localIsLiked === nextProps.localIsLiked
);
LikeControls.displayName = 'LikeControls';

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
  const t = useTranslations("work");
  const locale = useLocale()
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

  const formatDate = (isoString: string | undefined, locale: string = 'en') => {
    if (!isoString) return '';
  
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
  
    // ロケールに応じて日付の表示形式を変更
    switch (locale) {
      case 'ja': // 日本語: YYYY/MM/DD
        return `${year}/${month}/${day}`;
      case 'zh-Hant': // 繁體中文: YYYY/MM/DD
        return `${year}/${month}/${day}`;
      case 'zh-Hans': // 简体中文: YYYY/MM/DD
        return `${year}/${month}/${day}`;
      case 'ko': // 한국의: YYYY.MM.DD
        return `${year}.${month}.${day}`;
      case 'th': // ไทย: DD/MM/YYYY
        return `${day}/${month}/${year}`;
      case 'de': // Deutsch: DD.MM.YYYY
        return `${day}.${month}.${year}`;
      case 'fr': // Français: DD/MM/YYYY
        return `${day}/${month}/${year}`;
      case 'vi': // Tiếng Việt: DD/MM/YYYY
        return `${day}/${month}/${year}`;
      case 'id': // Bahasa Indonesia: DD/MM/YYYY
        return `${day}/${month}/${year}`;
      case 'ms': // Melayu: DD/MM/YYYY
        return `${day}/${month}/${year}`;
      case 'fil': // Filipino: MM/DD/YYYY
        return `${month}/${day}/${year}`;
      case 'pt': // Português: DD/MM/YYYY
        return `${day}/${month}/${year}`;
      case 'en': // 英語 (アメリカ式): MM/DD/YYYY
        return `${month}/${day}/${year}`;
      default: // デフォルト: YYYY/MM/DD (ISO 8601)
        return `${year}/${month}/${day}`;
    }
  };

  return (
    <>
      <Card
        ml={2}
        mr={2}
        style={{
          opacity: isImageDisplayed ? 1 : 0,
          transform: 'scale(1.01) translate(0px, 0px)', // 初期状態で少し浮き上がる
          transition: 'transform 150ms ease, box-shadow 150ms ease, opacity 0.5s ease-in-out',
          borderRadius: '8px', // 角に丸みを追加
          boxShadow: isImageDisplayed
          ? '0 1px 3px rgba(0, 0, 0, 0.05), 0 10px 15px -5px rgba(0, 0, 0, 0.05), 0 7px 7px -5px rgba(0, 0, 0, 0.04)'
          : 'none', // Mantineのsm影と同様の影を設定
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
              <Text>
              <RiFileLine
                style={{
                  position: 'relative',
                  fontSize: '14px',
                  color: "hotpink",
                  marginRight: "3px"
                }}
              />
                {t("title")}
              </Text>
              <Text>{workData?.apiWork?.mainTitle}</Text>
            </Group>
            <Group style={{ marginTop: '5px' }}>
              <Text>
              <RiHashtag
                style={{
                  position: 'relative',
                  fontSize: '14px',
                  color: "hotpink",
                  marginRight: "3px"
                }}
              />
                {t("tag")}
              </Text>
              <Pill.Group gap={3}>
                {workData?.apiTags?.others?.map((tagItem, index) => {
                  // GLOBALタグは非表示
                  if (tagItem === 'GLOBAL') {
                    return null;
                  }
                  return (
                    <Pill key={index} onClick={() => onTagClick(tagItem)} style={{ cursor: 'pointer' }}>
                      {tagItem}
                    </Pill>
                  );
                })}
              </Pill.Group>
            </Group>
            <Group style={{ marginTop: '5px' }}>
              <Text>
              <RiUserLine
                style={{
                  position: 'relative',
                  fontSize: '14px',
                  color: "hotpink",
                  marginRight: "3px"
                }}
              />
                {t("creator")}
              </Text>
              {workData?.apiTags?.creators?.map((creatorItem, index) => (
                <Pill key={index} onClick={() => onCreatorClick(creatorItem)} style={{ cursor: 'pointer' }}>
                  {creatorItem}
                </Pill>
              ))}
            </Group>
            <Group style={{ marginTop: '5px' }}>
              <Text>
              <BiSolidInvader
                style={{
                  position: 'relative',
                  fontSize: '14px',
                  color: "hotpink",
                  marginRight: "3px"
                }}
              />
                {t("character")}
              </Text>
              {workData?.apiTags?.characters?.map((characterItem, index) => (
                <Pill key={index} onClick={() => onCharacterClick(characterItem)} style={{ cursor: 'pointer' }}>
                  {characterItem}
                </Pill>
              ))}
            </Group>
            <Group style={{ marginTop: '5px' }}>
            <Text>
              <RiStackLine
                style={{
                  position: 'relative',
                  fontSize: '14px',
                  color: "hotpink",
                  marginRight: "3px"
                }}
              />
                {t("genre")}
              </Text>
              {workData?.apiTags?.genres?.map((genresItem, index) => (
                <Pill key={index} onClick={() => onGenreClick(genresItem)} style={{ cursor: 'pointer' }}>
                  {genresItem}
                </Pill>
              ))}  
            </Group>
            <Group style={{ marginTop: '5px' }}>
            <Text>
              <MdOutlineWatchLater
                style={{
                  position: 'relative',
                  fontSize: '14px',
                  color: "hotpink",
                  marginRight: "3px"
                }}
              />
                {t("updated")}
              </Text>
              <Text>{formatDate(workData?.apiWork?.updatedAt, locale)}</Text>
            </Group>
            <LikeControls
              localIsLiked={localIsLiked}
              onLikeClick={handleLikeClick}
              t={t}
            />
            <RatingControls
              localRating={localRating}
              onRateClick={handleRateClick}
              t={t}
            />
            <Group style={{ marginTop: '5px' }}>
              <Text>
              <GoDownload
                style={{
                  position: 'relative',
                  fontSize: '14px',
                  color: "hotpink",
                  marginRight: "3px"
                }}
              />
                {t("download")}
              </Text>
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
      </Card>

      <AuthModal 
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        isLogin={true}
      />

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
            <Image
              src={isAuthenticated ? workData?.apiWork?.titleImgUrl : workData?.apiWork?.watermaskImgUrl}
              alt="Preview Image"
              radius="md"
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