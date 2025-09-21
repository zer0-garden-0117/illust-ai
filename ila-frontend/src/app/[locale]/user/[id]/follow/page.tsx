'use client';

const UserPage: React.FC<{ params: { id: string } }> = (
  { params }
) => {
  const userId = decodeURIComponent(params.id);

  return (
    <>
      <h1>Follow Page of User: {userId}</h1>
    </>
  )
};

export default UserPage;