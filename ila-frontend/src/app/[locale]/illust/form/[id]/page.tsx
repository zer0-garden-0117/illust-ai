'use client';

import PostForm from "@/components/Content/PostForm/PostForm";

const WorkFormPage: React.FC<{ params: { id: string } }> = (
  { params }
) => {
  const workId = decodeURIComponent(params.id);

  return (
    <>
      <PostForm workId={workId} />
    </>
  )
};

export default WorkFormPage;