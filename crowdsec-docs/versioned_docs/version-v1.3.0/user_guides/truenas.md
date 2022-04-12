---
id: truenas
title: TrueNAS Scale installation
sidebar_position: 3
---


## Manually install the CrowdSec agent Debian package

```bash
wget --content-disposition "https://packagecloud.io/crowdsec/crowdsec/packages/debian/bullseye/crowdsec_1.3.2_amd64.deb/download.deb"
sudo dpkg -i ./crowdsec_1.3.2_amd64.deb
``` 

:::info

Keep in mind that CrowdSec is only in charge of the "detection", and won't block anything on its own. You need to deploy a [bouncer](/bouncers/intro.md) to "apply" decisions.

:::

## Manually install the CrowdSec iptables firewall Debian package

```bash
wget --content-disposition https://packagecloud.io/crowdsec/crowdsec/packages/debian/bullseye/crowdsec-firewall-bouncer-iptables_0.0.23_amd64.deb/download.deb
sudo dpkg -i crowdsec-firewall-bouncer-iptables_0.0.23_amd64.deb
```
This should now show in in your bouncers list. To verify this please run 
```bash
cscli bouncers list
```

You can now run any cscli command in the shell!
