import React, { useEffect, useRef, useState } from 'react';
import { AspectRatio, Card, SimpleGrid, Text, Image as MantineImage, Pagination, ActionIcon, Rating, Group, Fieldset, ScrollArea, Button, Box, Transition } from '@mantine/core';
import { memo } from 'react';
import { useTranslations } from "next-intl";
import { useRouter } from 'next/navigation'; // useRouter をインポート
import classes from './ImageGrid.module.css';
import { RiHeartAdd2Line } from "react-icons/ri";
import AuthModal from '@/components/Header/AuthModal/AuthModal';
import { BsSuitDiamondFill } from "react-icons/bs";

export type ImageData = {
  workId: number;
  mainTitle: string;
  titleImage: string;
  date: string;
  isLiked: boolean | undefined;
  rating: number | undefined;
};

type ImageGridViewProps = {
  title: string;
  isViewCount: boolean;
  imageData: ImageData[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  onRateChange: (workId: number, value: number) => void;
  onLikeChange: (workId: number) => void;
  isAuthenticated: boolean;
};

export const ImageGridView = memo(function ImageGridViewComponent({
  title,
  isViewCount,
  imageData,
  currentPage,
  totalPages,
  totalCount,
  loading,
  onPageChange,
  onLikeChange,
  onRateChange,
  isAuthenticated
}: ImageGridViewProps): JSX.Element {
  const t = useTranslations("");
  const router = useRouter();  // useRouter フックを使用
  const [loginModalOpen, setLoginModalOpen] = useState(false);  // ログインモーダルの開閉状態を管理

  const [allPlaceholdersVisible, setAllPlaceholdersVisible] = useState(false);
  const visibleStatus = useRef(Array(imageData.length).fill(false));

  const checkAllPlaceholdersVisible = () => {
    if (visibleStatus.current.every(status => status === true)) {
      setAllPlaceholdersVisible(true);
    }
  };

  const CustomImage = ({ src, alt, index }: { src: string; alt: string; index: number }) => {
    const [isVisible, setIsVisible] = useState(false);
    const imgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
              visibleStatus.current[index] = true;
              checkAllPlaceholdersVisible();
              observer.disconnect();
            }
          });
        },
        {
          threshold: 0.0,
          rootMargin: '0px'
        }
      );

      if (imgRef.current) {
        observer.observe(imgRef.current);
      }

      return () => {
        if (imgRef.current) {
          observer.unobserve(imgRef.current);
        }
      };
    }, []);

    return (
      <div ref={imgRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
        {/* MantineのTransitionコンポーネントを使用 */}
        <Transition
          mounted={isVisible}
          transition="fade-up" // Mantineが提供するトランジションの種類を指定
          duration={300}   // アニメーションの長さ（ミリ秒）
          timingFunction="ease"
          enterDelay={index * 10}  // 左端から順に表示するために、インデックスに応じてディレイを設定
        >
          {(styles) => (
            <MantineImage
              src={src}
              alt={alt}
              style={{
                width: '100%',
                height: '100%',
                ...styles, // トランジションのスタイルをここに適用
              }}
            />
          )}
        </Transition>

        {!isVisible && (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'transparent',
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 1,
            }}
          />
        )}
      </div>
    );
  };

  const MemoizedCard = memo(
    ({ imageData, index, onRateChange, onLikeChange }: { imageData: ImageData, index: number, onRateChange: (workId: number, value: number) => void, onLikeChange: (workId: number) => void }) => {
      const [localIsLiked, setLocalIsLiked] = useState(imageData.isLiked);
      const [localRating, setLocalRating] = useState(imageData.rating);

      const handleLikeClick = () => {
        if (!isAuthenticated) {
          setLoginModalOpen(true);
          return;
        }

        setLocalIsLiked(!localIsLiked);
        onLikeChange(imageData.workId);
      };

      const handleRateClick = (rating: number) => {
        if (!isAuthenticated) {
          setLoginModalOpen(true);
          return;
        }
        setLocalRating(rating);
        onRateChange(imageData.workId, rating);
      };

      const handleImageClick = () => {
        router.push(`/works/${imageData.workId}`);  // クリック時に posts/{workId} に遷移
      };

      return (
        <Card key={imageData.workId} p="md" radius="md" className={classes.card}>
          <AspectRatio ratio={4 / 2}>
            <div onClick={handleImageClick} style={{ cursor: 'pointer' }}>
              <CustomImage
                src={imageData.titleImage}
                alt={imageData.mainTitle || "Image without title"}
                index={index}
              />
            </div>
          </AspectRatio>
          <Group>
            <Text className={classes.title} mt={5}>
              {imageData.mainTitle}
            </Text>
            {/* <Text c="dimmed" size="xs" tt="uppercase" fw={700} mt="md">
              {new Date(imageData.date).toISOString().split('T')[0]}
            </Text> */}
          </Group>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '12px' }}>
            <Rating value={localRating} onChange={handleRateClick} />
            <ActionIcon
              variant="transparent"
              color="gray"
              style={{
                color: localIsLiked ? 'red' : 'gray',
                transition: 'color 0.3s ease',
                padding: 0,
                marginLeft: '8px',
              }}
              onClick={handleLikeClick}
            >
              <RiHeartAdd2Line />
            </ActionIcon>
          </div>
        </Card>
      );
    },
    (prevProps, nextProps) => prevProps.imageData.rating === nextProps.imageData.rating && prevProps.imageData.isLiked === nextProps.imageData.isLiked
  );

  const cards = imageData.map((data, index) => (
    // <div style={{ maxWidth: '300px' }}>
    <MemoizedCard
      key={data.workId}
      imageData={data}
      index={index}
      onRateChange={onRateChange}
      onLikeChange={onLikeChange}
    />
    // </div>
  ));
  const pills = ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5', 'Tag 6', 'Tag 7'];

  return (
    <>
      {!loading && (
        <>
          <Fieldset
            variant="unstyled"
            legend={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <BsSuitDiamondFill
                  style={{
                    marginRight: '8px',
                    position: 'relative',
                    top: '-2px',
                  }}
                />
                <Text fw={200} size='md'>
                  {title} {isViewCount && `(${totalCount}件)`}
                </Text>
              </div>
            }
          ></Fieldset>
          {/* <ScrollArea h={50} type="always" offsetScrollbars classNames={classes}>
            <Box w={600}>
              {pills.map((pill, index) => (
                <Button key={index} variant="outline" radius="xl">
                  {pill}
                </Button>
              ))}
            </Box>
          </ScrollArea> */}
        </>
      )}

      <SimpleGrid cols={{ base: 2, sm: 3, xl: 4 }} spacing={{ base: 20 }}>
        {cards}
      </SimpleGrid>
      {!loading && allPlaceholdersVisible && totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Pagination
            value={currentPage}
            onChange={onPageChange}
            total={totalPages}
            mt="lg"
            radius="xl"
            withEdges
            color="gray"
            size="sm"
          />
        </div>
      )}

      <AuthModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </>
  );
});