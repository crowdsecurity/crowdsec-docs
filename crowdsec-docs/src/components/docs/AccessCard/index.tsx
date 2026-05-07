import React from 'react';
import styles from './index.module.css';

type Props = {
  icon?: React.ReactNode;
  title: string;
  command?: string;
  ctaLabel: string;
  ctaHref: string;
};

function DefaultIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <polyline points="8 21 12 17 16 21" />
    </svg>
  );
}

export default function AccessCard({ icon, title, command, ctaLabel, ctaHref }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <div className={styles.iconWrap}>{icon ?? <DefaultIcon />}</div>
        <div className={styles.title}>{title}</div>
      </div>
      {command && (
        <div className={styles.command}>
          <span style={{ color: 'var(--cs-ink-mute)' }}>$</span>
          <span>{command}</span>
        </div>
      )}
      <a href={ctaHref} className={styles.cta}>{ctaLabel} →</a>
    </div>
  );
}
