---
id: integration_qradar
title: QRadar App
sidebar_position: 2
---


#  CrowdSec Qradar - Quick Access App

This QRadar App leverages CrowdSec's CTI’s smoke endpoint to get information about IP as seen by CrowdSec's network. This is enabled via a right click on IP GUI action. The information is presented with a summary of the IP's known behaviors, a link to CrowdSec's console and the possibility to copy the raw json response for further processing within Qradar. The information includes:

1. Types of attacks the IP has been observed performing.
2. Background Noise Score. Background Noise (BN), also known as “Internet Background Radiation” defines automatic and mild attacks that are perpetrated at a large scale, without a specific target.
3. Aggressivity which quantifies frequency of attacks.
4. Other fields like Geolocation details, AS details, sighting details etc


## Configuration

Setup the App in two easy steps
1. Generate your Crowdsec CTI API Key in CrowdSec's console. You can find the instructions to obtain it [here](https://docs.crowdsec.net/cti_api/getting_started.mdx)
2. Put the API Key in the App as demonstrated below

Within QRadar’s Admin page, navigate to the CrowdSec App and click on the app Setting icon

![config menu](/img/qradar/config_menu.png)

A pop-up will appear. Enter the API Key and click on Submit.

![API Key Form](/img/qradar/api_key_form.png)

The App is now configured !


## Usage

- Navigate to Log Activity pane in QRadar. 
- Right click on an IP either in Source IP or Destination IP column. Hover over "More Options". 
- You will see a new option "CrowdSec IP Lookup". Click on it.

![Qradar Log View](/img/qradar/log_view.png)

This will open a popup with the information about the right clicked IP found in CrowdSec's Smoke Dataset.

![Popup](/img/qradar/popup.png)

You can click on the "Show" button to see the RAW JSON response from the API.

![Raw JSON](/img/qradar/raw_json.png)


## References

You can find our latest taxonomy about attack details, classifications, scores etc in [our official docs](https://docs.crowdsec.net/docs/next/cti_api/taxonomy)
