import { Pill, PillProps } from '@mantine/core';
import React from 'react';

interface CustomPillProps extends PillProps {
  onClick: () => void;
  children: React.ReactNode;
}

export const CustomPill = React.memo(({ onClick, children, ...props }: CustomPillProps) => {
  const [isActive, setIsActive] = React.useState(false);

  return (
    <Pill
      {...props}
      onClick={(e) => {
        e.preventDefault();
        onClick();
        setIsActive(true);
        setTimeout(() => setIsActive(false), 150);
      }}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      onMouseLeave={() => setIsActive(false)}
      style={{
        cursor: 'pointer',
        userSelect: 'none',
        transform: isActive ? 'scale(0.95)' : 'scale(1)',
        transition: 'all 0.2s ease',
        ...props.style,
      }}
      styles={{
        root: {
          '&:hover': {
            backgroundColor: 'var(--mantine-color-pink-light)',
            transform: 'translateY(-2px)',
          },
        },
      }}
    >
      {children}
    </Pill>
  );
});

CustomPill.displayName = 'CustomPill';