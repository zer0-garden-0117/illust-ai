'use client';
import ImageGrid from '@/components/Content/ImageGrid/ImageGrid';

const CreatorPage: React.FC<{ params: { id: string } }> = (
  { params }
) => {
  const decodedId = decodeURIComponent(params.id);

  return (
    <>
      <ImageGrid
        title={decodedId}
        isViewCount={true}
        words={[decodedId]}
        type={"free"}
      />
    </>
  )
};

export default CreatorPage;