import { useRouter } from "next/navigation";
import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";
import { useWorksGetById } from "@/apis/openapi/works/useWorksGetById";

type UseDrawProcessingrops = {
  workId: string;
};

export const useDrawProcessing = (
  { workId }: UseDrawProcessingrops
) => {
  const { user, getIdTokenLatest } = useFirebaseAuthContext();
  const router = useRouter();

  const { data: imageData, error, mutate: updateWork } = useWorksGetById({
    workId,
    getIdTokenLatest,
  }, { revalidateOnFocus: false });

  const handleLaterClick = () => {
    router.push(`/user/${user?.customUserId}`);
  }

  return {
    imageData,
    handleLaterClick
  };
};