import { TemplateView } from "./Template.view";

export const useTemplate = (): React.ComponentPropsWithoutRef<
  typeof TemplateView
> => {
  const handleOpen = async () => {
  };

  return { onOpen: handleOpen };
};
