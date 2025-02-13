---
id: integration_misp
title: MISP Plugin
sidebar_position: 2
---

MISP plugin lets you enrich the knowledge of IP attributes using CrowdSec's CTI API.

## Installation

### Requirements

- A CrowdSec CTI API key. See [instructions to obtain it](https://docs.crowdsec.net/docs/next/cti_api/getting_started/#getting-an-api-key)

### Setting up plugin server

The plugin is included in MISP's [official plugin repo](https://github.com/MISP/misp-modules).


### Configure the plugin

You can activate this module by accessing the “Plugins” tab of your MISP instance:

1. Navigate to plugin settings page at `http://<your-misp-address>/servers/serverSettings/Plugin`
2. Click on Enrichment
3. Set the value of `Plugin.Enrichment_crowdsec_enabled` to `true`
4. Set the value of `Plugin.Enrichment_crowdsec_api_key` to your CrowdSec CTI API key
   
For more details on the settings available, please refer to the [Configurations](#configurations) part.


## Usage

Thanks to the CrowdSec Threat Intelligence, you can enrich your IP attributes.

![Enrich IP](/img/misp/enrich-event-from-left-menu-popup.png)

Once enriched, you will find a `crowdsec-ip-context` object with all attributes retrieved from CrowdSec.

For more details about this object, please refer to the [Misp project documentation](https://www.misp-project.org/objects.html#_crowdsec_ip_context).


![Enriched IP part 1](/img/misp/enriched-ip-event.png)

![Enriched IP part 2](/img/misp/enriched-ip-event-2.png)


## Configurations

You will find the settings page at `http://<your-misp-address>/servers/serverSettings/Plugin`

![Configurations](/img/misp/config.png)

Configuration parameters are described below:


| Setting name                                         | Mandatory | Type    | Description                                                                                                                                |
|------------------------------------------------------|-----------|---------|--------------------------------------------------------------------------------------------------------------------------------------------|
| `Plugin.Enrichment_crowdsec_enabled`                 | Yes       | Boolean | Enable or disable the crowdsec module                                                                                                      |
| `Plugin.Enrichment_crowdsec_restrict`                | No        | String  | Restrict the crowdsec module to the given organisation.                                                                                    |
| `Plugin.Enrichment_crowdsec_api_key`                 | Yes       | String  | CrowdSec CTI  API key. See [instructions to obtain it](https://docs.crowdsec.net/docs/next/cti_api/getting_started/#getting-an-api-key)    |
| `Plugin.Enrichment_crowdsec_add_reputation_tag`      | No        | String  | Enable/disable the creation of a reputation tag for the IP attribute. You can use  `True` or `False` as string value. Default: `True`      |
| `Plugin.Enrichment_crowdsec_add_behavior_tag`        | No        | String  | Enable/disable the creation of a behavior tag for the IP attribute. You can use  `True` or `False` as string value. Default: `True`        |
| `Plugin.Enrichment_crowdsec_add_classification_tag`  | No        | String  | Enable/disable the creation of a classification tag for the IP attribute. You can use  `True` or `False` as string value. Default: `True`  |
| `Plugin.Enrichment_crowdsec_add_mitre_technique_tag` | No        | String  | Enable/disable the creation of a mitre technique tag for the IP attribute. You can use  `True` or `False` as string value. Default: `True` |
| `Plugin.Enrichment_crowdsec_add_cve_tag`             | No        | String  | Enable/disable the creation of a cve tag for the IP attribute. You can use  `True` or `False` as string value. Default: `True`             |



