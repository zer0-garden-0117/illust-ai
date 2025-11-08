import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";
import { useMyWorksGetById } from "@/apis/openapi/myworks/useMyWorksGetById";

type UsePostCompletedProps = {
  workId: string;
};

export const usePostCompleted = (
  { workId }: UsePostCompletedProps
) => {
  const { user, getIdTokenLatest } = useFirebaseAuthContext();
  const { data: imageData, error, mutate: updateWork } = useMyWorksGetById({
    workId,
    getIdTokenLatest,
  }, { revalidateOnFocus: false });

  return {
    workId,
    imageData,
  };
};