import React from 'react';

export type PillVariant = 'community' | 'premium' | 'platinum' | 'info' | 'success' | 'warning';

type Props = {
  variant?: PillVariant;
  children: React.ReactNode;
};

export default function Pill({ variant = 'premium', children }: Props) {
  return (
    <span className={`cs-pill ${variant}`} data-variant={variant}>
      {children}
    </span>
  );
}
