import { useRouter } from "next/navigation";
import { useWorksGetById } from "@/apis/openapi/works/useWorksGetById";
import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";
import { useState } from "react";
import { useUsersLikedDelete } from "@/apis/openapi/users/useUsersLikedDelete";
import { useUsersLikedRegister } from "@/apis/openapi/users/useUsersLikedRegister";

type UsePostedWorkProps = {
  workId: string;
};

export const usePostedWork = (
  { workId }: UsePostedWorkProps
) => {
  const router = useRouter();
  const { getIdTokenLatest } = useFirebaseAuthContext();
  const { trigger: deleteLike } = useUsersLikedDelete();
  const { trigger: registerLike } = useUsersLikedRegister();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: imageData, error, mutate: updateWork } = useWorksGetById({
    workId,
    getIdTokenLatest,
  }, { revalidateOnFocus: false });

  const handleEditClick = (workId: string) => {
    router.push(`/illust/edit/${workId}`);
  }

  const handleDeleteClick = async (workId: string) => {
    router.push(`/illust/delete/${workId}`);
  }

  const handleUserClick = (customUserId: string | undefined) => {
    if (customUserId) {
      router.push(`/user/${customUserId}`);
    }
  }

  const handleLikeClick = async (workId: string) => {
    setIsSubmitting(true);
    if (imageData?.apiWork?.isLiked) {
      // いいね解除API呼び出し
      await deleteLike({
        headers: { Authorization: `Bearer ${await getIdTokenLatest()}` },
        workId,
      });
    } else {
      // いいねAPI呼び出し
      await registerLike({
        headers: { Authorization: `Bearer ${await getIdTokenLatest()}` },
        workId,
      });
    }
    await updateWork();
    setIsSubmitting(false);
  }

  const handleTagClick = (tag: string) => {
    // router.push(`/illust/tag/${encodeURIComponent(tag)}`);
  }

  return {
    workId,
    imageData,
    isSubmitting,
    handleEditClick,
    handleDeleteClick,
    handleUserClick,
    handleLikeClick,
    handleTagClick
  };
};