'use client';
import ImageGrid from '@/components/Content/ImageGrid/ImageGrid';
import AuthModal from '@/components/Header/AuthModal/AuthModal';
import { useAccessTokenContext } from '@/providers/auth/accessTokenProvider';
import { useState } from 'react';
import { FaRegStar } from 'react-icons/fa';

const TagPage: React.FC<{ params: { id: string } }> = (
  { params }
) => {
  const decodedId = decodeURIComponent(params.id);
  const { isAuthenticated } = useAccessTokenContext();
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  return (
    <>
      {isAuthenticated ? (
      <ImageGrid
        topIcon={<FaRegStar />}
        title={"レビュー"}
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