---
id: getting_started
title: Getting Started
---

Welcome to CrowdSec!

This section will guide you through the installation of the Security Engine, and deployment of your first Remediation Component.

:::info
You may see CrowdSec referred to as "Security Engine" and Bouncers referred to as "Remediation Components" within new documentation. This is to better reflect the role of each component within the CrowdSec ecosystem.
:::

## Walkthrough

If you would like to follow a step-by-step video to install Security Engine on a sandbox environment please follow our guide.

<iframe width="100%" height="500" src="https://www.youtube-nocookie.com/embed/yxbimVtd2nw?controls=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

or follow the steps below.

## Installation Security Engine

### Prerequisites

The Security Engine by default uses the following ports:
  - 8080/tcp for the API
  - 6060/tcp for the Prometheus metrics / Debugging

If these ports are not available on your system, you can change them in the configuration file post installation. See [Configuration](/configuration/crowdsec_configuration.md) for more information.

Please note that the API is mandatory for your security engine, do not remove it from your configuration.

#### Using the repository

The easiest way to install  the Security Engine is to use the official repository. This will ensure that you always have the latest version of the Security Engine.

Please see the relevant documentation for your OS:
- [Linux](/getting_started/install.mdx)
- [FreeBSD](/getting_started/install_freebsd.md)
- [Windows](/getting_started/getting_started_on_windows.md)

#### Installing from source

If you wish to install from source, we have a short video guide on how to do this.

<iframe width="100%" height="500" src="https://www.youtube.com/embed/-1xxkwQyI2M" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

#### Installing a Remediation Component

Once you have installed the Security Engine, you can install a Remediation Component. This is the component that will take action on the decisions made by the Security Engine.

Depending on your network / OS setup, you will need to install a different Remediation Component.

If you are unsure which to install, please see our [Remediation Components](/bouncers/intro.md) section OR join our [discord](https://discord.gg/crowdsec) and ask our community.
