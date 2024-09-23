'use client';
import ImageGrid from '@/components/Content/ImageGrid/ImageGrid';

const CreatorPage: React.FC<{ params: { id: string } }> = (
  { params }
) => {
  const decodedId = decodeURIComponent(params.id);

  return (
    <>
      <ImageGrid words={[decodedId]} isTag={false} />
    </>
  )
};

export default CreatorPage;