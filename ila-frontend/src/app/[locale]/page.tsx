'use client';
import FollowWorkCards from "@/components/Content/FollowWorkCards/FollowWorkCards";
import TopCards from "@/components/Content/TopCards/TopCards";
import { Card, Space } from "@mantine/core";
import { useTranslations } from "next-intl";

const TopPage: React.FC = () => {
  const t = useTranslations("page");

  return (
    <>
      <Card withBorder>
      <TopCards />
      <Space h="md" />
      <FollowWorkCards />
      </Card>
    </>
  );
};

export default TopPage;