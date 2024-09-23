'use client';
import ImageGrid from '@/components/Content/ImageGrid/ImageGrid';

const GenrePage: React.FC<{ params: { id: string } }> = (
  { params }
) => {
  const decodedId = decodeURIComponent(params.id);

  return (
    <>
      <ImageGrid words={[decodedId]} type={"free"} />
    </>
  )
};

export default GenrePage;