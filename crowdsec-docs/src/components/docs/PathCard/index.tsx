import React from 'react';
import styles from './index.module.css';

type Props = {
  color: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  tag: string;
  href: string;
};

export default function PathCard({ color, icon, title, desc, tag, href }: Props) {
  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    el.style.boxShadow = `0 8px 24px ${color}22, 0 0 0 1px ${color}66`;
    el.style.borderLeftColor = color;
  };
  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    el.style.boxShadow = '';
    el.style.borderLeftColor = '';
  };

  return (
    <a
      href={href}
      className={styles.card}
      style={{ '--card-color': color, '--cs-icon-soft': `${color}1a` } as React.CSSProperties}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.iconWrap}>{icon}</div>
      <div className={styles.title}>{title}</div>
      <div className={styles.desc}>{desc}</div>
      <span className={styles.tag}>→ {tag}</span>
    </a>
  );
}
