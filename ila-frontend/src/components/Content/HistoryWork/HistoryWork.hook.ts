import { useFollowUsersGet, FollowUsersGetQuery} from "@/apis/openapi/users/useFollowUsersGet";
import { useUsersGet } from "@/apis/openapi/users/useUsersGet";
import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";
import { useRouter } from "next/navigation";


type UseHistoryWorkProps = {
  workId: string;
};

export const useHistoryWork = (
  { workId }: UseHistoryWorkProps
) => {

  return {
    workId
  };
};