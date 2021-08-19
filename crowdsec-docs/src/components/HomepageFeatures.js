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
        Crowdsec is easy to install and to use on a daily basis. No security knowledge required.
      </>
    ),
  },
  {
    //screenshot metabase ?
    title: 'Reproducibility',
    Svg: require('../../static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Crowdsec can process live logs, as well as cold logs, making it easy to identify false positives or generate reporting.
      </>
    ),
  },
  {
    //screenshot de grafana
    title: 'Observability',
    Svg: require('../../static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Out of the box dashboards with [metabase](https://www.metabase.com/) and [prometheus](https://prometheus.io/) instrumentation for maximum observability.
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
