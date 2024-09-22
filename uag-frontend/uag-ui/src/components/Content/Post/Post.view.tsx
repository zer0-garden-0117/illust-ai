'use client';

import React from 'react';
import { Button, Fieldset, Grid, Image as MantineImage } from '@mantine/core';
import { memo } from 'react';
import { useTranslations } from "next-intl";
import WorkRegistrationForm from '../WorkRegistrationForm/WorkRegistrationForm';

type PostViewProps = {
  onOpen: () => void;
};

export const PostView = memo(function PostViewComponent({
  onOpen
}: PostViewProps): JSX.Element {
  const t = useTranslations("");

  return (
    <Fieldset legend={t('')}>
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, lg: 6 }}>
        <MantineImage
            // src={src}
            style={{ width: '100%', height: '100%' }}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, lg: 6 }}>
          2
        </Grid.Col>
      </Grid>
    </Fieldset>
  );
});