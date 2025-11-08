import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@mantine/form";
import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";
import { useMyWorksGetById } from "@/apis/openapi/myworks/useMyWorksGetById";
import { useMyWorksDeleteById } from "@/apis/openapi/myworks/useMyWorksDeleteById";

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
  const { trigger: triggerDelete } = useMyWorksDeleteById();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPosted, setIsPosted] = useState(false);
  const { data: imageData, error, mutate: updateWork } = useMyWorksGetById({
    workId,
    getIdTokenLatest,
  }, { revalidateOnFocus: false });

  const form = useForm<PostWorkValues>({
    initialValues: {
      description: '',
    },
  });

  // imageDataが取得されたらformに反映
  useEffect(() => {
    if (imageData?.apiWork?.description) {
      form.setValues({ description: imageData.apiWork.description });
    }
  }, [imageData?.apiWork?.description]);

  const handlePostClick = async (values: PostWorkValues) => {
    setIsSubmitting(true);
    await triggerDelete({
      headers: { Authorization: `Bearer ${await getIdTokenLatest()}` },
      workId: workId,
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsPosted(true);
  }

  const handleBackClick = () => {
    router.push(`/user/${user?.customUserId}`);
  }

  return {
    form,
    workId,
    imageData,
    isSubmitting,
    isPosted,
    handlePostClick,
    handleBackClick
  };
};