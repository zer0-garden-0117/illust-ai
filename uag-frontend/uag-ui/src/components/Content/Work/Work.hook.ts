import { useWorksGetById, WorkGetByIdResult } from "@/apis/openapi/works/useWorksGetById";
import { WorkView } from "./Work.view";
import { useEffect, useState } from "react";

type UseWorkProps = {
  workId: number;
};

export const useWork = (
  { workId }: UseWorkProps
): React.ComponentPropsWithoutRef<typeof WorkView> => {
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