'use client';

import Post from '@/components/Content/Post/Post';
import { Text } from '@mantine/core';

export default function PostPage({ params }: { params: { id: number } }) {

  return (
    <div>
      <Text>{params.id}</Text>
      <Post workId={params.id} />
    </div>
  );
}