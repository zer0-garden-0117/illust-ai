'use client';

import UserInfo from "@/components/Content/UserInfo/UserInfo";

const UserPage: React.FC<{ params: { id: string }, searchParams: { tab?: string } }> = (
  { params, searchParams }
) => {
  const userId = decodeURIComponent(params.id);
  const tab = searchParams.tab ?? 'posted';

  return (
    <UserInfo
      userId={userId}
      tab={tab}
    />
  )
};

export default UserPage;