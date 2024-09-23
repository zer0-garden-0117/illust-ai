'use client';
import { useAccessToken } from '@/apis/auth/useAccessToken';
import ImageGrid from '@/components/Content/ImageGrid/ImageGrid';
import AuthModal from '@/components/Header/AuthModal/AuthModal';
import { useState } from 'react';

const TagPage: React.FC<{ params: { id: string } }> = (
  { params }
) => {
  const decodedId = decodeURIComponent(params.id);
  const { isAuthenticated } = useAccessToken();
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  return (
    <>
      {isAuthenticated ? (
        <ImageGrid
          title={"お気に入り"}
          isViewCount={true}
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