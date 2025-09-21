import { useUsersFollow } from "@/apis/openapi/users/useUsersFollow";
import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";
import { useState } from "react";

type FollowButtonProps = {
  userId?: string;
  updateUser?: () => void;
};

export const useFollowButton = (
  { userId, updateUser }: FollowButtonProps
) => {
  const { idToken } = useFirebaseAuthContext();
  const { trigger, isMutating, data, error } = useUsersFollow();

  const onFollow = async () => {
    if (!userId) return;
    await trigger({
      headers: { Authorization: `Bearer ${idToken}` },
      userId: userId
    });
    if (updateUser) {
      updateUser();
    }
  };

  return {
    onFollow,
  };
};