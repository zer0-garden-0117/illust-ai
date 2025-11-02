import { useRouter } from "next/navigation";
import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";
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
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    // 投稿処理をここに実装
    router.push(`/user/${user?.customUserId}`);
  }

  return {
    form,
    workId,
    imageData,
    isSubmitting,
    handlePostClick
  };
};