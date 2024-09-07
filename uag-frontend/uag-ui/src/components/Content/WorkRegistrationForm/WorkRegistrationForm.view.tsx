import React, { useState } from 'react';
import { Button, TextInput, Textarea, Grid, Space, Fieldset } from '@mantine/core';
import { FileInput } from '@mantine/core';
import { memo } from 'react';
import { useTranslations } from 'next-intl';

export type WorkData = {
  mainTitle: string;
  subTitle: string;
  description: string;
  format: string;
  genre: string;
  character: string;
  creator: string;
  tags: string;
  titleImage: File;
};

type WorkRegistrationFormViewProps = {
  onSubmit: (workData: WorkData) => void;
};

export const WorkRegistrationFormView = memo(function WorkRegistrationFormViewComponent({
  onSubmit
}: WorkRegistrationFormViewProps): JSX.Element {
  const t = useTranslations('');

  // フォームのステート
  const [workData, setWorkData] = useState<WorkData>({
    mainTitle: '',
    subTitle: '',
    description: '',
    format: '',
    genre: '',
    character: '',
    creator: '',
    tags: '',
    titleImage: new File([], "placeholder.jpg")
  });

  // フォームの入力ハンドラ
  const handleInputChange = (field: string, value: any) => {
    setWorkData({ ...workData, [field]: value });
  };

  // 送信ハンドラ
  const handleSubmit = () => {
    onSubmit(workData);
  };

  return (
    <Fieldset legend={t('Work Registration Form')}>
      <Grid gutter="xs">
        <Grid.Col span={6}>
          <TextInput
            label={t('Main Title')}
            value={workData.mainTitle}
            onChange={(e) => handleInputChange('mainTitle', e.currentTarget.value)}
          />
          <Space h="md" />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label={t('Subtitle')}
            value={workData.subTitle}
            onChange={(e) => handleInputChange('subTitle', e.currentTarget.value)}
          />
          <Space h="md" />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label={t('Description')}
            value={workData.description}
            onChange={(e) => handleInputChange('description', e.currentTarget.value)}
          />
          <Space h="md" />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label={t('Format')}
            value={workData.format}
            onChange={(e) => handleInputChange('format', e.currentTarget.value)}
          />
          <Space h="md" />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label={t('Genre')}
            value={workData.genre}
            onChange={(e) => handleInputChange('genre', e.currentTarget.value)}
          />
          <Space h="md" />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label={t('Character')}
            value={workData.character}
            onChange={(e) => handleInputChange('character', e.currentTarget.value)}
          />
          <Space h="md" />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label={t('Creator')}
            value={workData.creator}
            onChange={(e) => handleInputChange('creator', e.currentTarget.value)}
          />
          <Space h="md" />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label={t('Tags')}
            value={workData.tags}
            onChange={(e) => handleInputChange('tags', e.currentTarget.value)}
          />
          <Space h="md" />
        </Grid.Col>
        <Grid.Col span={6}>
          <FileInput
            label={t('Title Image')}
            placeholder="Choose file"
            onChange={(file) => handleInputChange('titleImage', file)}
          />
          <Space h="md" />
        </Grid.Col>
      </Grid>
      <Button onClick={handleSubmit}>
        {t('Submit')}
      </Button>
    </Fieldset>
  );
});