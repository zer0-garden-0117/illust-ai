'use client';

import { Button, Space, Text, TextInput } from '@mantine/core';
import React from 'react';
import { memo } from 'react';

type ImageCreateViewProps = {
  prompt: string;
  onPromptChange: (value: string) => void;
  onCreateButtonClick: () => void;
};

export const ImageCreateView = memo(function ImageCreateViewComponent({
  prompt,
  onPromptChange,
  onCreateButtonClick,
}: ImageCreateViewProps): JSX.Element {

  return (
    <>
      <Text>Image Create Test</Text>
      <TextInput
        size='xs'
        value={prompt}
        onChange={(event) => onPromptChange(event.target.value)}
      />
      <Space h="md"/>
      <Button onClick={() => onCreateButtonClick()}>
        画像生成
      </Button>
    </>
  );
});
ImageCreateView.displayName = 'ImageCreateView';