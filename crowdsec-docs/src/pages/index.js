import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import QuickStart from '../components/QuickStart'


function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary tw-flex-1', styles.heroBanner)}>
      <div className="container">
        <img src="/img/crowdsec_logo.png" className="tw-w-2/3 sm:tw-w-2/6 sm:tw-h-2/6 tw-my-6"/>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <QuickStart />
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Documentation
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="CrowdSec, the open-source & participative IPS">
        <HomepageHeader />
    </Layout>
  );
}
