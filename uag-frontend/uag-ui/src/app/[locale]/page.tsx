'use client';
import { useUserToken } from '@/apis/auth/useUserToken';
import { useUserTokenContext } from '@/providers/auth/userTokenProvider';
import ImageGrid from '@/components/Content/ImageGrid/ImageGrid';
import { Box, Fieldset, Space, Text } from '@mantine/core';
import { useTranslations } from "next-intl";
import { BsSuitDiamondFill } from "react-icons/bs";

const TopPage: React.FC = () => {
  const t = useTranslations("toppage");

  return (
    <>
    <ImageGrid
        title={t("new")}
        isViewCount={false}
        isViewPagination={false}
        imageCount={4}
        words={["other_GLOBAL"]}
        type={"tag"}
      />
    <Space h='xl'/> 
    {/* <ImageGrid
        title={"新着 フリーアイコン"}
        isViewCount={false}
        isViewPagination={false}
        imageCount={4}
        words={["icon"]}
        type={"free"}
      /> */}
  </>
  );
};

export default TopPage;