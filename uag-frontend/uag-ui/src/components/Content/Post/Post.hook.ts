import { useWorksGetById, WorkGetByIdResult } from "@/apis/openapi/works/useWorksGetById";
import { PostView } from "./Post.view";
import { useEffect, useState } from "react";

type UsePostProps = {
  workId: number;
};

export const usePost = (
  { workId }: UsePostProps
): React.ComponentPropsWithoutRef<typeof PostView> => {
  const { data, error, isValidating } = useWorksGetById(workId);
  const [workData, setWorkData] = useState<WorkGetByIdResult>();
  useEffect(() => {
    console.log("useEffect (data):", data);
    if (data) {
      console.log("データ取得が完了しました:", data);
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      setWorkData(data);
    }
    if (error) {
      console.error("エラーが発生しました:", error);
    }
  }, [data, error, isValidating]);

  const handleOpen = async () => {
    console.log("handleOpen called");
  };

  return {
    workData,
    loading: isValidating,
    onOpen: handleOpen,
  };
};