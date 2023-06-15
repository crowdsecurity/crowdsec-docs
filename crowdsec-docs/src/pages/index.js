import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageFeatures from '../components/HomepageFeatures';
import RemediationFeatures from '../components/RemediationFeatures';


function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <img src="/img/crowdsec_logo.png" width="25%" height="25%" style={{marginTop: '25px', marginBottom: '25px'}}/>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/next/getting_started/install_crowdsec">
            Install CrowdSec - 2min ⏱️
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
      <main>
        <HomepageFeatures />
        <RemediationFeatures />
      </main>
    </Layout>
  );
}
