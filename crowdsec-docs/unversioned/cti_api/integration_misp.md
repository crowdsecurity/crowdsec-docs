---
id: integration_misp
title: MISP Plugin
sidebar_position: 2
---

MISP hover plugin allows you to get knowledge from CrowdSec's CTI API upon hovering an IP in your MISP instance.

## Installation

### Setting up plugin server

The plugin is included in MISP's [official plugin repo](https://github.com/MISP/misp-modules).

The development version can be found on [crowdsec's fork](https://github.com/crowdsecurity/misp-modules).

Install the fork via by following instructions given [here](https://github.com/MISP/misp-modules#how-to-install-and-start-misp-modules-in-a-python-virtualenv-recommended)
. Make sure to subsitute repository address as required.

### Configure the plugin

1. Navigate to plugin settings page at `http://<your_misp_address>/servers/serverSettings/Plugin`

2. Click on Enrichment.

3. Set the value of Plugin.Enrichment_crowdsec_enabled to `true`

4. Set the value of Plugin.Enrichment_crowdsec_api_key to your CTI API key. See [instructions to obtain it](/cti_api/getting_started.mdx)

5. Set the value of Plugin.Enrichment_crowdsec_api_version to "v2".

Done !


## Usage

1. Simply click on hover button on any IP attribute.

![MISP hover](/img/misp_hover.png)

2. Upon clicking the hover icon, you will see the enrichements on this IP obtained from CrowdSec's CTI.

![MISP CrowdSec Hover](/img/misp_crowdsec_knowledge.png)

