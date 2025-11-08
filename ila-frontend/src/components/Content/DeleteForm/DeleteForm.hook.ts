import { useRouter } from "next/navigation";
import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";
import { useMyWorksDeleteById } from "@/apis/openapi/myworks/useMyWorksDeleteById";
import { useWorksGetById } from "@/apis/openapi/works/useWorksGetById";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";

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
  const { data: imageData, error, mutate: updateWork } = useWorksGetById({
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