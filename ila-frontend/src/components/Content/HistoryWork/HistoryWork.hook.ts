import { useRouter } from "next/navigation";
import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";
import { useMyWorksGetById } from "@/apis/openapi/myworks/useMyWorksGetById";

type UseHistoryWorkProps = {
  workId: string;
};

export const useHistoryWork = (
  { workId }: UseHistoryWorkProps
) => {
  const router = useRouter();
  const { getIdTokenLatest } = useFirebaseAuthContext();

  const { data: imageData, error, mutate: updateWork } = useMyWorksGetById(
    {
      workId,
      getIdTokenLatest,
    },
    { revalidateOnFocus: false });

  const handlePostClick = (workId: string) => {
    router.push(`/illust/form/${workId}`);
  }

  return {
    workId,
    imageData,
    handlePostClick
  };
};