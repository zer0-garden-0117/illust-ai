import React, { useEffect, useRef, useState } from 'react';
import { AspectRatio, Card, SimpleGrid, Text, Image as MantineImage, Pagination, ActionIcon, Rating, Group, Fieldset, Transition } from '@mantine/core';
import { memo } from 'react';
import { useTranslations } from "next-intl";
import { useRouter } from 'next/navigation';
import classes from './ImageGrid.module.css';
import { RiHeartAdd2Line } from "react-icons/ri";
import AuthModal from '@/components/Header/AuthModal/AuthModal';
import { BsSuitDiamondFill } from "react-icons/bs";

export type ImageData = {
  workId: number;
  mainTitle: string;
  titleImage: string;
  thumbnailImage: string;
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
  const router = useRouter();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [allPlaceholdersVisible, setAllPlaceholdersVisible] = useState(false);
  const visibleStatus = useRef(Array(imageData.length).fill(false));

  const checkAllPlaceholdersVisible = () => {
    if (visibleStatus.current.every(status => status === true)) {
      setAllPlaceholdersVisible(true);
    }
  };

  const CustomImage = ({ src, alt, index }: { src: string; alt: string; index: number }) => {
    const [isLoaded, setIsLoaded] = useState(false); // 画像の読み込み状態
    const imgRef = useRef<HTMLImageElement | null>(null);

    const handleImageLoad = () => {
      setIsLoaded(true); // 画像が読み込まれたらトランジションを開始
    };

    return (
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {/* onLoadイベントが発火したらフェードインと"fade-up"トランジションを開始 */}
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          onLoad={handleImageLoad}
          style={{
            width: '100%',
            height: '100%',
            opacity: isLoaded ? 1 : 0, // フェードイン
            transform: isLoaded ? 'translateY(0)' : 'translateY(20px)', // 下から上に移動
            transition: `opacity 0.3s ease-in-out ${index * 0.1}s, transform 0.3s ease-in-out ${index * 0.1}s`, // opacityとtransformのトランジション、遅延をindexに基づいて設定
          }}
        />

        {/* プレースホルダー：読み込み中の間のスペース確保用 */}
        {!isLoaded && (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'gray', // 必要に応じて背景色を設定
              position: 'absolute',
              top: 0,
              left: 0,
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
        router.push(`/works/${imageData.workId}`);
      };

      return (
        <Card key={imageData.workId} p="md" radius="md" className={classes.card}>
          <AspectRatio ratio={4 / 2}>
            <div onClick={handleImageClick} style={{ cursor: 'pointer' }}>
              <CustomImage
                src={imageData.thumbnailImage}
                alt={imageData.mainTitle || "Image without title"}
                index={index}
              />
            </div>
          </AspectRatio>
          <Group>
            <Text className={classes.title} mt={5}>
              {imageData.mainTitle}
            </Text>
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
    <MemoizedCard
      key={data.workId}
      imageData={data}
      index={index}
      onRateChange={onRateChange}
      onLikeChange={onLikeChange}
    />
  ));

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