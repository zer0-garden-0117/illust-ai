'use client';
import ImageGrid from '@/components/Content/ImageGrid/ImageGrid';
import { BiSolidInvader } from 'react-icons/bi';

const GenrePage: React.FC<{ params: { id: string } }> = (
  { params }
) => {
  const decodedId = decodeURIComponent(params.id);
  const words = ["other_" + decodedId, "character_" + decodedId, "creator_" + decodedId, "genre_" + decodedId]

  return (
    <>
      <ImageGrid
        topIcon={<BiSolidInvader />}
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