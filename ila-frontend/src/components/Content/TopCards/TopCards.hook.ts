import { useRouter } from "next/navigation";
import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";
import { useWorksGetById } from "@/apis/openapi/works/useWorksGetById";
import { useState } from "react";
import { useWorksUpdate } from "@/apis/openapi/works/useWorksUpdate";

export const useTopCards = () => {
  const { user, getIdTokenLatest } = useFirebaseAuthContext();
  const { trigger: triggerPost } = useWorksUpdate();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPosted, setIsPosted] = useState(false);

  return {
    isSubmitting,
    isPosted,
  };
};