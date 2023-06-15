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
            to="/docs/next/getting_started/security_engine_intro">
            <img src="/img/log-processor.svg" width="150px" height="150px" style={{marginLeft: '10px'}}/><br/>
            Security Engine
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/next/bouncers/intro">
            <img src="/img/bouncers.svg" width="150px" height="150px" style={{marginLeft: '10px'}}/><br/>
            Remediation Component 
          </Link>
          {/* <Link
            className="button button--secondary button--lg"
            to="https://app.crowdsec.net">
            <img src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20width%3D%2222%22%20height%3D%2222%22%20preserveAspectRatio%3D%22xMidYMid%20meet%22%20viewBox%3D%220%200%2032%2032%22%3E%3Cpath%20d%3D%22M4%2020v2h4.586L2%2028.586L3.414%2030L10%2023.414V28h2v-8H4z%22%20fill%3D%22black%22%2F%3E%3Cpath%20d%3D%22M24%2021h2v5h-2z%22%20fill%3D%22black%22%2F%3E%3Cpath%20d%3D%22M20%2016h2v10h-2z%22%20fill%3D%22black%22%2F%3E%3Cpath%20d%3D%22M16%2018h2v8h-2z%22%20fill%3D%22black%22%2F%3E%3Cpath%20d%3D%22M28%202H4a2.002%202.002%200%200%200-2%202v12h2v-3h24.001l.001%2015H16v2h12a2.003%202.003%200%200%200%202-2V4a2.002%202.002%200%200%200-2-2zm-16%209H4V4h8zm2%200V4h14v7z%22%20fill%3D%22black%22%2F%3E%3C%2Fsvg%3E" width="150px" height="150px" style={{marginLeft: '10px'}}/>
            <br/>
            Console
            <svg width="13.5" height="13.5" aria-hidden="true" viewBox="0 0 24 24" class="iconExternalLink_node_modules-@docusaurus-theme-classic-lib-theme-Icon-ExternalLink-styles-module"><path fill="currentColor" d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"></path></svg>
            </Link> */}
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
      </main>
    </Layout>
  );
}
