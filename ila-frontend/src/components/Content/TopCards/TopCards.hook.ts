import { useState } from "react";
import { usePublicWorksGet } from "@/apis/openapi/works/usePublicWorksGet";

export const useTopCards = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [illustNum, setIllustNum] = useState(4);
  const worksFilterType = 'new';
  const { data: worksData, mutate: updateWorks } = usePublicWorksGet(
    {
      offset: 0,
      limit: illustNum,
      worksFilterType
    },
    { keepPreviousData: true,
      revalidateOnFocus: false
    }
  );

  const handleMoreClick = async () => {
    setIsSubmitting(true);
    setIllustNum(illustNum + 4);
    await updateWorks();
    setIsSubmitting(false);
  }

  return {
    worksData,
    illustNum,
    isSubmitting,
    handleMoreClick
  };
};