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
    console.log(values);
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