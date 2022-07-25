---
id: integration_chrome
title: Chrome Plugin
sidebar_position: 1
---

The Chrome Plugin allows you to quickly select an IP on some web page and query it in CTI API.

## Installation

<!-- ### From Chrome Web Store

TODO -->

### From sources

Clone the repo via 
```
git clone https://github.com/crowdsecurity/crowdsec_chrome_extension
```

Open the Extension Management page by navigating to chrome://extensions.

Enable Developer Mode by clicking the toggle switch next to Developer mode.

Click the Load unpacked button and select the repo directory.

##  Usage

Make sure you are logged in to your CrowdSec Console account. Click [here](https://app.crowdsec.net/) to create/login account.

Simply select any IP address by dragging your mouse cursor.
Then upon right clicking you would see an option to lookup the IP in  CrowdSec's CTI.

![image info](/img/chrome_ext.png)