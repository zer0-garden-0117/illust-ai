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
  console.log("re-rednering")

  const [isCleared, setIsCleared] = useState(false); // レーティングがクリアされたかどうかを追跡

  const handleRateChange = (workId: number, value: number) => {
    // レーティングを削除した後はクリアフラグを立てる
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

    return (
      <>
        {isLoading && (
          <div style={{ backgroundColor: 'transparent', width: '100%', height: '100%' }} />
        )}

        <MantineImage
          src={src}
          alt={alt}
          onLoad={() => {
            setIsLoading(false); // ロードが完了したらローディングを解除
          }}
          onError={() => {
            setIsLoading(false); // エラーでもローディングを解除
          }}
          style={{ display: isLoading ? 'none' : 'block' }} // ローディング中は画像を非表示
          loading="lazy" // 直接遅延ローディングを設定
        />
      </>
    );
  };

  // カードコンポーネントの生成
  const cards = imageData.map((imageData) => (
    <Card key={imageData.mainTitle} p="md" radius="md" className={classes.card}>
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
        {/* 透明な星アイコン（隙間なしで配置） */}
        <ActionIcon
          variant="transparent"
          style={{
            color: 'rgba(255, 215, 0, 0.2)', // 薄いクリアカラー
            padding: 0,
            margin: 0,
            marginRight: '-4px', // 隙間を縮める
            width: '12px',
            height: '12px',
            cursor: 'pointer',
          }}
          onClick={() => onRateChange(imageData.workId, 0)} // 評価を0にリセット
        >
          <Rating value={1} count={1} readOnly color="rgba(212, 212, 212, 0.18)" /> {/* デフォルトの星アイコン */}
        </ActionIcon>

        {/* レーティング */}
        <Rating
          value={imageData.rating}
          onChange={(value) => handleRateChange(imageData.workId, value)} // レーティング値の変更
        />

        {/* いいねボタン */}
        <ActionIcon
          variant="transparent"
          color="gray"
          style={{
            color: imageData.isLiked ? 'red' : 'gray',
            transition: 'color 0.3s ease',
            padding: 0,
            marginLeft: '8px',
          }}
          onClick={() => onLikeChange(imageData.workId)} // Likeの状態変更関数を呼び出す
        >
          <RiHeartAdd2Line />
        </ActionIcon>
      </div>
    </Card >
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
