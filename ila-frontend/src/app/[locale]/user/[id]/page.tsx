import Work from '@/components/Content/Work/Work';

const PostPage: React.FC<{ params: { id: string } }> = (
  { params }
) => {
  return (
    <div>
      {params.id}
      {/* <Work workId={params.id} /> */}
    </div>
  );
};

export default PostPage;