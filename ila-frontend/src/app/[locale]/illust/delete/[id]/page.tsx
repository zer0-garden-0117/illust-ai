'use client';

import DeleteForm from "@/components/Content/DeleteForm/DeleteForm";

const DeleteFormPage: React.FC<{ params: { id: string } }> = (
  { params }
) => {
  const workId = decodeURIComponent(params.id);

  return (
    <>
      <DeleteForm workId={workId} />
    </>
  )
};

export default DeleteFormPage;