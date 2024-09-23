'use client';
import { useUserToken } from '@/apis/auth/useUserToken';
import { useUserTokenContext } from '@/providers/auth/userTokenProvider';
import ImageGrid from '@/components/Content/ImageGrid/ImageGrid';
import { Box, Fieldset, Text } from '@mantine/core';
import { useTranslations } from "next-intl";
import { BsSuitDiamondFill } from "react-icons/bs";

const TopPage: React.FC = () => {
  const t = useTranslations("toppage");

  return (
    <ImageGrid
      title={"新着"}
      isViewCount={false}
      words={[]}
      type={"free"}
    />
  );
};

export default TopPage;