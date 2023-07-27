---
id: intro
title: Introduction
sidebar_position: 1
---

## Console Management

The CrowdSec security engine is now able to receive instructions from the console.
This is done via a polling API, it means that the CrowdSec Local API will use long polling to get orders from the CrowdSec Console.
Currently, only 4 orders are available:
 - Adding decisions from the console
 - Delete decisions from the console
 - Force pull the community-blocklist/third party list when an instance subscribe/unsubscribe to a blocklist in the Console
 - Reauth to CAPI, when for example an instance is added to a tag


## Enable console management

The console management is still under feature flag on the CrowdSec Security Engine side. 
There are two ways to enable this feature flag:
 - Create or edit `/etc/crowdsec/feature.yaml` with the following flag

```yaml
- papi_client
```
 - Add this environement variable to the crowdsec service file with `sudo systemctl edit crowdsec.service`:
```
[Service]
Environment=CROWDSEC_FEATURE_PAPI_CLIENT=true
```

And then reload the systemctl daemon with `sudo systemctl daemon-reload`

Now that the feature flag is enabled, we need to enable the option on the LAPI side:
```bash
sudo cscli console enable console_management
sudo systemctl restart crowdsec
```

The console_management is now enabled and our CrowdSec Security Engine is ready to receive orders from the CrowdSec Console.
