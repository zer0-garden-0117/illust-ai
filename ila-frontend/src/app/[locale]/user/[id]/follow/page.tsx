'use client';

import FollowList from "@/components/Content/FollowList/FollowList";

const UserPage: React.FC<{ params: { id: string } }> = (
  { params }
) => {
  const userId = decodeURIComponent(params.id);

  return (
    <>
    <FollowList
      userId={userId}
    />
    </>
  )
};

export default UserPage;