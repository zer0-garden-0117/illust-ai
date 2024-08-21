import { WorkRegistrationFormView } from "./WorkRegistrationForm.view";

export const useWorkRegistrationForm = (): React.ComponentPropsWithoutRef<
  typeof WorkRegistrationFormView
> => {
  const handleOpen = async () => {
  };

  return { onOpen: handleOpen };
};
