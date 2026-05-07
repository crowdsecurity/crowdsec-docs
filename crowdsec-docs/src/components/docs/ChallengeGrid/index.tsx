import React from 'react';

/* Named icon set — keeps MDX content simple: pass iconName="search" */
const ICONS: Record<string, React.ReactNode> = {
  search: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>
    </svg>
  ),
  pulse: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12h4l2-6 4 12 2-6h6"/>
    </svg>
  ),
  box: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M3 7v10l9 4 9-4V7"/><path d="M12 11v10"/>
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l8 3v6c0 4.5-3.4 8.4-8 9-4.6-.6-8-4.5-8-9V6l8-3z"/>
    </svg>
  ),
  compass: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9"/><path d="M15 9l-2 5-5 2 2-5 5-2z"/>
    </svg>
  ),
  gauge: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 14a9 9 0 0 1 18 0"/><path d="M12 14l4-4"/><circle cx="12" cy="14" r="1.5"/>
    </svg>
  ),
  lock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>
    </svg>
  ),
  bell: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2H4.5L6 16z"/><path d="M10 21h4"/>
    </svg>
  ),
};

export type Challenge = {
  iconName?: string;
  icon?: React.ReactNode;
  color: string;
  title: string;
  body: string;
};

type Props = {
  challenges: Challenge[];
};

export default function ChallengeGrid({ challenges }: Props) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 14,
      margin: '20px 0',
    }}>
      {challenges.map((c, i) => {
        const icon = c.icon ?? (c.iconName ? ICONS[c.iconName] : null);
        return (
          <div key={i} style={{
            position: 'relative',
            padding: 18,
            borderRadius: 12,
            background: 'var(--cs-surface)',
            border: '1px solid var(--cs-border)',
            overflow: 'hidden',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              {icon && (
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 9,
                  background: `${c.color}14`,
                  border: `1px solid ${c.color}33`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: c.color,
                  flexShrink: 0,
                }}>
                  <div style={{ width: 17, height: 17, display: 'flex' }}>{icon}</div>
                </div>
              )}
              <div style={{
                fontFamily: 'var(--cs-font-mono)',
                fontSize: 11,
                color: 'var(--cs-ink-mute)',
                letterSpacing: '0.10em',
              }}>
                {String(i + 1).padStart(2, '0')}
              </div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--cs-ink)', marginBottom: 6, letterSpacing: '-0.005em' }}>
              {c.title}
            </div>
            <div style={{ fontSize: 13.5, color: 'var(--cs-ink-dim)', lineHeight: 1.55 }}>
              {c.body}
            </div>
          </div>
        );
      })}
    </div>
  );
}
