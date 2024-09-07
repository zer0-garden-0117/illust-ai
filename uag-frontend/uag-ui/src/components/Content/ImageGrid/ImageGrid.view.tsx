import React from 'react';
import { AspectRatio, Card, SimpleGrid, Text, Image } from '@mantine/core';
import { memo } from 'react';
import { useTranslations } from "next-intl";
import classes from './ImageGrid.module.css';

export type ImageData = {
  workId: number;
  mainTitle: string;
  titleImage: string;
  date: string;
};

type ImageGridViewProps = {
  imageData: ImageData[];
};

export const ImageGridView = memo(function ImageGridViewComponent({
  imageData,
}: ImageGridViewProps): JSX.Element {
  const t = useTranslations("");
  const cards = imageData.map((imageData) => (
    <Card key={imageData.mainTitle} p="md" radius="md" component="a" href="#" className={classes.card}>
      {/* <AspectRatio ratio={1920 / 1080}> */}
      <AspectRatio ratio={2 / 2}>
        <Image src={imageData.titleImage} alt={imageData.mainTitle || "Image without title"} />
      </AspectRatio>
      <Text c="dimmed" size="xs" tt="uppercase" fw={700} mt="md">
        {imageData.date}
      </Text>
      <Text className={classes.title} mt={5}>
        {imageData.mainTitle}
      </Text>
    </Card>
  ));


  return (
    <SimpleGrid
      cols={{ base: 1, sm: 2, lg: 3 }}
      spacing={{ base: 20 }}
    >
      {cards}
    </SimpleGrid>
  );
});