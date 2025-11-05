'use client';

import React, { memo } from 'react';
import { Group, Card, Grid, Image, Textarea, AspectRatio, Center, Button, Loader, Space, SimpleGrid } from '@mantine/core';
import { IconCheck, IconPencil } from '@tabler/icons-react';

type TopCardsViewProps = {
  isSubmitting: boolean;
  isPosted: boolean;
};

export const TopCardsView = memo(function WorkViewComponent({
  isSubmitting,
  isPosted
}: TopCardsViewProps): JSX.Element {
  console.log('isSubmitting:', isSubmitting);
  console.log('isPosted:', isPosted);
  return (
    <>
      <Card withBorder padding="md" radius="md">

        <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 4, xl: 4 }} spacing={{ base: 20 }}>

          
        </SimpleGrid>


      </Card>
    </>
  );
});
TopCardsView.displayName = 'TopCardsView';