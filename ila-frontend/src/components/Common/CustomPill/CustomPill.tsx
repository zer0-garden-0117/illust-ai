import { Pill, PillProps } from '@mantine/core';
import React from 'react';

interface CustomPillProps extends PillProps {
  onClick: () => void;
  children: React.ReactNode;
}

export const CustomPill = React.memo(({ onClick, children, ...props }: CustomPillProps) => {

  return (
    <Pill
      {...props}
      onClick={(e) => {
        onClick();
      }}
      style={{
        cursor: 'pointer',
      }}
    >
      {children}
    </Pill>
  );
});

CustomPill.displayName = 'CustomPill';