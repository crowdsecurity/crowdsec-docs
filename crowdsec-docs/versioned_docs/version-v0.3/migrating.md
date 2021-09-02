---
title: Migrating from v0 to v1
id: migrating
---

# Migration from v0.X to v1.X

:::warning
Migrating to V1.X will impact (any change you made will be lost and must be adapted to the new configuration) :

- Database model : your existing database will be lost, a new one will be created in the V1.

- CrowdSec configuration :
    - `/etc/crowdsec/config/default.yaml`
    - `/etc/crowdsec/config/profiles.yaml`

:::

To upgrade CrowdSec from v0.X to v1, we'll follow [those steps](/docs/getting_started/install_crowdsec)

#### Backup up configuration

```
sudo cscli backup save /tmp/crowdsec_backup
sudo cp -R  /etc/crowdsec/config/patterns /tmp/crowdsec_backup
```

#### Uninstall old version & install new 

Download latest V1 CrowdSec version [here](https://github.com/crowdsecurity/crowdsec/releases) or use the `wizard.sh` from your downloaded package.

```
tar xvzf crowdsec-release.tgz
cd crowdsec-v1*/
sudo ./wizard.sh --uninstall
```

:::warning
Don't forget to remove Metabase dashboard if you installed it manually (without cscli).
:::


#### Install latest version

Follow the steps to [install the latest version](/docs/getting_started/install_crowdsec)


#### Restore configuration

:::warning
Before restoring old backup, if you have `local` or `tainted` postoverflows, be aware that they are no longer compatible. You should update the syntax (the community and us are available to help you doing this part).
:::

```
sudo cscli hub update
sudo cscli config restore --old-backup /tmp/crowdsec_backup/
sudo cp -R /tmp/crowdsec_backup/patterns /etc/crowdsec/
```

#### Upgrade Bouncers

If you were using **Bouncers** (formerly called **blocker(s)**), you need to replace them by the new compatibles Bouncers, available on the [hub](https://hub.crowdsec.net/browse/#bouncers) (selecting `agent version` to `v1`).

Following your bouncer type (netfilter, nginx, wordpress etc...), you need to replace them by the new available Bouncers on the hub, please follow the Bouncers documentation that will help you to install easily.

We're also available to help (on [discourse](https://discourse.crowdsec.net/) or [gitter](https://gitter.im/crowdsec-project/community)) upgrading your Bouncers.