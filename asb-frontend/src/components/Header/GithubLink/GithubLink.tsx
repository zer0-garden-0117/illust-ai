import React from 'react';
import { FaGithubAlt } from "react-icons/fa";
import { Box } from '@mantine/core';
import { useRouter } from "next/navigation";

export const GithubLink: React.FC = () => {
  const router = useRouter();
  
  const onIconClick = async () => {
    router.push('/');
  };

  return (
    <Box mt={3}>
      <FaGithubAlt
        size="1.6rem"
        height="32"
        style={{ 
            cursor: 'pointer',
            transition: 'opacity 0.2s',
          }}
        onClick={onIconClick}
      />
    </Box>
  );
};