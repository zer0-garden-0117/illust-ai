'use client';
import ImageGrid from '@/components/Content/ImageGrid/ImageGrid';
import AuthModal from '@/components/Common/AuthModal/AuthModal';
import { useAccessTokenContext } from '@/providers/auth/accessTokenProvider';
import { useState } from 'react';
import { CiHeart } from "react-icons/ci";
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
          topIcon={<CiHeart />}
          title={t("favoriteList")}
          isViewCount={true}
          isViewPagination={true}
          imageCount={12}
          words={[]}
          type={"liked"}
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