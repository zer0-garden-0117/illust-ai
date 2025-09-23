'use client';

import React, { memo } from 'react';
import { DrawFormValues } from './DrawForm.hook';
import { UseFormReturnType } from '@mantine/form';
import { Button, Card, Group, Radio, Text, Textarea, TextInput } from '@mantine/core';

type DrawFormViewProps = {
  form: UseFormReturnType<DrawFormValues>,
  handoleDrawClick: (values: DrawFormValues) => Promise<void>,
};

export const DrawFormView = memo(function WorkViewComponent({
  form,
  handoleDrawClick
}: DrawFormViewProps): JSX.Element {

  return (
    <Card withBorder padding="md" radius="md">
      <Text fz="md" fw={700} mb="xs">
        イラストの生成
      </Text>
      <form onSubmit={form.onSubmit(handoleDrawClick)}>
        {/* モデルの選択(ラジオボタン) */}
        <Radio.Group
          name="モデル"
          label="モデルの選択"
          mb="xs"
          {...form.getInputProps('model')}
        >
          <Group mt="xs">
            <Radio value="illust-ai-v1" label="Illust AI V1" />
            <Radio value="illust-ai-v2" label="Illust AI V2" disabled/>
          </Group>
        </Radio.Group>
        {/* プロンプト */}
        <Textarea
          label="プロンプト"
          placeholder="1girl, blonde hair, smile, ..."
          {...form.getInputProps('prompt')}
          mb="xs"
          error={form.errors.prompt}
          rows={5}
          minRows={5}
          maxRows={5}
        />
        {/* ネガティブプロンプト */}
        <Textarea
          label="ネガティブプロンプト(任意)"
          placeholder="lowres, bad anatomy, ..."
          {...form.getInputProps('negativePrompt')}
          mb="md"
          error={form.errors.negativePrompt}
          rows={5}
          minRows={5}
          maxRows={5}
        />
        <Button
          type="submit"
          radius="xl"
        >
          イラスト生成
        </Button>
      </form>
    </Card>
  );
});
DrawFormView.displayName = 'DrawFormView';