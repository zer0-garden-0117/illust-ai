'use client';
import ImageGrid from '@/components/Content/ImageGrid/ImageGrid';
import { useTranslations } from 'next-intl';
import { BiSolidInvader } from 'react-icons/bi';

const IllustrationPage: React.FC = () => {
  const t = useTranslations("page");
  const words = [
    "character_" + "零崎真白",
    "character_" + "零崎くるみ",
    "character_" + "零崎鈴",
    "character_" + "零崎蒼"
  ]

  return (
    <>
      <ImageGrid
        topIcon={<BiSolidInvader />}
        title={t("family")}
        isViewCount={true}
        isViewPagination={true}
        imageCount={12}
        words={words}
        type={"free"}
      />
    </>
  )
};

export default IllustrationPage;