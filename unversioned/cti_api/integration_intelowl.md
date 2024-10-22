---
id: integration_intelowl
title: IntelOwl Plugin
sidebar_position: 2
---

Since the recent release of IntelOwl 4.2.2, a CrowdSec analyzer has been included. 
Now IntelOwl users can leverage our CTI API to enrich their IP type observables. 
A big thanks to Matteo Lodi for writing this analyzer. 
Intel Owl is an Open Source Intelligence, or OSINT solution to get threat intelligence data about a specific file, an IP or a domain from a single API at scale. It integrates several analyzers available online and a lot of cutting-edge malware analysis tools. It is for everyone who needs a single point to query for info about a specific file or observable.

## Prerequisites

- IntelOwl  v4.2.2+
- CrowdSec CTI API Key. 
  - [See this guide to get yours](https://docs.crowdsec.net/cti_api/getting_started.mdx/).

## Installation

CrowdSec's Analyzer is available and you should see it in the  /plugins/analyzers section

![Filtered Analyzers List](/img/intelowl_analyzers.png)

To configure that plugin and add your API Key you must click on the "Your plugin config" button on the top right corner of that page and then go in the "secrets" section.

There, click on "add a new entry" and fill it like so :
- Type: **Analyzer**
- Plugin Name: **CrowdSec**
- Attribute: **api_key_name**
- Value: *your API key*

![Plugin config](/img/intelowl_config.png)

## Usage

In the scan section, you can scan an IP type observable:
- Add the IP address as value.
- Select CrowdSec as one of the analyzer.
- Click **Start Scan**.

This will start a job retrieving information we might have about this IP malicious activities

![Scan form](/img/intelowl_scan.png)

![Scan Result](/img/intelowl_scan_result.png)