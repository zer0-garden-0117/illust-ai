'use client';
import ImageGrid from '@/components/Content/ImageGrid/ImageGrid';

const TagPage: React.FC<{ params: { id: string } }> = (
  { params }
) => {
  const decodedId = decodeURIComponent(params.id);

  return (
    <>
      <ImageGrid
        title={"レビュー"}
        isViewCount={true}
        words={[]}
        type={"rated"}
      />
    </>
  )
};

export default TagPage;