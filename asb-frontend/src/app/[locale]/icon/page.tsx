'use client';
import ImageGrid from '@/components/Content/ImageGrid/ImageGrid';
import { useTranslations } from 'next-intl';
import { BiSolidInvader } from 'react-icons/bi';

const IllustrationPage: React.FC = () => {
  const t = useTranslations("page");
  return (
    <>
      <ImageGrid
        topIcon={<BiSolidInvader />}
        title={t("freeicon")}
        isViewCount={true}
        isViewPagination={true}
        imageCount={12}
        words={["genre_icon"]}
        type={"free"}
      />
    </>
  )
};

export default IllustrationPage;