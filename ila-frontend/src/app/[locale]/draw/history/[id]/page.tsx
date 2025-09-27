'use client';

import UserInfo from "@/components/Content/UserInfo/UserInfo";

const UserPage: React.FC<{ params: { id: string } }> = (
  { params }
) => {
  const workId = decodeURIComponent(params.id);

  return (
    <>
      Work ID: {workId}
    </>
  )
};

export default UserPage;