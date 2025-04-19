'use client';
import ImageGrid from '@/components/Content/ImageGrid/ImageGrid';
import { Space } from '@mantine/core';
import { useTranslations } from "next-intl";
import { BiSolidInvader } from "react-icons/bi";

const TopPage: React.FC = () => {
  const t = useTranslations("toppage");

  return (
    <>
    <ImageGrid
        topIcon={<BiSolidInvader />}
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