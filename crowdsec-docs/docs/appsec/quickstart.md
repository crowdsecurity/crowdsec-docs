---
id: quickstart
title: Quickstart
sidebar_position: 2
---

<!-- @jdv deprecated, or we link it in installation tutorial (renaming it too) but lets not have dup content -->

The AppSec installation and configuration are pretty straightforward.

You can find a more advanced installation documentation [here](/appsec/installation.md).

To make the AppSec component work, we need to follow 3 steps.

### Install the collection

The first thing to do to set up the CrowdSec Application Component is to install the AppSec collection.

```
sudo cscli collections install crowdsecurity/appsec-virtual-patching
```

This collection will install the following items:

- The AppSec Rules
- The AppSec configuration
- The CrowdSec Parser for AppSec
- The CrowdSec Scenario(s) for AppSec

### Setup the acquisition

Now that we have installed the necessary collection, we need to set up the CrowdSec Acquisition to expose the Application Security Component.

```yaml title="/etc/crowdsec/acquis.yaml"
appsec_config: crowdsecurity/virtual-patching
labels:
  type: appsec
listen_addr: 127.0.0.1:7422
source: appsec
```

You can find more about this configuration [here](/data_sources/appsec.md).

:::note
The `appsec_config` to set is the one installed previously with the collection. You can find its name with `sudo cscli appsec-configs list`.
:::

You can now restart CrowdSec:

```bash
sudo systemctl restart crowdsec
```

### Setup the remediation component

Now that our Application Security Component is running in CrowdSec, we need to set up the remediation component to interact with it.

Note that every remediation component may have different option names for this.
I suggest you check directly in the remediation component documentation, but here we will use the [OpenResty remediation component](/u/bouncers/openresty) as an example.

To set up the AppSec in the OpenResty remediation component, we just need to set the Application Security Component URL previously exposed:

```bash title="/etc/crowdsec/bouncers/crowdsec-openresty-bouncer.conf"
APPSEC_URL=http://127.0.0.1:7422
# in case the AppSec run on the same machine, else provide the AppSec IP
```

And restart the service:

```bash
sudo systemctl restart openresty
```

If we now try an exploit that is covered by one of our Vpatch rules, we are blocked with the HTML page emitted by the remediation component:

![appsec-denied](/img/appsec_denied.png)
