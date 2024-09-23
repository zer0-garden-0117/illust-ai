'use client';
import ImageGrid from '@/components/Content/ImageGrid/ImageGrid';

const TagPage: React.FC<{ params: { id: string } }> = (
  { params }
) => {
  const decodedId = decodeURIComponent(params.id);

  return (
    <>
      <ImageGrid words={[]} type={"liked"} />
    </>
  )
};

export default TagPage;