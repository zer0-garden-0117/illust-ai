'use client';

import Work from "@/components/Content/Work/Work";

const UserPage: React.FC<{ params: { id: string } }> = (
  { params }
) => {
  const workId = decodeURIComponent(params.id);

  return (
    <>
      <Work workId={workId} />
    </>
  )
};

export default UserPage;