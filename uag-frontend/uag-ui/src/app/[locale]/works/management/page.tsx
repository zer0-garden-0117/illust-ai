'use client';
import ImageList from '@/components/Content/ImageList/ImageList';

const ManagementPage: React.FC<{ params: { id: string } }> = (
  { params }
) => {
  const decodedId = decodeURIComponent(params.id);

  return (
    <>
      <ImageList
        title={"新着"}
        isViewCount={false}
        isViewPagination={false}
        imageCount={10}
        words={["GLOBAL"]}
        type={"tag"}
      />
    </>
  )
};

export default ManagementPage;