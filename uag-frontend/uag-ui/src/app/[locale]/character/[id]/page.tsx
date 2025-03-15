'use client';
import ImageGrid from '@/components/Content/ImageGrid/ImageGrid';

const CharacterPage: React.FC<{ params: { id: string } }> = (
  { params }
) => {
  const decodedId = decodeURIComponent(params.id);
  const words = "character_" + decodedId

  return (
    <>
      <ImageGrid
        title={decodedId}
        isViewCount={true}
        isViewPagination={true}
        imageCount={12}
        words={[words]}
        type={"free"}
      />
    </>
  )
};

export default CharacterPage;