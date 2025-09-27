import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";

export type DrawFormValues = {
  model: string;
  prompt: string;
  negativePrompt: string;
};

export const useDrawForm = () => {
  const router = useRouter();

  const form = useForm<DrawFormValues>({
    initialValues: {
      model: 'illust-ai-v1',
      prompt: '',
      negativePrompt: ''
    },
  });

  const handleDrawClick = async (values: DrawFormValues) => {
    // 画像生成のAPIを呼び出す
    router.push(`/draw/test/processing`);
  }

  const handleHistoryClick = () => {
    router.push('/draw/history');
  }

  return {
    form,
    handleDrawClick,
    handleHistoryClick
  };
};