'use client';

import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";
import CreatedWorksCards from "@/components/Content/CreatedWorksCards/CreatedWorksCards";

const CreateHistoryPage: React.FC<{ searchParams: { page?: string } }> = (
  { searchParams }
) => {
  const { user } = useFirebaseAuthContext();
  const page = Number(searchParams.page ?? 1);

  return (
    <>
      <CreatedWorksCards
        customUserId={user?.customUserId || ''}
        page={page}
        userWorksFilterType="created"
      />
    </>
  )
};

export default CreateHistoryPage;