'use client';

import LoginButton from "@/components/Common/LoginButton/LoginButton";
import UserInfo from "@/components/Content/UserInfo/UserInfo";
import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";

const UserPage: React.FC<{ params: { id: string } }> = (
  { params }
) => {
  const userId = decodeURIComponent(params.id);
  // const { user, idToken } = useFirebaseAuthContext();

  return (
    <>
      <UserInfo
        userId={userId}
      />
      {/* {user && (
        <div style={{ marginTop: '20px' }}>
          <h2>User Info:</h2>
          <p>Name: {user.displayName}</p>
          <p>Email: {user.email}</p>
          <p>UID: {user.uid}</p>
          <p>id token: {idToken}</p>
          <p>id: {user.providerId}</p>
        </div>
      )} */}
    </>
  )
};

export default UserPage;