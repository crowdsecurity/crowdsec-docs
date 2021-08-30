import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    //screenshot terminal / apt-get ?
    title: 'Easy to Setup and Use',
    Svg: require('../../static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        CrowdSec is easy to install, deploy and use regardless of your knowledge.
        You don't need to be a security master to enjoy its full capabilities.
      </>
    ),
  },
  {
    //screenshot metabase ?
    title: 'Replayable',
    Svg: require('../../static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        CrowdSec is able to process both live and old logs, which makes it false-positive resilient 
      </>
    ),
  },
  {
    //screenshot de grafana
    title: 'Observable',
    Svg: require('../../static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        CrowdSec is instrumented with Metabase & Prometheus to help you generate out-of-the-box dashboards and monitor activity across your assets.
      </>
    ),
  },
  {
    //schema api ?
    title: 'API Driven',
    Svg: require('../../static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        All components comunicate via HTTP API, making it easy to cover complex setups.
      </>
    ),
  },
  {
    //schema api ?
    title: 'Participative',
    Svg: require('../../static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        You can share malevolent IP data with your fellow users, have each other's backs and outnumber hackers.
      </>
    ),
  },
  {
    //schema api ?
    title: 'Open Source',
    Svg: require('../../static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        CrowdSec is as open source and free as it can be through an MIT license. No back doors. No shenanigans.
      </>
    ),
  },
  //community driven ->
  //open-source
  //detect here apply there
  //block anything, not just ips

];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
