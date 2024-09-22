import { useWorksGetById } from "@/apis/openapi/works/useWorksGetById";
import { PostView } from "./Post.view";
import { headers } from "next/headers";

type UsePostProps = {
  workId: number;
};

export const usePost = (
  { workId }: UsePostProps
): React.ComponentPropsWithoutRef<
  typeof PostView
> => {
  const { data, error } = useWorksGetById(workId);
  const handleOpen = async () => {
  };

  return { onOpen: handleOpen };
};
