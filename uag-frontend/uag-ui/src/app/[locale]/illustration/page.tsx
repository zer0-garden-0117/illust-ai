'use client';
import ImageGrid from '@/components/Content/ImageGrid/ImageGrid';

const IllustrationPage: React.FC = () => {
  return (
    <>
      <ImageGrid
        title={"フリーイラスト"}
        isViewCount={true}
        isViewPagination={true}
        imageCount={12}
        words={["genre_illustration"]}
        type={"free"}
      />
    </>
  )
};

export default IllustrationPage;