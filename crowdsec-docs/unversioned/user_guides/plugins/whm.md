---
id: whm
title: WHM plugin
sidebar_position: 10
---

The WHM plugin offers a streamlined approach for controlling and monitoring the CrowdSec Security Engine protecting your server directly from your WHM dashboard.  
Designed specifically for WHM environments, this plugin comes packaged with configurations tailored to enhance your server's security posture efficiently.  

In a few easy steps, this guide walks you through the installation of the WHM plugin, and post-install verification that everything is working fine.

## Installation

### Prerequisites: install CrowdSec

To be able to use this plugin, the first step is to [install CrowdSec Security Engine](https://doc.crowdsec.net/docs/getting_started/install_crowdsec) on your WHM server.

### Download the plugin

First, connect to your WHM server.

Go to your home directory or in any directory that can be used to download the sources.

Choose [the release X.Y.Z you want to install](https://github.com/crowdsecurity/cs-whm-plugin/releases),
and:

* Download the source code archive.


```shell
wget https://github.com/crowdsecurity/cs-whm-plugin/archive/refs/tags/vX.Y.Z.tar.gz
```

* Extract sources:

```shell
tar -xvf vX.Y.Z.tar.gz
``` 

* Go to the extracted folder:

```shell
cd cs-whm-plugin-X.Y.Z/plugin
``` 


### Install the plugin

Once you've retrieved the sources, you can install the plugin by running the `install` script as root:

```shell
sudo sh crowdsec.sh install
```

You should see:

```
Installing CrowdSec plugin...
crowdsec registered
```

If you've already installed CrowdSec, the script will also use the `cscli` command to install the WHM collection, create a few acquisition files and restart the CrowdSec service.

If you don't want the script to install the WHM collection, you can use the `--only-plugin` option:

```
sudo sh crowdsec.sh install --only-plugin
```


### Navigate to the plugin in WHM


CrowdSec should appear in the sidebar (in the bottom Plugins sections).  
Easily find it by filtering your sidebar by starting to type *"crowdsec"*


## Post-installation checks

Once installation is complete, you can perform a few post-installation tasks to ensure that everything works as expected.


### Check the CrowdSec service status

At the top of all CrowdSec plugin pages, you can see the status of the CrowdSec service: if there's a green tick, the service is running. 

![Service status](img/whm-service-status.png)

If not, [check the troubleshooting section](#crowdSec-is-not-running).

### Check the metrics

Browse to the metrics tab and ensure that The CrowdSec security engine 

![Metrics](img/whm-metrics.png)

If not, [check the troubleshooting section](#changing-port-configuration).

### Check the default acquisition files

With the `sudo sh crowdsec.sh install` command, the plugin creates a few acquisition files in `etc/crowdsec/acquis.d/`. You can check that they are present and that they are correctly configured by browsing to the acquisition tab.

In addition to the main acquisitions in the `/etc/crowdsec/acquis.yaml`, you should see some acquisitions whose 
filenames begin with `default_` in the folder `/etc/crowdsec/acquis.d`.

If you've just installed the plugin, you should see notification that files have not been already parsed by your 
engine. 

![Acquisition not read](img/whm-acquisition-not-read.png)

This is normal, as it could take a few minutes for the engine to process the logs. But it is more than five minutes after the restart, you may need to check your configuration.


### Enroll your engine

You can also enroll your engine by going to the Enroll tab.


You just have to fill you enrollment key field and click the `Enroll` button.

![Enroll](img/whm-enroll.png)

For the benefits, please visit the [Console section](https://docs.crowdsec.net/docs/next/console/intro)

## Troubleshoot

### CrowdSec is not running

Most of the time it will be a port conflict or config file error
- Check and change the ports [In the settings menu](#changing-port-configuration).
- Check the logs for error
  - In CrowdSec's logs sudo less /var/log/crowdsec.log : Note that it might be very verbose.
  - You can also check:  sudo journalctl -u crowdsec
- Ultimately, you can check the [Security Engine Troubleshooting section](/u/troubleshooting/security_engine/)

### Changing port configuration

Note that CrowdSec security engine local API uses the 8080 port by default. And the Prometheus service 6060.  
It might be conflicting with another service installed on your server.  

You may have port conflict on either the CrowdSec Security Engine local API port or the metric (Prometheus) port.  
Easily change them and restart the service from the Settings menu of the plugin

![Settings](img/whm-settings.png)





