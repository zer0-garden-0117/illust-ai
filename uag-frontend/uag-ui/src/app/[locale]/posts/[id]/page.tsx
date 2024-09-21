import { Text } from '@mantine/core';

export default async function PostPage({ params }: { params: { id: string } }) {

  return (
    <div>
      <Text>{params.id}</Text>
    </div>
  );
}