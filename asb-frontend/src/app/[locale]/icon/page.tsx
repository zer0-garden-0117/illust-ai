'use client';
import ImageGrid from '@/components/Content/ImageGrid/ImageGrid';
import { BiSolidInvader } from 'react-icons/bi';

const IllustrationPage: React.FC = () => {
  return (
    <>
      <ImageGrid
        topIcon={<BiSolidInvader />}
        title={"フリーアイコン"}
        isViewCount={true}
        isViewPagination={true}
        imageCount={12}
        words={["genre_icon"]}
        type={"free"}
      />
    </>
  )
};

export default IllustrationPage;