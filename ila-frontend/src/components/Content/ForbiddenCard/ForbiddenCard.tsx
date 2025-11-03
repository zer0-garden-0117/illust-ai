'use client';

import React, { memo } from 'react';
import { Card, Notification } from '@mantine/core';
import { IoInformationSharp } from 'react-icons/io5';

type ForbiddenCardProps = {
  alertText: string;
};

export const ForbiddenCard = memo(function ForbiddenCard({
  alertText,
}: ForbiddenCardProps): JSX.Element {
  return (
    <Card withBorder padding="md" radius="md" color="red">
      <Notification
        variant="light"
        withCloseButton={false}
        color="blue"
        title="403 Forbidden"
        icon={<IoInformationSharp size={20} />}
        style={{ boxShadow: 'none' }}
        withBorder
      >
        {alertText}
      </Notification>
    </Card>
  );
});

ForbiddenCard.displayName = 'ForbiddenCard';