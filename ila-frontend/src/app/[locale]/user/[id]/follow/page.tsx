'use client';

import FollowList from "@/components/Content/FollowList/FollowList";

const FollowPage: React.FC<{ params: { id: string }, searchParams: { page?: string } }> = (
  { params, searchParams }
) => {
  const customUserId = decodeURIComponent(params.id);
  const page = Number(searchParams.page ?? 1);

  return (
    <>
      <FollowList
        customUserId={customUserId}
        page={page}
        followType="follow"
      />
    </>
  )
};

export default FollowPage;