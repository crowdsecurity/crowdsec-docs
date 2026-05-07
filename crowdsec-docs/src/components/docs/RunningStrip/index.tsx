import React from 'react';
import styles from './index.module.css';

type Pill = { label: string; href: string };

type Props = {
  label: string;
  pills: Pill[];
};

export default function RunningStrip({ label, pills }: Props) {
  return (
    <div className={styles.strip}>
      <span className={styles.label}>{label}</span>
      <div className={styles.pills}>
        {pills.map((p) => (
          <a key={p.href} href={p.href} className={styles.pill}>
            {p.label}
          </a>
        ))}
      </div>
    </div>
  );
}
