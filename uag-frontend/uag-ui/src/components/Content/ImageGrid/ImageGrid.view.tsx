import React, { useEffect, useRef, useState } from 'react';
import { AspectRatio, Card, SimpleGrid, Text, Image as MantineImage, Pagination, ActionIcon, Rating } from '@mantine/core';
import { memo } from 'react';
import { useTranslations } from "next-intl";
import classes from './ImageGrid.module.css';
import { RiHeartAdd2Line } from "react-icons/ri";

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

  const [allPlaceholdersVisible, setAllPlaceholdersVisible] = useState(false);

  // 各画像のプレースホルダー表示状態を管理する配列
  const visibleStatus = useRef(Array(imageData.length).fill(false));

  // 全てのプレースホルダーが表示されたかを確認する関数
  const checkAllPlaceholdersVisible = () => {
    if (visibleStatus.current.every(status => status === true)) {
      setAllPlaceholdersVisible(true);  // 全てのプレースホルダーが表示された
    }
  };

  const handleRateChange = (workId: number, value: number) => {
    onRateChange(workId, value);
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
              visibleStatus.current[index] = true;  // 該当するプレースホルダーが表示されたことを更新
              checkAllPlaceholdersVisible();  // 全てのプレースホルダーが表示されたかをチェック
              observer.disconnect();
            }
          });
        },
        {
          threshold: 0.1,
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
        {isVisible && (
          <MantineImage
            src={src}
            alt={alt}
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        )}
        {!isVisible && (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'transparent', // Transparent placeholder
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 1, // Ensure the placeholder is above the image
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
      const [localPrevRating, setLocalPrevRating] = useState(imageData.rating);

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
              index={index}  // indexを渡す
            />
          </AspectRatio>
          <Text c="dimmed" size="xs" tt="uppercase" fw={700} mt="md">
            {new Date(imageData.date).toISOString().split('T')[0]}
          </Text>
          <Text className={classes.title} mt={5}>
            {imageData.mainTitle}
          </Text>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '12px' }}>

            {/* <ActionIcon
              variant="transparent"
              className={classes.customactionicon}
              style={{
                color: 'rgba(255, 215, 0, 0.2)',
                padding: 0,
                margin: 0,
                marginRight: '-4px',
                width: '12px',
                height: '12px',
                cursor: 'pointer',
                transition: 'none', // アニメーションを無効にする
                outline: 'none', // クリック時のアウトラインを無効にする
                boxShadow: 'none', // クリック時のボックスシャドウを無効にする
                ':active': {
                  transform: 'translateY(0)', // クリック時の移動を無効にする
                },
              }}
              onClick={handleRateClearClick}
            >
              <Rating
                value={1}
                count={1}
                readOnly color="rgba(212, 212, 212, 0.18)"
                style={{ pointerEvents: 'none' }}
              />
            </ActionIcon> */}

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
      index={index}  // indexを渡す
      onRateChange={onRateChange}
      onLikeChange={onLikeChange}
    />
  ));

  return (
    <>
      <SimpleGrid
        cols={{ base: 2, sm: 2, lg: 3 }}
        spacing={{ base: 20 }}
      >
        {cards}
      </SimpleGrid>
      {!loading && allPlaceholdersVisible && totalPages > 1 && (
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