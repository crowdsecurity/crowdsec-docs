import React from 'react';
import styles from './index.module.css';

export type Challenge = {
  icon: React.ReactNode;
  color: string;
  title: string;
  body: string;
};

type Props = {
  challenges: Challenge[];
};

export default function ChallengeGrid({ challenges }: Props) {
  return (
    <div className={styles.grid}>
      {challenges.map((c, i) => (
        <div key={i} className={styles.cell}>
          <div
            className={styles.iconWrap}
            style={{
              background: `${c.color}1a`,
              color: c.color,
              border: `1px solid ${c.color}33`,
            }}
          >
            {c.icon}
          </div>
          <div className={styles.title}>{c.title}</div>
          <div className={styles.body}>{c.body}</div>
        </div>
      ))}
    </div>
  );
}
