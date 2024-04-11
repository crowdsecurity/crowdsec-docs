---
id: getting_started
title: Getting started
---

# Getting Started

## Pre-requisites

Step 1: Install a Security Engine to detect attacks on your server

[Security Engine](https://docs.crowdsec.net/docs/getting_started/#security-engine)

Step 2 (Optional): Install a Remediation Component to enforce decisions with the Security Engine

[Remediation Components](https://docs.crowdsec.net/u/bouncers/intro/)

### Step 1 Sign Up and Log In

Visit the [CrowdSec Console](https://app.crowdsec.net) and complete the sign-up process.

You can sign up with an email address and password or using our SSO providers (Google or GitHub).

![](/img/console/getting_started/signin_form.png)

Once your account is created, log in to access the Console dashboard.

### Step 2 Connect the Security Engine to the Console

Upon account creation in the Console, an enroll key will be generated and attached to your account. This private key will link your CrowdSec Security Engine to the Console.

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

:::tip
How to verify the Security Engine sends signals to the Console
:::

Execute the following command

<!--TODO Update to unixwindowsk8s tabs -->
```bash
cscli decisions add --ip 1.2.3.4 --duration 1m
```

This action will create a decision for the IP address 1.2.3.4, trigger an alert in the Console, and block the IP for a duration of one minute.

Within a maximum timeframe of 5 minutes, the Console will be notified of the alert, and the Alerts tally on the Security Engine's card will increase.

:::info
The timeframe may differ based on numerous factors, such as network latency, the number of Security Engines, etc.
::: 
