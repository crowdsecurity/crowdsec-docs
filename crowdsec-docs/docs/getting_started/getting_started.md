---
id: getting_started
title: Getting Started
---

import AcademyPromo from '@site/src/components/AcademyPromo';

Welcome to CrowdSec!

In this section, you'll be taken through the process of creating a console account, with the initial step being the installation of the Security Engine, followed by the deployment of your first Remediation Component.

## Creating a console account

To embark on your CrowdSec journey, the optimal starting point is to set up a console account, as it grants you access to complimentary features that seamlessly integrate with your Security Engine.

The CrowdSec console serves as a web-based interface enabling you to conveniently monitor all your CrowdSec instances from a centralized hub. To get started, simply [sign up here](https://app.crowdsec.net/signup).


## Deploy 

### Walkthrough

If you prefer a guided, step-by-step video tutorial for installing the Security Engine in a sandbox environment, please refer to our comprehensive guide.

<iframe width="100%" height="500" src="https://www.youtube-nocookie.com/embed/yxbimVtd2nw?controls=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

<AcademyPromo
  image="crowdsec_fundamentals.svg"
  description="Watch a short series of videos on how to install CrowdSec and protect your infrastructure"
  title="Complete Introduction"
  course="crowdsec-fundamentals"
  utm="?utm_source=docs&utm_medium=banner&utm_campaign=intro-page&utm_id=academydocs"
/>

or follow the steps below.

### Security Engine

:::info
In our updated documentation, we now refer to CrowdSec as the "Security Engine" and Bouncers as "Remediation Components" to better describe their roles in the ecosystem.
:::

#### Prerequisites

The Security Engine by default uses the following ports:
  - 8080/tcp for the API
  - 6060/tcp for the Prometheus metrics / Debugging

If these ports are not available on your system, you can change them in the configuration file post installation. See [Configuration](/configuration/crowdsec_configuration.md) for more information.

Please note that the API is mandatory for your security engine, do not remove it from your configuration.

#### Using the repository

For the most straightforward installation of the Security Engine, utilize the official repository, guaranteeing you'll constantly have the latest version.

Please see the relevant documentation for your OS:
- [Linux](/getting_started/install.mdx)
- [FreeBSD](/getting_started/install_freebsd.md)
- [Windows](/getting_started/getting_started_on_windows.md)

#### Installing from source

Should you opt for a source-based installation, you can follow the steps outlined [here](/getting_started/install_source.mdx).


### Remediation Component

After installing the Security Engine, you can proceed to install a Remediation Component, which is responsible for executing actions based on the decisions made by the Security Engine.

The specific Remediation Component to install may vary based on your network and operating system configuration.

If you are uncertain about which one to install, please refer to our [Remediation Components](/u/bouncers/intro) section or join our [Discord](https://discord.gg/crowdsec) and ask our community.

## Enroll

Since you created your account on the CrowdSec console, you can now [enroll your Security Engine to your account](https://app.crowdsec.net/security-engines?enroll-engine=true).

To do so, you can find steps outlined [here](/u/getting_started/post_installation/console/#engines-page).