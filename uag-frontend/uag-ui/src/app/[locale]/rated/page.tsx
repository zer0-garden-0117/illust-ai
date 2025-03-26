'use client';
import ImageGrid from '@/components/Content/ImageGrid/ImageGrid';
import { FaRegStar } from 'react-icons/fa';

const TagPage: React.FC<{ params: { id: string } }> = (
  { params }
) => {
  const decodedId = decodeURIComponent(params.id);

  return (
    <>
      <ImageGrid
        topIcon={<FaRegStar />}
        title={"レビュー"}
        isViewCount={true}
        isViewPagination={true}
        imageCount={12}
        words={[]}
        type={"rated"}
      />
    </>
  )
};

export default TagPage;