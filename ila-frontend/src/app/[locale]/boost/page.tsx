'use client';
import BoostList from '@/components/Content/BoostList/BoostList';
import { useTranslations } from "next-intl";

const BoostPage: React.FC = () => {
  const t = useTranslations("page");

  return (
    <>
      <BoostList />
    </>
  );
};

export default BoostPage;