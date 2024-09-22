// 'use client';

import React from 'react';
import { Button, Fieldset, Grid, Image as MantineImage, Loader } from '@mantine/core';
import { memo } from 'react';
import { useTranslations } from "next-intl";
import { WorkGetByIdResult } from '@/apis/openapi/works/useWorksGetById';

type PostViewProps = {
  workData?: WorkGetByIdResult;
  loading: boolean;
  onOpen: () => void;
};

export const PostView = memo(function PostViewComponent({
  workData,
  loading,
  onOpen
}: PostViewProps): JSX.Element {
  const t = useTranslations("");

  if (loading) {
    return <Loader />;
  }

  return (
    <Fieldset legend={t('')}>
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, lg: 6 }}>
          {workData?.apiWork?.titleImgUrl ? (
            <MantineImage
              src={workData.apiWork.titleImgUrl}
              style={{ width: '100%', height: '100%' }}
            />
          ) : (
            <p>No image available</p>
          )}
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, lg: 6 }}>
          {/* 他のコンテンツ */}
          <Button onClick={onOpen}>Open</Button>
        </Grid.Col>
      </Grid>
    </Fieldset>
  );
});