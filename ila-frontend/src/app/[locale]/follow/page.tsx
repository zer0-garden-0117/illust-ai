'use client';
import FollowWorkCards from "@/components/Content/FollowWorkCards/FollowWorkCards";
import { useTranslations } from "next-intl";

const TopPage: React.FC = () => {
  const t = useTranslations("page");

  return (
    <>
      <FollowWorkCards />
    </>
  );
};

export default TopPage;