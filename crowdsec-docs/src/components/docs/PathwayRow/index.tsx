import React, { useState } from 'react';
import styles from './index.module.css';

type Step = { title: string; desc: string };

type Props = {
  color: string;
  title: string;
  eyebrow: string;
  steps: Step[];
  ctaLabel: string;
  ctaHref: string;
  defaultOpen?: boolean;
};

export default function PathwayRow({ color, title, eyebrow, steps, ctaLabel, ctaHref, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={styles.row}>
      <div className={styles.header} onClick={() => setOpen((v) => !v)} role="button" aria-expanded={open}>
        <div className={styles.headerLeft}>
          <div className={styles.rail} style={{ background: color, boxShadow: `0 0 12px ${color}66` }} />
          <div>
            <div className={styles.eyebrow}>{eyebrow}</div>
            <div className={styles.title}>{title}</div>
          </div>
        </div>
        <svg
          className={`${styles.chevron} ${open ? styles.open : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {open && (
        <div className={styles.body}>
          <div className={styles.steps}>
            {steps.map((step, i) => (
              <div key={i} className={styles.step}>
                <div
                  className={styles.stepNum}
                  style={{
                    background: `${color}1a`,
                    color: color,
                    border: `1px solid ${color}33`,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className={styles.stepContent}>
                  <div className={styles.stepTitle}>{step.title}</div>
                  <div className={styles.stepDesc}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <a
            href={ctaHref}
            className={styles.cta}
            style={{ background: color, color: '#0A1120' }}
          >
            {ctaLabel} →
          </a>
        </div>
      )}
    </div>
  );
}
