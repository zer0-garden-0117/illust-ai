'use client';

import EditForm from "@/components/Content/EditForm/EditForm";

const EditFormPage: React.FC<{ params: { id: string } }> = (
  { params }
) => {
  const workId = decodeURIComponent(params.id);

  return (
    <>
      <EditForm workId={workId} />
    </>
  )
};

export default EditFormPage;