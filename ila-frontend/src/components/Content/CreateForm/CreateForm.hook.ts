import { useMyWorksCreate } from "@/apis/openapi/myworks/useMyWorksCreate";
import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";
import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import { useState } from "react";

export type CreateWorkValues = {
  model: string;
  prompt: string;
  negativePrompt: string;
};

export const useCreateWork = () => {
  const { getIdTokenLatest ,getFreshIdToken } = useFirebaseAuthContext();
  const router = useRouter();
  const { trigger: createWork } = useMyWorksCreate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateWorkValues>({
    initialValues: {
      model: 'illust-ai-v1',
      prompt: '',
      negativePrompt: '',
    },
  });

  const handleDrawClick = async (values: CreateWorkValues) => {
    setIsSubmitting(true);
    // 画像生成のAPIを呼び出す
    const response = await createWork({
      headers: { Authorization: `Bearer ${await getIdTokenLatest()}` },
      body: {
        model: values.model,
        prompt: values.prompt,
        negativePrompt: values.negativePrompt,
      }
    });
    // トークンを更新してから遷移
    await getFreshIdToken();
    router.push(`/illust/processing/${response?.apiWork?.workId}`);
  }

  const handleHistoryClick = () => {
    router.push('/illust/history');
  }

  const handlePlanChangeClick = () => {
    router.push('/plan');
  }

  const handleBoostAddClick = () => {
    router.push('/boost');
  }

  return {
    form,
    isSubmitting,
    handleDrawClick,
    handleHistoryClick,
    handlePlanChangeClick,
    handleBoostAddClick
  };
};