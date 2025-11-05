'use client';
import TopCards from "@/components/Content/TopCards/TopCards";
import { useTranslations } from "next-intl";

const TopPage: React.FC = () => {
  const t = useTranslations("page");

  return (
    <>
      <TopCards />
    </>
  );
};

export default TopPage;