import React, { useState } from 'react';

type Props = {
  eyebrow?: string;
  color: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  tag: string;
  tags?: string[];
  audience?: string;
  href: string;
};

/* color-mix() helper so CSS vars like var(--cs-orange) can be used with opacity */
const mix = (c: string, pct: number) => `color-mix(in srgb, ${c} ${pct}%, transparent)`;

export default function PathCard({ eyebrow, color, icon, title, desc, tag, tags = [], audience, href }: Props) {
  const [hover, setHover] = useState(false);

  return (
    <a
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        padding: 24,
        background: hover ? 'var(--cs-surface-2)' : 'var(--cs-surface)',
        /* Border matches icon color on hover */
        border: `1px solid ${hover ? mix(color, 40) : 'var(--cs-border)'}`,
        borderRadius: 14,
        transition: 'border-color 200ms, background 200ms, box-shadow 200ms',
        /* No translateY — avoids layout shift */
        boxShadow: hover
          ? `0 16px 40px rgba(0,0,0,0.40), inset 0 0 0 1px ${mix(color, 15)}`
          : 'inset 0 1px 0 rgba(255,255,255,0.02)',
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
        color: 'inherit',
        minWidth: 0,
      }}
    >
      {/* Corner glow */}
      <div style={{
        position: 'absolute',
        top: -40,
        right: -40,
        width: 140,
        height: 140,
        borderRadius: '50%',
        background: color,
        filter: 'blur(60px)',
        opacity: hover ? 0.18 : 0.09,
        transition: 'opacity 200ms',
        pointerEvents: 'none',
      }} />

      {/* Header row: icon + eyebrow */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          /* Use color-mix so CSS vars work as opacity-tinted backgrounds */
          background: mix(color, 14),
          border: `1px solid ${mix(color, 28)}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color,
          flexShrink: 0,
        }}>
          {icon}
        </div>
        {eyebrow && (
          <div style={{
            fontFamily: 'var(--cs-font-mono)',
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase' as const,
            color,
            fontWeight: 500,
          }}>
            {eyebrow}
          </div>
        )}
      </div>

      <h3 style={{
        fontSize: 18.5,
        fontWeight: 600,
        lineHeight: 1.25,
        margin: '0 0 10px',
        color: 'var(--cs-ink)',
        letterSpacing: '-0.01em',
      }}>
        {title}
      </h3>

      <p style={{
        fontSize: 13.5,
        color: 'var(--cs-ink-dim)',
        lineHeight: 1.55,
        margin: 0,
        flex: 1,
      }}>
        {desc}
      </p>

      {/* Tags */}
      {tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 18 }}>
          {tags.map((t, i) => (
            <span key={t} style={{
              display: 'inline-block',
              fontFamily: 'var(--cs-font-mono)',
              fontSize: 10.5,
              letterSpacing: '0.06em',
              textTransform: 'uppercase' as const,
              color: i === 0 ? color : 'var(--cs-ink-dim)',
              border: `1px solid ${i === 0 ? mix(color, 28) : mix('var(--cs-ink-dim)', 20)}`,
              background: i === 0 ? mix(color, 8) : mix('var(--cs-ink-dim)', 6),
              padding: '3px 8px',
              borderRadius: 4,
              fontWeight: 500,
            }}>{t}</span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{
        marginTop: 20,
        paddingTop: 16,
        borderTop: `1px dashed var(--cs-border)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {audience && (
          <div style={{
            fontFamily: 'var(--cs-font-mono)',
            fontSize: 10.5,
            color: 'var(--cs-ink-mute)',
            letterSpacing: '0.06em',
            lineHeight: 1.4,
            minWidth: 0,
            flex: '0 1 auto',
            overflow: 'hidden',
          }}>
            {audience}
          </div>
        )}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          color,
          fontWeight: 600,
          fontSize: 13,
          marginLeft: 'auto',
          transition: 'gap 160ms',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}>
          {tag}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6"/>
          </svg>
        </div>
      </div>
    </a>
  );
}
