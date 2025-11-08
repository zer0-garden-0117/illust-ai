'use client';

import PostedWork from "@/components/Content/PostedWork/PostedWork";

const UserPage: React.FC<{ params: { id: string } }> = (
  { params }
) => {
  const tag = decodeURIComponent(params.id);

  return (
    <>
      {/* <PostedWork tag={tag} /> */}
    </>
  )
};

export default UserPage;