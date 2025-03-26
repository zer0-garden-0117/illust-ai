'use client';
import ImageGrid from '@/components/Content/ImageGrid/ImageGrid';
import { RiUserLine } from 'react-icons/ri';

const CreatorPage: React.FC<{ params: { id: string } }> = (
  { params }
) => {
  const decodedId = decodeURIComponent(params.id);
  const words = "creator_" + decodedId

  return (
    <>
      <ImageGrid
        topIcon={<RiUserLine />}
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

export default CreatorPage;