---
id: integration_sekoia_xdr
title: Sekoia XDR
sidebar_position: 2
---

CrowdSec's CTI API can be used in Sekoia XDR Playbooks to enrich alerts with CrowdSec's knowledge about the IP. You can learn more about Sekoia XDR Playbooks [here](https://docs.sekoia.io/xdr/features/automate/).

## Usage

Get your API key for CrowdSec CTI API by following [this guide.](/docs/next/cti_api/getting_started)

In your playbook you can now create a Node which calls CrowdSec's CTI API. 

### Configuring CrowdSec Node

![Config Sekoia XDR Node](/img/sekoia_xdr/config_node.png)

Following config is needed: 

```javascript
{"x-api-key":"", "User-Agent":"sekoia-playbook/v1.0.0"}
```

Don't forget to set the API key in the header `x-api-key`.
Make sure you feed the IP address in the URL. 



### Example Full Playbook

![Example Playbook](/img/sekoia_xdr/full_playbook.jpg)

### Example Results

![Example Output](/img/sekoia_xdr/results.jpg)

