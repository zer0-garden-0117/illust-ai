import { useRouter } from "next/navigation";
import { ApiWork } from "../DrawHistory/ImageCardsForHistory/ImageCardsForHistory";
import { useWorksGetById } from "@/apis/openapi/works/useWorksGetById";
import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";

type UseWorkProps = {
  workId: string;
};

export const useWork = (
  { workId }: UseWorkProps
) => {
  const router = useRouter();
  const { getIdTokenLatest } = useFirebaseAuthContext();

  const { data: imageData, error, mutate: updateWork } = useWorksGetById({
    workId,
    getIdTokenLatest,
  }, { revalidateOnFocus: false });

  const handlePostClick = (workId: string) => {
    router.push(`/illust/form/${workId}`);
  }

  return {
    workId,
    imageData,
    handlePostClick
  };
};