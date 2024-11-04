'use client';
import ImageGrid from '@/components/Content/ImageGrid/ImageGrid';

const GenrePage: React.FC<{ params: { id: string } }> = (
  { params }
) => {
  const decodedId = decodeURIComponent(params.id);

  return (
    <>
      <ImageGrid
        title={decodedId}
        isViewCount={true}
        isViewPagination={true}
        imageCount={12}
        words={[decodedId]}
        type={"free"}
      />
    </>
  )
};

export default GenrePage;