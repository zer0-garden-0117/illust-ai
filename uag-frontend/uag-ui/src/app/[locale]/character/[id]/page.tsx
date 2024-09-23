'use client';
import ImageGrid from '@/components/Content/ImageGrid/ImageGrid';

const CharacterPage: React.FC<{ params: { id: string } }> = (
  { params }
) => {
  const decodedId = decodeURIComponent(params.id);

  return (
    <>
      <ImageGrid words={[decodedId]} type={"free"} />
    </>
  )
};

export default CharacterPage;