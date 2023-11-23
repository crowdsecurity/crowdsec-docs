---
id: integration_splunk_siem
title: Splunk SIEM App
sidebar_position: 6
---

The **Splunk SIEM App** enables IP lookup from CrowdSec CTI API via custom command called `cssmoke`. It provides information about the IP, such as what kind of attacks it has been participant of as seen by CrowdSec's network. It also includes enrichment by CrowdSec like background noise score, aggressivity over time etc.


## Installation

The Splunk SIEM App is available in Splunkbase. You can download it from [here](https://splunkbase.splunk.com/app/6800/).

## Usage

- Get your API key for CrowdSec CTI API by following [this guide.](/cti_api/getting_started.mdx)

- Complete the App setup by providing your API Key 

![Setup View](/img/splunk_siem/splunk_siem_api_key_setup.png)


- Test it by running the query `| makeresults | eval ip="8.8.8.8" | cssmoke ipfield="ip"`

![Example Output](/img/splunk_siem/splunk_siem_example.png)
