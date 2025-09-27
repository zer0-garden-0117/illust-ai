'use client';

import HistoryWork from "@/components/Content/HistoryWork/HistoryWork";
import UserInfo from "@/components/Content/UserInfo/UserInfo";

const UserPage: React.FC<{ params: { id: string } }> = (
  { params }
) => {
  const workId = decodeURIComponent(params.id);

  return (
    <>
      <HistoryWork workId={workId} />
    </>
  )
};

export default UserPage;