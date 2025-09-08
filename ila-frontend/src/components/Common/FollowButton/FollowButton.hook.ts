import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";
import { useState } from "react";

type FollowButtonProps = {
  customUserId?: string;
};

export const useFollowButton = (
  { customUserId }: FollowButtonProps
) => {
  const onFollow = async () => {
  };

  return {
    onFollow,
  };
};