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
      size='md'
      style={{
        cursor: 'pointer',
        backgroundColor: 'var(--mantine-color-blue-light)',
        color: 'var(--mantine-color-blue-6)',
        fontWeight: 'bold',
      }}
    >
      {children}
    </Pill>
  );
});

CustomPill.displayName = 'CustomPill';