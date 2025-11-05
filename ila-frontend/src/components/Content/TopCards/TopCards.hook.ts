import { useRouter } from "next/navigation";
import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";
import { useWorksGetById } from "@/apis/openapi/works/useWorksGetById";
import { useState } from "react";
import { useWorksUpdate } from "@/apis/openapi/works/useWorksUpdate";
import { usePublicWorksGet } from "@/apis/openapi/works/usePublicWorksGet";

export const useTopCards = () => {
  const { user, getIdTokenLatest } = useFirebaseAuthContext();
  const { trigger: triggerPost } = useWorksUpdate();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [illustNum, setIllustNum] = useState(4);
  const worksFilterType = 'new';
  const { data: worksData, mutate: updateWorks } = usePublicWorksGet({
      offset: 0,
      limit: illustNum,
      worksFilterType,
  });

  const handleMoreClick = async () => {
    setIsSubmitting(true);
    setIllustNum(illustNum + 4);
    await updateWorks();
    setIsSubmitting(false);
  }

  return {
    worksData,
    isSubmitting,
    handleMoreClick
  };
};