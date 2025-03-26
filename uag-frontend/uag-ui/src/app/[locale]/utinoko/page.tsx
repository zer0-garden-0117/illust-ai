'use client';
import ImageGrid from '@/components/Content/ImageGrid/ImageGrid';
import { BiSolidInvader } from 'react-icons/bi';

const FreeIconPage: React.FC = () => {
  return (
    <ImageGrid
      topIcon={<BiSolidInvader />}
      title={"うちの子"}
      isViewCount={true}
      isViewPagination={true}
      imageCount={12}
      words={["OC"]}
      type={"free"}
    />
  )
};

export default FreeIconPage;