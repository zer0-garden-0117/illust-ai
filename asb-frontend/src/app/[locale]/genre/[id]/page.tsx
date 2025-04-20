'use client';
import ImageGrid from '@/components/Content/ImageGrid/ImageGrid';
import { RiStackLine } from 'react-icons/ri';

const GenrePage: React.FC<{ params: { id: string } }> = (
  { params }
) => {
  const decodedId = decodeURIComponent(params.id);
  const words = "genre_" + decodedId

  return (
    <>
      <ImageGrid
        topIcon={<RiStackLine />}
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

export default GenrePage;