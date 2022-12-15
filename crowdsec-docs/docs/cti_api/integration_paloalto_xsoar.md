---
id: integration_paloalto_xsoar
title: PaloAlto Cortex XSOAR Cortex Plugin
sidebar_position: 2
---

The **PaloAlto XSOAR/XSIAM - Cortex Plugin** allows you to obtain a detailed report from CrowdSec's CTI **smoke** database.


## Installation

The integration is available directly from within Cortex XSOAR.  
* Find and add an instance of the CrowdSec data enrichment. 
* Fill in the API key you generated from the [console interface](https://doc.crowdsec.net/docs/cti_api/getting_started).
![Cortex XSOAR integration](/img/cortex-XSOAR-find-integration.png)  
If you need to download it you can find it [here](https://cortex.marketplace.pan.dev/marketplace/details/CrowdSec/).  
You can also refer to the [integration documentation](https://xsoar.pan.dev/docs/reference/integrations/crowd-sec).

## Usage

Once the CrowdSec enrichment is activated, your incidents will benefit from CrowdSec's CTI data on the incident's IP. 
![Incident Info Main](/img/cortex-XSOAR-incident-info-main.png)

Date of the incident and attack details will be visible in the quick view and the full view  
![Incident Summary](/img/cortex-XSOAR-summary.png)  
![Source Details](/img/cortex-XSOAR-source-details.png)  
