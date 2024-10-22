import clsx from 'clsx';
import styles from './styles.module.css';
import {createStorageSlot} from '@docusaurus/theme-common';
import React, {useState} from 'react';

const storage = createStorageSlot('docusaurus.cookieConsent');

export default function CookieConsent() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) {
    return null;
  }
  return (
    <div className={styles.banner}>
      <p className={styles.text}>
        This website uses cookies to help us improve. Click &quot;accept&quot;
        to allow us to continue using cookies.
      </p>
      <div className={styles.buttons}>
        <button
          type="button"
          className={clsx('clean-btn', styles.button)}
          onClick={() => {
            storage.set('true');
            setDismissed(true);
          }}>
          Accept
        </button>
        <button
          type="button"
          className={clsx('clean-btn', styles.button)}
          onClick={() => {
            storage.set('false');
            setDismissed(true);
          }}>
          Decline
        </button>
      </div>
    </div>
  );
}
