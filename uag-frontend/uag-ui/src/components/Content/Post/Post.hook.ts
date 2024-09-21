import { PostView } from "./Post.view";

export const usePost = (): React.ComponentPropsWithoutRef<
  typeof PostView
> => {
  const handleOpen = async () => {
  };

  return { onOpen: handleOpen };
};
