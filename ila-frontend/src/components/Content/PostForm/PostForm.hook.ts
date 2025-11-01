import { useRouter } from "next/navigation";
import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";
import { useWorksGetById } from "@/apis/openapi/works/useWorksGetById";

type UsePostFormProps = {
  workId: string;
};

export const usePostForm = (
  { workId }: UsePostFormProps
) => {
  const { user, getIdTokenLatest } = useFirebaseAuthContext();
  const router = useRouter();
  const { data: imageData, error, mutate: updateWork } = useWorksGetById({
    workId,
    getIdTokenLatest,
  }, { revalidateOnFocus: false });

  const handleSubmitClick = (workId: string) => {
    // ここにサブミット処理を実装
    router.push(`/user/${user?.customUserId}`);
  }

  return {
    workId,
    imageData,
    handleSubmitClick
  };
};