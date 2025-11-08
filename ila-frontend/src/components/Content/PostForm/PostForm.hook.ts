import { useRouter } from "next/navigation";
import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";
import { useMyWorksUpdate } from "@/apis/openapi/myworks/useMyWorksUpdate";
import { useWorksGetById } from "@/apis/openapi/works/useWorksGetById";
import { useForm } from "@mantine/form";
import { useState } from "react";

type UsePostFormProps = {
  workId: string;
};

export type PostWorkValues = {
  description: string;
};

export const usePostForm = (
  { workId }: UsePostFormProps
) => {
  const { user, getIdTokenLatest } = useFirebaseAuthContext();
  const { trigger: triggerPost } = useMyWorksUpdate();
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