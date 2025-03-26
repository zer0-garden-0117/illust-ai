'use client';
import ImageGrid from '@/components/Content/ImageGrid/ImageGrid';
import { useAccessTokenContext } from '@/providers/auth/accessTokenProvider';
import { useState } from 'react';
import { CiHeart } from "react-icons/ci";

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
          topIcon={<CiHeart />}
          title={"お気に入り"}
          isViewCount={true}
          isViewPagination={true}
          imageCount={12}
          words={[]}
          type={"liked"}
        />
      ) : (
        <></>
        // <AuthModal
        //   isOpen={true} // ログインが必要な場合モーダルを常に開く
        //   onClose={() => setLoginModalOpen(false)}
        // />
      )}
    </>
  )
};

export default TagPage;