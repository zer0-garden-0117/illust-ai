'use client';
import ImageCreate from '@/components/Content/ImageCreate/ImageCreate';
import { useTranslations } from 'next-intl';

const ImagesPage: React.FC = () => {
  const t = useTranslations("page");
  return (
    <>
      <ImageCreate />
    </>
  )
};

export default ImagesPage;