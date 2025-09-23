import { useForm } from "@mantine/form";

export type DrawFormValues = {
  model: string;
  prompt: string;
  negativePrompt: string;
};

export const useDrawForm = () => {
  const form = useForm<DrawFormValues>({
    initialValues: {
      model: 'illust-ai-v1',
      prompt: '',
      negativePrompt: ''
    },
  });

  const handoleDrawClick = async (values: DrawFormValues) => {
    console.log(values);
  }

  return {
    form,
    handoleDrawClick
  };
};