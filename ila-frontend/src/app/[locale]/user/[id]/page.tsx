'use client';

import UserInfo from "@/components/Content/UserInfo/UserInfo";

const UserPage: React.FC<{ params: { id: string }, searchParams: { tab?: string, page?: string } }> = (
  { params, searchParams }
) => {
  const userId = decodeURIComponent(params.id);
  const tab = searchParams.tab ?? 'posted';
  const page = Number(searchParams.page ?? 1);

  return (
    <UserInfo
      userId={userId}
      tab={tab}
      page={page}
    />
  )
};

export default UserPage;