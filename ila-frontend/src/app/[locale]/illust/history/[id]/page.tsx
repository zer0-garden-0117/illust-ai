'use client';

import HistoryWork from "@/components/Content/HistoryWork/HistoryWork";

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