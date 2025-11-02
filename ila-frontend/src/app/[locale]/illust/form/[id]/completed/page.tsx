'use client';

import PostCompleted from "@/components/Content/PostCompleted/PostCompleted";

const WorkFormCompletedPage: React.FC<{ params: { id: string } }> = (
  { params }
) => {
  const workId = decodeURIComponent(params.id);

  return (
    <>
      <PostCompleted workId={workId} />
    </>
  )
};

export default WorkFormCompletedPage;