---
id: building
title: Manual installation
sidebar_position: 3
---


## Manually install the Debian package

Fetch your package from the [public repository](https://packagecloud.io/crowdsec/crowdsec), and install it manually :

```bash
sudo dpkg -i ./crowdsec_1.1.1_amd64.deb
```

## Install from the release tarball

Fetch CrowdSec latest version [here](https://github.com/crowdsecurity/crowdsec/releases).

```bash
tar xvzf crowdsec-release.tgz
cd crowdsec-v*
sudo ./wizard.sh -i
```

A [wizard](/user_guides/building.md##using-the-wizard) is provided to help you deploy CrowdSec and cscli.

## Using the Wizard

### Interactive mode

```
sudo ./wizard.sh -i
```

The wizard is going to guide you through the following steps :

 - detect services that are present on your machine
 - detect selected services logs
 - suggest collections (parsers and scenarios) to deploy
 - deploy & configure CrowdSec in order to watch selected logs for selected scenarios
 
The process should take less than a minute, [please report if there are any issues](https://github.com/crowdsecurity/crowdsec/issues).

You are then ready to [take a tour](/getting_started/crowdsec_tour.mdx) of your freshly deployed CrowdSec !

:::info

Keep in mind that CrowdSec is only in charge of the "detection", and won't block anything on its own. You need to deploy a [bouncer](/u/bouncers/intro) to "apply" decisions.

:::


### Binary installation

> you of little faith

```
sudo ./wizard.sh --bininstall
```

This will only deploy the binaries, and some extra installation steps need to be completed for the software to be functional :

 - `sudo cscli hub update` : update the hub index
 - `sudo cscli machines add -a` : register crowdsec to the local API
 - `sudo cscli capi register` : register to the central API
 - `sudo cscli collections install crowdsecurity/linux` : install essential configs (syslog parser, geoip enrichment, date parsers)
 - configure your [datasources](/data_sources/introduction.md)

You can now start & enable the crowdsec service :

 - `sudo systemctl start crowdsec`
 - `sudo systemctl enable crowdsec`


### Unattended mode

If your setup is standard and you've walked through the default installation without issues, you can win some time in case you need to perform a new install : `sudo ./wizard.sh --unattended` 

This mode will emulate the interactive mode of the wizard where you answer **yes** to everything and stick with the default options.


## Building docker image

Crowdsec provides a docker image and can simply built like this :

```bash
git clone https://github.com/crowdsecurity/crowdsec.git && cd crowdsec
docker build -t crowdsec .
```

## Building from source

You can see the [build instructions](/getting_started/install_source.mdx) for more details.
