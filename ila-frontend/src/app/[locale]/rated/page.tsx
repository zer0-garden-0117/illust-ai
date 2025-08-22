'use client';
import ImageGrid from '@/components/Content/ImageGrid/ImageGrid';
import AuthModal from '@/components/Common/AuthModal/AuthModal';
import { useAccessTokenContext } from '@/providers/auth/accessTokenProvider';
import { useState } from 'react';
import { FaRegStar } from 'react-icons/fa';
import { useTranslations } from 'next-intl';

const TagPage: React.FC<{ params: { id: string } }> = (
  { params }
) => {
  const t = useTranslations("page");
  const { isAuthenticated } = useAccessTokenContext();
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  return (
    <>
      {isAuthenticated ? (
      <ImageGrid
        topIcon={<FaRegStar />}
        title={t("reviewList")}
        isViewCount={true}
        isViewPagination={true}
        imageCount={12}
        words={[]}
        type={"rated"}
      />
    ) : (
      <AuthModal
        isOpen={true}
        onClose={() => setLoginModalOpen(false)}
      />
    )}
  </>
  )
};

export default TagPage;