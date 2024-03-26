---
id: getting_started
title: Getting started
---

# Getting Started

## Pre-requisites

  

Step 1: Install a Security Engine to detect attacks on your server

[https://docs.crowdsec.net/docs/getting\_started/#security-engine](https://docs.crowdsec.net/docs/getting_started/#security-engine)

  

Step 2: Install a Remediation Component to block attacks with the Security Engine

[https://docs.crowdsec.net/u/bouncers/intro/](https://docs.crowdsec.net/u/bouncers/intro/)

  

### 1 - Sign Up and Log In

Visit the [CrowdSec Console website](https://app.crowdsec.net) and complete the sign-up process.

You will only need to provide an email and a password to create your account.

One-click connection with Google or GitHub is also available.

  

![](/img/console/getting_started/signin_form.png)

  

Once your account is created, log in to access the Console dashboard.

  

### 2 - Connect the Security Engine to the Console

Upon account creation in the Console, an enroll key will be generated and attached to your account. This private key will link your CrowdSec Security Engine to the Console.

Enroll your Security Engine by executing the following command from your server:

```plain
sudo cscli console enroll alpaga007fakeenrollkey42
```

  

An enrollment request will appear after a few seconds in the Console.

![](/img/console/getting_started/console_pending_enroll.png)

  

After accepting the enrollment, the Security Engine overview will be displayed in the Engines dashboard.

![](/img/console/getting_started/console_home.png)

  

Congratulations, your infrastructure will be ready to go with the Console!

  

_Tips to verify the Security Engine sends signals to the Console._

Execute the following command

```plain
cscli decisions add --ip 1.2.3.4
```

This will simulate an attack from IP 1.2.3.4, raise an alert in the Console and block this IP for 4 hours.

After a while, the Console will receive the alert, and the Alerts counter in the Security Engine's card will be incremented.