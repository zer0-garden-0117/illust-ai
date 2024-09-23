'use client';
import ImageGrid from '@/components/Content/ImageGrid/ImageGrid';

const IllustrationPage: React.FC = () => {
  return (
    <>
      <ImageGrid
        title={"フリーイラスト"}
        isViewCount={true}
        words={["illustration"]}
        type={"free"}
      />
    </>
  )
};

export default IllustrationPage;