'use client';

import { CreateHistory } from "@/components/Content/CreateHistory/CreateHistory";
import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";

const CreateHistoryPage: React.FC<{ searchParams: { page?: string } }> = (
  { searchParams }
) => {
  const { user } = useFirebaseAuthContext();
  const page = Number(searchParams.page ?? 1);

  return (
    <>
      <CreateHistory
        customUserId={user?.customUserId || ''}
        page={page}
        userWorksFilterType="all"
      />
    </>
  )
};

export default CreateHistoryPage;