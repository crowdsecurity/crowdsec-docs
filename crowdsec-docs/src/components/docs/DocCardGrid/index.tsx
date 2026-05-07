import React from 'react';

type Props = {
  children: React.ReactNode;
  cols?: 2 | 3;
};

export default function DocCardGrid({ children, cols = 3 }: Props) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      gap: 14,
      margin: '16px 0 24px',
    }}>
      {children}
    </div>
  );
}
