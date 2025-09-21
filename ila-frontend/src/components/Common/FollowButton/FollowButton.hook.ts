import { useUsersFollow } from "@/apis/openapi/users/useUsersFollow";
import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";
import { useState } from "react";

type FollowButtonProps = {
  customUserId?: string;
  updateUser?: () => void;
};

export const useFollowButton = (
  { customUserId, updateUser }: FollowButtonProps
) => {
  const { idToken } = useFirebaseAuthContext();
  const { trigger, isMutating, data, error } = useUsersFollow();

  const onFollow = async () => {
    if (!customUserId) return;
    await trigger({
      headers: { Authorization: `Bearer ${idToken}` },
      userId: customUserId
    });
    if (updateUser) {
      updateUser();
    }
  };

  return {
    onFollow,
  };
};