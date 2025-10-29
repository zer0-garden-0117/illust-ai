'use client';

import { DrawHistory } from "@/components/Content/DrawHistory/DrawHistory";
import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";

const DrawHistoryPage: React.FC = () => {
  const { user } = useFirebaseAuthContext();

  return (
    <>
      <DrawHistory
        customUserId={user?.customUserId || ''}
        page={1}
        userWorksFilterType="all"
      />
    </>
  )
};

export default DrawHistoryPage;