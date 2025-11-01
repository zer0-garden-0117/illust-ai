import { useRouter } from "next/navigation";
import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";
import { useWorksGetById } from "@/apis/openapi/works/useWorksGetById";
import { useEffect } from "react";

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

  // statusが"creating"のときは定期的に更新
  useEffect(() => {
    if (!imageData) return;
    if (imageData.status !== "creating") return;
    let attempt = 0;
    let timeoutId: NodeJS.Timeout;
    const fetchWork = () => {
      updateWork();
      attempt++;
      // 5秒 × 2^(attempt-1)、最大180秒
      const delay = Math.min(5000 * Math.pow(2, attempt - 1), 180000);
      timeoutId = setTimeout(fetchWork, delay);
    };

    fetchWork();
    return () => clearTimeout(timeoutId);
  }, [imageData?.status, updateWork]);

  const handleLaterClick = () => {
    router.push(`/user/${user?.customUserId}`);
  }

  const handleHistoryClick = () => {
    router.push(`/illust/history`);
  }

  const handlePostClick = (workId: string | undefined) => {
    if (!workId) return;
    router.push(`/illust/form/${workId}`);
  }

  const handleWorkClick = (workId: string | undefined) => {
    if (!workId) return;
    router.push(`/illust/history/${workId}`);
  }

  return {
    imageData,
    handleLaterClick,
    handleHistoryClick,
    handlePostClick,
    handleWorkClick
  };
};