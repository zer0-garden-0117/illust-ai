'use client';
import ImageGrid from '@/components/Content/ImageGrid/ImageGrid';
import { RiHashtag } from 'react-icons/ri';

const TagPage: React.FC<{ params: { id: string } }> = (
  { params }
) => {
  const decodedId = decodeURIComponent(params.id);
  const words = "other_" + decodedId

  return (
    <>
      <ImageGrid
        topIcon={<RiHashtag />}
        title={decodedId}
        isViewCount={true}
        isViewPagination={true}
        imageCount={12}
        words={[words]}
        type={"tag"}
      />
    </>
  )
};

export default TagPage;