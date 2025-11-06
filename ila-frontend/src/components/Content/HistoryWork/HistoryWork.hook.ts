import { useRouter } from "next/navigation";
import { useWorksGetById } from "@/apis/openapi/works/useWorksGetById";
import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";

type UseHistoryWorkProps = {
  workId: string;
};

export const useHistoryWork = (
  { workId }: UseHistoryWorkProps
) => {
  const router = useRouter();
  const { getIdTokenLatest } = useFirebaseAuthContext();

  const { data: imageData, error, mutate: updateWork } = useWorksGetById(
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