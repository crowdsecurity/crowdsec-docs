import React from 'react';
import styles from './index.module.css';

type Chip = { label: string; href: string };

type Props = {
  heading?: string;
  chips: Chip[];
};

export default function PopularChips({ heading = 'Popular docs', chips }: Props) {
  return (
    <div className={styles.section}>
      <div className={styles.heading}>{heading}</div>
      <div className={styles.chips}>
        {chips.map((c) => (
          <a key={c.href} href={c.href} className={styles.chip}>
            {c.label}
          </a>
        ))}
      </div>
    </div>
  );
}
