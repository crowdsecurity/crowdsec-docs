import React from 'react';
import clsx from 'clsx';
import styles from './RemediationFeatures.module.css';


import useBaseUrl from '@docusaurus/useBaseUrl';

export default function RemediationsFeatures() {
    return (
      <section className={styles.remediations}>
        <div className="container">
        <h1 className="remediationTitle"> Examples of detected behaviors </h1>
          <div style={{"justify-content": "center", "padding-top" : "10px"}} className="row">
            <img src={useBaseUrl('/img/remediations.png')} width="75%" height="75%" />
          </div>
        </div>
      </section>
    );
  }
  
