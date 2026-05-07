import React, { useState } from 'react';

type Step = { title: string; desc: string };

type Props = {
  color: string;
  title: string;
  eyebrow: string;
  sub?: string;
  steps: Step[];
  ctaLabel: string;
  ctaHref: string;
  defaultOpen?: boolean;
  icon?: React.ReactNode;
};

function ArrowIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6"/>
    </svg>
  );
}

export default function PathwayRow({ color, title, eyebrow, sub, steps, ctaLabel, ctaHref, defaultOpen = false, icon }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{
      border: `1px solid ${open ? `${color}40` : 'var(--cs-border)'}`,
      borderRadius: 12,
      background: open ? `linear-gradient(180deg, ${color}0d, var(--cs-surface) 60%)` : 'var(--cs-surface)',
      transition: 'all 180ms',
      overflow: 'hidden',
      marginBottom: 8,
    }}>
      {/* Header row — always visible */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '18px 20px', gap: 18 }}>
        {/* Color rail */}
        <div style={{
          width: 3,
          height: 38,
          background: color,
          borderRadius: 2,
          boxShadow: `0 0 12px ${color}66`,
          flexShrink: 0,
        }} />

        {/* Icon */}
        {icon && (
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 9,
            background: `${color}15`,
            border: `1px solid ${color}33`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color,
            flexShrink: 0,
          }}>
            {icon}
          </div>
        )}

        {/* Labels */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'var(--cs-font-mono)',
            fontSize: 10.5,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color,
            marginBottom: 4,
          }}>
            {eyebrow}
          </div>
          <div style={{ fontSize: 15.5, fontWeight: 600, color: 'var(--cs-ink)', letterSpacing: '-0.005em' }}>
            {title}
          </div>
          {open && sub && (
            <div style={{ fontSize: 13, color: 'var(--cs-ink-dim)', marginTop: 6, lineHeight: 1.5 }}>
              {sub}
            </div>
          )}
        </div>

        {/* CTA — visible in header when CLOSED, hidden when open */}
        {!open && (
          <a
            href={ctaHref}
            onClick={(e) => e.stopPropagation()}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              background: color,
              color: '#0A1120',
              fontWeight: 600,
              fontSize: 13,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              textDecoration: 'none',
              boxShadow: `0 6px 20px ${color}40`,
              flexShrink: 0,
              whiteSpace: 'nowrap',
            }}
          >
            {ctaLabel} <ArrowIcon />
          </a>
        )}

        {/* Chevron toggle */}
        <button
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          style={{
            width: 30,
            height: 30,
            borderRadius: 7,
            background: 'var(--cs-surface-2)',
            border: '1px solid var(--cs-border-hi)',
            color: 'var(--cs-ink-dim)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 180ms',
            flexShrink: 0,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </button>
      </div>

      {/* Expanded body — steps + CTA */}
      {open && (
        <div style={{
          padding: '0 20px 22px',
          borderTop: '1px solid var(--cs-border)',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, margin: '18px 0 20px' }}>
            {steps.map((step, i) => (
              <div key={i} style={{
                display: 'flex',
                gap: 14,
                alignItems: 'flex-start',
                padding: '12px 0',
                borderTop: i > 0 ? '1px solid var(--cs-border)' : undefined,
              }}>
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--cs-font-mono)',
                  fontSize: 11,
                  fontWeight: 700,
                  flexShrink: 0,
                  marginTop: 1,
                  background: `${color}1a`,
                  color,
                  border: `1px solid ${color}33`,
                }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--cs-ink)', marginBottom: 3 }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--cs-ink-dim)', lineHeight: 1.5 }}>
                    {step.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA in content when OPEN */}
          <a
            href={ctaHref}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 18px',
              borderRadius: 7,
              background: color,
              color: '#0A1120',
              fontSize: 13,
              fontWeight: 600,
              textDecoration: 'none',
              boxShadow: `0 6px 20px ${color}40`,
            }}
          >
            {ctaLabel} <ArrowIcon />
          </a>
        </div>
      )}
    </div>
  );
}
