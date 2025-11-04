import { useRouter } from "next/navigation";
import { useWorksGetById } from "@/apis/openapi/works/useWorksGetById";
import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";

type UsePostedWorkProps = {
  workId: string;
};

export const usePostedWork = (
  { workId }: UsePostedWorkProps
) => {
  const router = useRouter();
  const { getIdTokenLatest } = useFirebaseAuthContext();

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

  return {
    workId,
    imageData,
    handleEditClick,
    handleDeleteClick,
    handleUserClick,
  };
};