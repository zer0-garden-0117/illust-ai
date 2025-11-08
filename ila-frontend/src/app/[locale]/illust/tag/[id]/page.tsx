'use client';

import TagCards from "@/components/Content/TagCards/TagCards";

const UserPage: React.FC<{ params: { id: string } }> = (
  { params }
) => {
  const tag = decodeURIComponent(params.id);

  return (
    <>
      <TagCards tag={tag} />
    </>
  )
};

export default UserPage;