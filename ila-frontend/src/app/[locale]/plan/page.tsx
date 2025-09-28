'use client';
import PlanList from '@/components/Content/PlanList/PlanList';
import { useTranslations } from "next-intl";

const PlanPage: React.FC = () => {
  const t = useTranslations("page");

  return (
    <>
      <PlanList />
    </>
  );
};

export default PlanPage;