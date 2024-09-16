import React, { useState } from 'react';
import { AspectRatio, Card, SimpleGrid, Text, Image as MantineImage, Pagination, ActionIcon, Rating } from '@mantine/core';
import { memo } from 'react';
import { useTranslations } from "next-intl";
import classes from './ImageGrid.module.css';
import { RiHeartAdd2Line } from "react-icons/ri";
import { RiStarLine, RiStarFill } from "react-icons/ri";

export type ImageData = {
  workId: number;
  mainTitle: string;
  titleImage: string;
  date: string;
  isLiked: boolean | undefined;
  rating: number | undefined;
};

type ImageGridViewProps = {
  imageData: ImageData[];
  currentPage: number;
  totalPages: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  onRateChange: (workId: number, value: number) => void;
  onLikeChange: (workId: number) => void;
};

export const ImageGridView = memo(function ImageGridViewComponent({
  imageData,
  currentPage,
  totalPages,
  loading,
  onPageChange,
  onLikeChange,
  onRateChange
}: ImageGridViewProps): JSX.Element {
  const t = useTranslations("");
  console.log("ImageGridView re-rendering");

  const [isCleared, setIsCleared] = useState(false);

  const handleRateChange = (workId: number, value: number) => {
    if (value === 0) {
      setIsCleared(true);
    } else {
      setIsCleared(false);
    }
    onRateChange(workId, value);
  };

  // カスタム Image コンポーネント
  const CustomImage = ({ src, alt }: { src: string; alt: string }) => {
    const [isLoading, setIsLoading] = useState(true); // ロード中フラグ

    console.log(`Rendering CustomImage for src: ${src}, isLoading: ${isLoading}`);

    return (
      <>
        {isLoading && (
          <div style={{ backgroundColor: 'transparent', width: '100%', height: '100%' }}>
            {/* ローディング中のプレースホルダー */}
            <p>Loading image...</p>
          </div>
        )}

        <MantineImage
          src={src}
          alt={alt}
          onLoad={() => {
            setIsLoading(false);
            console.log(`Image loaded: ${src}`);
          }}
          onError={() => {
            setIsLoading(false);
            console.log(`Image load error: ${src}`);
          }}
          style={{ display: isLoading ? 'none' : 'block' }} // ローディング中は画像を非表示
          loading="lazy" // 直接遅延ローディングを設定
        />
      </>
    );
  };

  const MemoizedCard = memo(
    ({ imageData, onRateChange, onLikeChange }: { imageData: ImageData, onRateChange: (workId: number, value: number) => void, onLikeChange: (workId: number) => void }) => {
      const [localIsLiked, setLocalIsLiked] = useState(imageData.isLiked);
      const [localRating, setLocalRating] = useState(imageData.rating);

      const handleLikeClick = () => {
        setLocalIsLiked(!localIsLiked);
        onLikeChange(imageData.workId);
      };

      const handleRateClick = (rating: number) => {
        setLocalRating(rating);
        onRateChange(imageData.workId, rating);
      };

      const handleRateClearClick = () => {
        setLocalRating(0);
        onRateChange(imageData.workId, 0);
      };

      return (
        <Card key={imageData.workId} p="md" radius="md" className={classes.card}>
          <AspectRatio ratio={2 / 2}>
            <CustomImage
              src={imageData.titleImage}
              alt={imageData.mainTitle || "Image without title"}
            />
          </AspectRatio>
          <Text c="dimmed" size="xs" tt="uppercase" fw={700} mt="md">
            {new Date(imageData.date).toISOString().split('T')[0]}
          </Text>
          <Text className={classes.title} mt={5}>
            {imageData.mainTitle}
          </Text>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '12px' }}>
            <ActionIcon
              variant="transparent"
              style={{
                color: 'rgba(255, 215, 0, 0.2)',
                padding: 0,
                margin: 0,
                marginRight: '-4px',
                width: '12px',
                height: '12px',
                cursor: 'pointer',
              }}
              onClick={handleRateClearClick}
            >
              <Rating
                value={1}
                count={1}
                readOnly color="rgba(212, 212, 212, 0.18)"
                style={{ pointerEvents: 'none' }}
              />
            </ActionIcon>

            <Rating
              value={localRating}
              onChange={handleRateClick}
            />

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

  const cards = imageData.map((data) => (
    <MemoizedCard
      key={data.workId}
      imageData={data}
      onRateChange={onRateChange}
      onLikeChange={onLikeChange}
    />
  ));

  return (
    <>
      <SimpleGrid
        cols={{ base: 1, sm: 2, lg: 3 }}
        spacing={{ base: 20 }}
      >
        {cards}
      </SimpleGrid>
      {!loading && (
        <Pagination
          value={currentPage}
          onChange={onPageChange}
          total={totalPages}
          mt="lg"
          radius="md"
          withEdges
        />
      )}
    </>
  );
});