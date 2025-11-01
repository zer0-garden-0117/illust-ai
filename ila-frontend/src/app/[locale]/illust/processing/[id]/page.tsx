'use client';

import DrawProcessing from "@/components/Content/DrawProcessing/DrawProcessing";

const DrawProcessingPage: React.FC<{ params: { id: string } }> = (
  { params }
) => {
  const workId = decodeURIComponent(params.id);

  return (
    <>
      <DrawProcessing workId={workId} />
    </>
  )
};

export default DrawProcessingPage;