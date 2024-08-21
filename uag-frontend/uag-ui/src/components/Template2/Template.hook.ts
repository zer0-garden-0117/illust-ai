import { TemplateView } from "./Template.view";

type Params = {
  // ToDo:追加
};

export const useTemplate = ({
  // ToDo:追加
}: Params): React.ComponentPropsWithoutRef<typeof TemplateView> => {
  const handleOpen = async () => {
  };

  return { onOpen: handleOpen };
};
