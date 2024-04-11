---
id: getting_started
title: Getting started
---

# Getting Started

The CrowdSec Console provides a range of tools designed to bolster your infrastructure's security. Should you choose not to utilize the [Security Engine](/docs/next/intro/) for active monitoring of your infrastructure, feel free to bypass the optional prerequisites. It's perfectly acceptable to opt out of using the security engine.

## Optional pre-requisites

Deploy a Security Engine on your server to identify potential attacks.

[Security Engine](/docs/next/getting_started/#security-engine)

Install a Remediation Component to enforce decisions made by the Security Engine

[Remediation Components](https://docs.crowdsec.net/u/bouncers/intro/)

### Sign Up and Log In

Head over to the [CrowdSec Console](https://app.crowdsec.net/signup) to go through the registration process. You have the option to sign up using your email address and password or by leveraging our Single Sign-On (SSO) services, including Google and GitHub.

![](/img/console/getting_started/signin_form.png)

Once your account is created, log in to access the Console dashboard.

### Connect the Security Engine to the Console

Upon account creation in the Console, an enroll key will be generated and attached to your account. This private key will link your CrowdSec Security Engine to the Console.

:::warning
Consider your enrollment key confidential and exercise caution before disclosing it to anyone.
:::

Enroll your Security Engine by executing the following command from your server:

:::info
Replace `$ENROLL_KEY` with the key generated in the Console.
:::

<!--TODO Update to unixwindowsk8s tabs -->
```bash
sudo cscli console enroll $ENROLL_KEY
```

An enrollment request will appear after a few seconds in the Console.

![](/img/console/getting_started/console_pending_enroll.png)

After accepting the enrollment, the Security Engine overview will be displayed in the Engines dashboard.

![](/img/console/getting_started/console_home.png)

Some metadata will not be updated immediately, such as the number of Remediation Components connected to the Security Engine. You must restart the Security Engine to update this information.

<!--TODO Update to unixwindowsk8s tabs -->
```bash
systemctl restart crowdsec
```

Congratulations, your infrastructure is ready to go with the Console!

## Next Steps?

### Verify the Security Engine sends alerts to the Console

Execute the following command on the newly enrolled Security Engine to generate a decision:

<!--TODO Update to unixwindowsk8s tabs -->
```bash
cscli decisions add --ip 1.2.3.4 --duration 1m
```

This action will create a decision for the IP address 1.2.3.4, trigger an alert in the Console, and block the IP for a duration of one minute.

Allow a maximum timeframe of 5 minutes, the Console will be notified of the alert, and the Alerts tally on the Security Engine's card will increase.

:::info
The timeframe may differ based on numerous factors, such as network latency, the number of Security Engines, etc.
:::

### Blocklists

Within the community plan of the Console you are able to enroll your engines into 3 curated third-party blocklists.

You can move into the [Blocklists section](/console/blocklists/overview.md) to learn how to achieve this.

