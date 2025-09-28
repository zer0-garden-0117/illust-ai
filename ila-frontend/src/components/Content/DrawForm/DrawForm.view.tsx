'use client';

import React, { memo } from 'react';
import { DrawFormValues } from './DrawForm.hook';
import { UseFormReturnType } from '@mantine/form';
import { Button, Card, Group, Notification, Radio, Space, Text, Textarea, TextInput } from '@mantine/core';
import { IconCube, IconInfoCircle, IconInfoSmall, IconPencil } from '@tabler/icons-react';
import { IconArrowNarrowRight } from '@tabler/icons-react';
import { IconPencilCode } from '@tabler/icons-react';

type DrawFormViewProps = {
  form: UseFormReturnType<DrawFormValues>,
  handleDrawClick: (values: DrawFormValues) => Promise<void>,
  handleHistoryClick: () => void
  handlePlanChangeClick: () => void
};

export const DrawFormView = memo(function WorkViewComponent({
  form,
  handleDrawClick,
  handleHistoryClick,
  handlePlanChangeClick
}: DrawFormViewProps): JSX.Element {

  return (
    <Card withBorder padding="md" radius="md">
      <Group justify="space-between">
        <Text fz="md" fw={700}>
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
      <Space h="md" />

      {/* あと何回生成できるか表示 */}
      <Notification
        title="生成可能回数"
        withCloseButton={false}
        style={{ boxShadow: 'none' }}
        withBorder
        icon={<IconInfoSmall size={30} />}
      >
        今日はあと5回イラストを生成できます。
        <Button
          size='compact-xs'
          onClick={handlePlanChangeClick}
        >
          プランを変更
        </Button>
      </Notification>
      <Space h="md" />

      <form onSubmit={form.onSubmit(handleDrawClick)}>
        {/* モデルの選択(ラジオボタン) */}
        <Radio.Group
          name="モデル"
          label={<Group gap={"5px"}><IconCube size={20} color='var(--mantine-color-blue-6)'/>モデル</Group>}
          mb="md"
          {...form.getInputProps('model')}
        >
          <Group>
            <Radio value="illust-ai-v1" label="Illust-ai-v1" />
            <Radio value="illust-ai-v2" label="Illust-ai-v2(近日実装)" disabled/>
          </Group>
        </Radio.Group>
        {/* プロンプト */}
        <Textarea
          label={<Group gap={"5px"}><IconPencilCode size={20} color='var(--mantine-color-blue-6)'/>プロンプト</Group>}
          placeholder="1girl, blonde hair, smile, ..."
          {...form.getInputProps('prompt')}
          mb="mdc"
          error={form.errors.prompt}
          rows={5}
          minRows={5}
          maxRows={5}
        />
        {/* ネガティブプロンプト */}
        <Textarea
          label={<Group gap={"5px"}><IconPencilCode size={20} color='var(--mantine-color-blue-6)'/>ネガティブプロンプト(任意)</Group>}
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