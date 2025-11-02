import { useRouter } from "next/navigation";
import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";
import { useWorksGetById } from "@/apis/openapi/works/useWorksGetById";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { useWorksUpdate } from "@/apis/openapi/works/useWorksUpdate";

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
    // 投稿処理をここに実装
    // await triggerPost({
    //   headers: { Authorization: `Bearer ${await getIdTokenLatest()}` },
    //   workId: workId,
    //   body: {
    //     description: values.description,
    //   }
    // });
    // 5秒待機（デバッグ用）
    await new Promise((resolve) => setTimeout(resolve, 5000));
    setIsSubmitting(false);
    setIsPosted(true);
  }

  return {
    form,
    workId,
    imageData,
    isSubmitting,
    isPosted,
    handlePostClick
  };
};