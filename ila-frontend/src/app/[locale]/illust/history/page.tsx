'use client';

import { DrawHistory } from "@/components/Content/DrawHistory/DrawHistory";
import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";

const DrawHistoryPage: React.FC<{ searchParams: { page?: string } }> = (
  { searchParams }
) => {
  const { user } = useFirebaseAuthContext();
  const page = Number(searchParams.page ?? 1);

  return (
    <>
      <DrawHistory
        customUserId={user?.customUserId || ''}
        page={page}
        userWorksFilterType="all"
      />
    </>
  )
};

export default DrawHistoryPage;