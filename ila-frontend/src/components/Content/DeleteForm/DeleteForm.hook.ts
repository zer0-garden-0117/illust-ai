import { useRouter } from "next/navigation";
import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";
import { useWorksGetById } from "@/apis/openapi/works/useWorksGetById";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { useWorksUpdate } from "@/apis/openapi/works/useWorksUpdate";

type UseDeleteFormProps = {
  workId: string;
};

export type PostWorkValues = {
  description: string;
};

export const useDeleteForm = (
  { workId }: UseDeleteFormProps
) => {
  const { user, getIdTokenLatest } = useFirebaseAuthContext();
  const { trigger: triggerPost } = useWorksUpdate();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPosted, setIsPosted] = useState(false);
  const { data: imageData, error, mutate: updateWork } = useWorksGetById({
    workId,
    getIdTokenLatest,
  }, { revalidateOnFocus: false });

  const form = useForm<PostWorkValues>({
    initialValues: {
      description: '',
    },
  });

  const handlePostClick = async (values: PostWorkValues) => {
    setIsSubmitting(true);
    await triggerPost({
      headers: { Authorization: `Bearer ${await getIdTokenLatest()}` },
      workId: workId,
      body: {
        description: values.description,
      }
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsPosted(true);
  }

  const handleConfirmClick = () => {
    router.push(`/illust/${workId}`);
  }

  return {
    form,
    workId,
    imageData,
    isSubmitting,
    isPosted,
    handlePostClick,
    handleConfirmClick
  };
};