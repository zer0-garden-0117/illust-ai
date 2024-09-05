import React, { useState } from 'react';
import { Button, TextInput, Textarea, NumberInput, MultiSelect, Fieldset, Space, Grid } from '@mantine/core';
import { memo } from 'react';
import { useTranslations } from 'next-intl';

type WorkRegistrationFormViewProps = {
  onSubmit: (formData: any) => void;
};

export const WorkRegistrationFormView = memo(function WorkRegistrationFormViewComponent({
  onSubmit
}: WorkRegistrationFormViewProps): JSX.Element {
  const t = useTranslations('');

  // フォームのステート
  const [formData, setFormData] = useState({
    mainTitle: '',
    subTitle: '',
    description: '',
    format: [],
    genre: [],
    character: [],
    creator: '',
    tags: [],
    apiImgs: [{ imgId: '', imgPageNum: '', imgUrl: '' }]
  });

  // フォームの入力ハンドラ
  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  // 送信ハンドラ
  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Fieldset legend={t('Work Registration Form')}>
      <Grid gutter="xs">
        <Grid.Col span={6}>
          <TextInput
            label={t('Main Title')}
            value={formData.mainTitle}
            onChange={(e) => handleInputChange('mainTitle', e.currentTarget.value)}
          />
          <Space h="md" />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label={t('Subtitle')}
            value={formData.subTitle}
            onChange={(e) => handleInputChange('subTitle', e.currentTarget.value)}
          />
          <Space h="md" />
        </Grid.Col>
        <Grid.Col span={6}>
          <Textarea
            label={t('Description')}
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.currentTarget.value)}
          />
          <Space h="md" />
        </Grid.Col>
        <Grid.Col span={6}>
          <MultiSelect
            label={t('Format')}
            data={['CG', 'コミック', 'ゲーム']}
            value={formData.format}
            onChange={(value) => handleInputChange('format', value)}
          />
          <Space h="md" />
        </Grid.Col>
        <Grid.Col span={6}>
          <MultiSelect
            label={t('Genre')}
            data={['オリジナル', '二次創作', 'パロディ']}
            value={formData.genre}
            onChange={(value) => handleInputChange('genre', value)}
          />
          <Space h="md" />
        </Grid.Col>
        <Grid.Col span={6}>
          <MultiSelect
            label={t('Character')}
            data={['真白']}
            value={formData.character}
            onChange={(value) => handleInputChange('character', value)}
          />
          <Space h="md" />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label={t('Creator')}
            value={formData.creator}
            onChange={(e) => handleInputChange('creator', e.currentTarget.value)}
          />
          <Space h="md" />
        </Grid.Col>
        <Grid.Col span={6}>
          <MultiSelect
            label={t('Tags')}
            data={['夜景']}
            value={formData.tags}
            onChange={(value) => handleInputChange('tags', value)}
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