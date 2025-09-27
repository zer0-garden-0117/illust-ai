'use client';

import WorkForm from "@/components/Content/WorkForm/WorkForm";

const WorkFormPage: React.FC<{ params: { id: string } }> = (
  { params }
) => {
  const workId = decodeURIComponent(params.id);

  return (
    <>
      <WorkForm workId={workId} />
    </>
  )
};

export default WorkFormPage;