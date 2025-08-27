import UserInfo from '@/components/Content/UserInfo/UserInfo';

const PostPage: React.FC<{ params: { id: string } }> = (
  { params }
) => {
  return (
    <div>
      <UserInfo userId={params.id} />
    </div>
  );
};

export default PostPage;