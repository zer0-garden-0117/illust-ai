import { useUsersFollow } from "@/apis/openapi/users/useUsersFollow";
import { useUsersUnfollow } from "@/apis/openapi/users/useUsersUnfollow";
import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";

type FollowButtonProps = {
  isFollowState?: boolean;
  userId?: string;
  updateUser?: () => void;
};

export const useFollowButton = (
  { isFollowState, userId, updateUser }: FollowButtonProps
) => {
  const { idToken } = useFirebaseAuthContext();
  const { trigger: triggerFollow } = useUsersFollow();
  const { trigger: triggerUnfollow } = useUsersUnfollow();

  const onFollow = async () => {
    if (!userId) return;
    await triggerFollow({
      headers: { Authorization: `Bearer ${idToken}` },
      userId: userId
    });
    if (updateUser) {
      updateUser();
    }
  };

  const onUnfollow = async () => {
    if (!userId) return;
    await triggerUnfollow({
      headers: { Authorization: `Bearer ${idToken}` },
      userId: userId
    });
    if (updateUser) {
      updateUser();
    }
  };

  return {
    isFollowState,
    onFollow,
    onUnfollow,
  };
};