'use client';
import BillCompleted from '@/components/Content/BillCompleted/BillCompleted';

const CompletedPage: React.FC<{ searchParams: { priceId?: string } }> = (
  { searchParams }
) => {
  const priceId = searchParams.priceId ?? '';

  return (
    <>
      <BillCompleted priceId={priceId} />
    </>
  );
};

export default CompletedPage;