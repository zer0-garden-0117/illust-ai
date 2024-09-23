'use client';
import ImageGrid from '@/components/Content/ImageGrid/ImageGrid';

const FreeIconPage: React.FC = () => {
  return (
    <ImageGrid
      title={"うちの子"}
      isViewCount={true}
      words={["OC"]}
      type={"free"}
    />
  )
};

export default FreeIconPage;