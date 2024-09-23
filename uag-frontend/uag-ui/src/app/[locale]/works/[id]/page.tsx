'use client';

import Work from '@/components/Content/Work/Work';

const PostPage: React.FC<{ params: { id: number } }> = (
  { params }
) => {
  return (
    <div>
      <Work workId={params.id} />
    </div>
  );
};

export default PostPage;