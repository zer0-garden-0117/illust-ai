import React, { useState } from 'react';
import { TextInput, Box, Text, Stack, Badge, Space, Autocomplete } from '@mantine/core';
import classes from './Sidebar.module.css';

export const Sidebar: React.FC = () => {
  const [search, setSearch] = useState('');

  const tags = ['Tag1', 'Tag2', 'Tag3', 'Tag4'];

  return (
    <Box p="md">
      <Text>フリーワード検索</Text>
      <Autocomplete
        placeholder="例：夏"
        data={['React', 'Angular', 'Vue', 'Svelte']}
      />
      <Space h="md" />
      <Text>タグ検索</Text>
      {tags.map((tag, index) => (
        <Badge className={classes.root}>{tag}</Badge>
      ))}
    </Box>
  );
};