'use client';
import ImageGrid from '@/components/Content/ImageGrid/ImageGrid';

const GenrePage: React.FC<{ params: { id: string } }> = (
  { params }
) => {
  const decodedId = decodeURIComponent(params.id);
  const words = ["other_" + decodedId, "character_" + decodedId, "creator_" + decodedId, "genre_" + decodedId]

  return (
    <>
      <ImageGrid
        title={decodedId}
        isViewCount={true}
        isViewPagination={true}
        imageCount={12}
        words={words}
        type={"free"}
      />
    </>
  )
};

export default GenrePage;