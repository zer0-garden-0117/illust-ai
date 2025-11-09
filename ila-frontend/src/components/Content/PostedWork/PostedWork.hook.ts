import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";
import { useWorksGetById } from "@/apis/openapi/works/useWorksGetById";
import { useUsersLikedDelete } from "@/apis/openapi/myusers/useUsersLikedDelete";
import { useUsersLikedRegister } from "@/apis/openapi/myusers/useUsersLikedRegister";
import { usePublicWorksById } from "@/apis/openapi/publicworks/usePublicWorksGetById";

type UsePostedWorkProps = {
  workId: string;
};

export const usePostedWork = (
  { workId }: UsePostedWorkProps
) => {
  const router = useRouter();
  const { getIdTokenLatest, user } = useFirebaseAuthContext();
  const { trigger: deleteLike } = useUsersLikedDelete();
  const { trigger: registerLike } = useUsersLikedRegister();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: privateImageData, error: privateError, mutate: mutatePrivateWork } = 
  useWorksGetById(
    user ? {workId, getIdTokenLatest} : undefined,
    { revalidateOnFocus: false }
  );

  const { data: publicImageData, error: publicError, mutate: mutatePublicWork } = 
  usePublicWorksById(
    !user ? { workId }: undefined,
    { revalidateOnFocus: false }
  );

  const imageData = user ? privateImageData : publicImageData;
  const error = user ? privateError : publicError;
  const updateWork = user ? mutatePrivateWork : mutatePublicWork;

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
    router.push(`/illust/tag/${encodeURIComponent(tag)}`);
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