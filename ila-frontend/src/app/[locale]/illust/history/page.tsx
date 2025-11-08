'use client';

import { UserWorkCards } from "@/components/Content/UserWorksCards/UserWorksCards";
import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";

const CreateHistoryPage: React.FC<{ searchParams: { page?: string } }> = (
  { searchParams }
) => {
  const { user } = useFirebaseAuthContext();
  const page = Number(searchParams.page ?? 1);

  return (
    <>
      <UserWorkCards
        customUserId={user?.customUserId || ''}
        page={page}
        userWorksFilterType="created"
      />
    </>
  )
};

export default CreateHistoryPage;