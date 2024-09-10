import React, { useState } from 'react';
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
};

type ImageGridViewProps = {
  imageData: ImageData[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading: boolean; // ローディング状態
};

export const ImageGridView = memo(function ImageGridViewComponent({
  imageData,
  currentPage,
  totalPages,
  onPageChange,
  loading
}: ImageGridViewProps): JSX.Element {
  const t = useTranslations("");

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
    <Card key={imageData.mainTitle} p="md" radius="md" component="a" href="#" className={classes.card}>
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
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '12px', gap: '8px' }}>
        {/* レーティングを右寄せ */}
        <Rating value={0} onChange={(value) => handleRating(imageData.workId, value)} />
        {/* いいねボタン */}
        <ActionIcon
          variant="transparent"
          color="gray"
          style={{
            color: 'gray',
            transition: 'color 0.3s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'red')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'gray')}
          onClick={() => handleLike(imageData.workId)}
        >
          <RiHeartAdd2Line />
        </ActionIcon>
      </div>
    </Card>
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

function handleRating(workId: number, value: number): void {
  throw new Error('Function not implemented.');
}
function handleLike(workId: number): void {
  throw new Error('Function not implemented.');
}

