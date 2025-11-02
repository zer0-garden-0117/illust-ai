'use client';

import PostedWork from "@/components/Content/PostedWork/PostedWork";

const UserPage: React.FC<{ params: { id: string } }> = (
  { params }
) => {
  const workId = decodeURIComponent(params.id);

  return (
    <>
      <PostedWork workId={workId} />
    </>
  )
};

export default UserPage;