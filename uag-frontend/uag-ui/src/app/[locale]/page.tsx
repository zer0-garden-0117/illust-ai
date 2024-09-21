'use client';
import { useUserToken } from '@/apis/auth/useUserToken';
import { useUserTokenContext } from '@/providers/auth/userTokenProvider';
import ImageGrid from '@/components/Content/ImageGrid/ImageGrid';
import { Box, Fieldset, Text } from '@mantine/core';
import { useTranslations } from "next-intl";
import { BsSuitDiamondFill } from "react-icons/bs";

const TopPage: React.FC = () => {
  const t = useTranslations("toppage");

  return (
    <Fieldset
      variant="unstyled"
      legend={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <BsSuitDiamondFill
            style={{
              marginRight: '8px',
              position: 'relative',
              top: '-2px',
            }}
          />
          <Text fw={200} size='md'>
            新着
          </Text>
        </div>
      }
    >
      <ImageGrid words={[]} isTag={false} />
    </Fieldset>
  );
};

export default TopPage;