import React, { useState } from 'react';
import { Button, TextInput, Textarea, Grid, Space, Fieldset, Select, Pill, Loader, Group } from '@mantine/core';
import { FileInput, PillsInput, PillGroup  } from '@mantine/core';
import { memo } from 'react';
import { useTranslations } from 'next-intl';
import { FaCheck } from "react-icons/fa6";
import { useRouter } from 'next/navigation';

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
  onSubmit: (workData: WorkData) => Promise<void>;
  isAdmin: boolean
};

export const WorkRegistrationFormView = memo(function WorkRegistrationFormViewComponent({
  onSubmit, isAdmin
}: WorkRegistrationFormViewProps): JSX.Element {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const t = useTranslations('');
  const router = useRouter();

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
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setIsSubmitted(false);
    
    try {
      await onSubmit(workData);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        router.push('/'); // トップページにリダイレクト
      }, 100);
    }
  };

  const [tagInput, setTagInput] = useState(''); // タグ入力用の一時状態

  // タグ入力ハンドラ（カンマで分割）
  const handleTagsInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.currentTarget.value);
  };

  // タグ追加ハンドラ（Enterまたはカンマでタグを追加）
  const handleTagsKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/,/g, '');
      if (newTag) {
        const newTags = workData.tags ? `${workData.tags},${newTag}` : newTag;
        setWorkData({ ...workData, tags: newTags });
        setTagInput('');
      }
    }
  };

  // タグ削除ハンドラ
  const handleTagRemove = (tagToRemove: string) => {
    const tagsArray = workData.tags.split(',').filter(tag => tag.trim() !== '');
    const newTags = tagsArray.filter(tag => tag !== tagToRemove).join(',');
    setWorkData({ ...workData, tags: newTags });
  };

  const tagsArray = workData.tags ? workData.tags.split(',').filter(tag => tag.trim() !== '') : [];

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
            disabled={true}
          />
          <Space h="md" />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label={t('Description')}
            value={workData.description}
            onChange={(e) => handleInputChange('description', e.currentTarget.value)}
            disabled={true}
          />
          <Space h="md" />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label={t('Format')}
            value={workData.format}
            onChange={(e) => handleInputChange('format', e.currentTarget.value)}
            disabled={true}
          />
          <Space h="md" />
        </Grid.Col>
        <Grid.Col span={6}>
          <Select
            label={t('Genre')}
            value={workData.genre}
            onChange={(value) => handleInputChange('genre', value)}
            data={[
              { value: 'icon', label: 'アイコン' },
              { value: 'illustration', label: 'イラスト' }
            ]}
          />
          <Space h="md" />
        </Grid.Col>
        <Grid.Col span={6}>
          <Select
            label={t('Character')}
            value={workData.character}
            onChange={(value) => handleInputChange('character', value)}
            data={[
              { value: '零崎真白', label: '零崎真白' },
              { value: '零崎くるみ', label: '零崎くるみ' },
              { value: '零崎鈴', label: '零崎鈴' }
            ]}
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
        <PillsInput label={t('Tags')}>
            <PillGroup>
              {tagsArray.map((tag) => (
                <Pill 
                  key={tag} 
                  withRemoveButton 
                  onRemove={() => handleTagRemove(tag)}
                >
                  {tag}
                </Pill>
              ))}
              <PillsInput.Field
                value={tagInput}
                onChange={handleTagsInput}
                onKeyDown={handleTagsKeyDown}
                placeholder={tagsArray.length === 0 ? 'タグを入力（カンマまたはEnterで追加）' : ''}
              />
            </PillGroup>
            </PillsInput>
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
        <Grid.Col span={12}>
          <Group justify="flex-end">
            <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                rightSection={
                  isSubmitting ? (
                    <Loader size="xs" />
                  ) : isSubmitted ? (
                    <FaCheck size="1rem" />
                  ) : null
                }
              >
                {t('Submit')}
            </Button>
          </Group>
        </Grid.Col>
      </Grid>
    </Fieldset>
  );
});