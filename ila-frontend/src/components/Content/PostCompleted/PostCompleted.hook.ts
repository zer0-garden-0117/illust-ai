import { useRouter } from "next/navigation";
import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";
import { useWorksGetById } from "@/apis/openapi/works/useWorksGetById";

type UsePostCompletedProps = {
  workId: string;
};

export const usePostCompleted = (
  { workId }: UsePostCompletedProps
) => {
  const { user, getIdTokenLatest } = useFirebaseAuthContext();
  const { data: imageData, error, mutate: updateWork } = useWorksGetById({
    workId,
    getIdTokenLatest,
  }, { revalidateOnFocus: false });

  return {
    workId,
    imageData,
  };
};