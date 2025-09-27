'use client';

import React, { memo } from 'react';
import { DrawFormValues } from './DrawForm.hook';
import { UseFormReturnType } from '@mantine/form';
import { Button, Card, Group, Radio, Text, Textarea, TextInput } from '@mantine/core';
import { IconPencil } from '@tabler/icons-react';
import { IconArrowNarrowRight } from '@tabler/icons-react';
import { IconPencilCode } from '@tabler/icons-react';

type DrawFormViewProps = {
  form: UseFormReturnType<DrawFormValues>,
  handleDrawClick: (values: DrawFormValues) => Promise<void>,
  handleHistoryClick: () => void
};

export const DrawFormView = memo(function WorkViewComponent({
  form,
  handleDrawClick,
  handleHistoryClick,
}: DrawFormViewProps): JSX.Element {

  return (
    <Card withBorder padding="md" radius="md">
      <Group justify="space-between">
        <Text fz="md" fw={700} mb="xs">
          イラストの生成
        </Text>
        <Button
          radius={"xl"}
          variant="outline"
          size="xs"
          leftSection={
            <IconPencilCode
              size={16}
              style={{ display: 'block' }}
            />
          }
          onClick={handleHistoryClick}
        >
          生成履歴
        </Button>
      </Group>
      <form onSubmit={form.onSubmit(handleDrawClick)}>
        {/* モデルの選択(ラジオボタン) */}
        <Radio.Group
          name="モデル"
          label="モデルの選択"
          mb="xs"
          {...form.getInputProps('model')}
        >
          <Group>
            <Radio value="illust-ai-v1" label="Illust-ai-v1" />
            <Radio value="illust-ai-v2" label="Illust-ai-v2(近日実装)" disabled/>
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
        <Group justify="flex-end" mt="md">
          <Button
            type="submit"
            radius="xl"
            rightSection={
              <>
                <IconPencil
                  color="white"
                  size={20}
                  style={{ display: 'block' }}
                />
                5
                <IconArrowNarrowRight
                  color="white"
                  size={20}
                  style={{ display: 'block' }}
                />
                4
              </>
            }
          >
            イラスト生成
          </Button>
        </Group>
      </form>
    </Card>
  );
});
DrawFormView.displayName = 'DrawFormView';