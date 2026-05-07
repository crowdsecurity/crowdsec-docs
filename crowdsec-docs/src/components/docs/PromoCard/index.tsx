import React from 'react';
import styles from './index.module.css';

export type PromoVariant = 'console' | 'cti' | 'engine';

type PromoData = {
  eyebrow: string;
  title: string;
  color: string;
  perks: string[];
  ctaLabel: string;
  ctaHref: string;
};

const PROMO_DATA: Record<PromoVariant, PromoData> = {
  console: {
    eyebrow: 'CrowdSec Console',
    title: 'Manage your security from one place',
    color: 'var(--cs-orange)',
    perks: [
      'Visualize alerts in real-time',
      'Manage blocklists & allowlists',
      'CTI intelligence dashboard',
    ],
    ctaLabel: 'Open the Console →',
    ctaHref: 'https://app.crowdsec.net/signup?mtm_campaign=Console&mtm_source=docs&mtm_medium=tocAd',
  },
  cti: {
    eyebrow: 'IP Reputation & CTI',
    title: 'Query 13B+ IP signals with our CTI API',
    color: 'var(--cs-violet)',
    perks: [
      'Real-time IP reputation scoring',
      'Threat intelligence feeds',
      'REST API with generous free tier',
    ],
    ctaLabel: 'CTI API docs →',
    ctaHref: '/u/cti_api/intro',
  },
  engine: {
    eyebrow: 'Security Engine',
    title: 'Open-source log-based threat detection',
    color: 'var(--cs-teal)',
    perks: [
      'Detects attacks from your own logs',
      'Shares blocklists with the community',
      'Installs in minutes on any system',
    ],
    ctaLabel: 'Get started →',
    ctaHref: '/u/getting_started/installation/linux',
  },
};

function CheckIcon() {
  return (
    <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function Sparkline({ color }: { color: string }) {
  return (
    <svg className={styles.sparkline} viewBox="0 0 160 36" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={`spark-grad-${color.replace(/[^a-z]/gi, '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0,28 L20,22 L40,25 L60,14 L80,18 L100,10 L120,14 L140,8 L160,4"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.7"
      />
      <path
        d="M0,28 L20,22 L40,25 L60,14 L80,18 L100,10 L120,14 L140,8 L160,4 L160,36 L0,36 Z"
        fill={`url(#spark-grad-${color.replace(/[^a-z]/gi, '')})`}
      />
    </svg>
  );
}

type Props = {
  variant?: PromoVariant;
};

export default function PromoCard({ variant = 'console' }: Props) {
  const data = PROMO_DATA[variant];
  if (!data) return null;

  return (
    <div className={styles.card}>
      <div className={styles.eyebrow}>{data.eyebrow}</div>
      <div className={styles.title}>{data.title}</div>
      <Sparkline color={data.color} />
      <div className={styles.perks}>
        {data.perks.map((perk) => (
          <div key={perk} className={styles.perk}>
            <span style={{ color: data.color, flexShrink: 0 }}><CheckIcon /></span>
            <span>{perk}</span>
          </div>
        ))}
      </div>
      <a
        href={data.ctaHref}
        className={styles.cta}
        style={{ background: data.color, color: '#0A1120' }}
      >
        {data.ctaLabel}
      </a>
    </div>
  );
}
