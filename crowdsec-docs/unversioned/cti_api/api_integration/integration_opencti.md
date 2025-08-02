---
id: integration_opencti
title: OpenCTI Enrichment Connector
sidebar_position: 2
---

OpenCTI Internal enrichment connector that provides advanced Threat context on your IP Observables.  
Get the most out of CrowdSec Threat Intelligence for a better understanding of bad actors hitting your infrastructure.

[Official OpenCTI connector Repo](https://github.com/OpenCTI-Platform/connectors/tree/master/internal-enrichment/crowdsec)

## Installation

You can check the [install guide on our repository](https://github.com/crowdsecurity/cs-opencti-internal-enrichment-connector/blob/main/docs/INSTALLATION_GUIDE.md)  
We'll give you an overview of the steps thereafter.  

### Via Docker Compose using the official repo

Add a `connector-crowdsec` in your `docker-compose.yml` file containing your OpenCTI deployment. Replace the environment value `ChangeMe`  with appropriate values.

```yaml
  connector-crowdsec:
    image: opencti/connector-crowdsec:6.2.1
    environment:
      - OPENCTI_URL=http://opencti:8080 # OpenCTI API URL
      - OPENCTI_TOKEN=ChangeMe # Add OpenCTI API token here
      - CONNECTOR_ID=ChangeMe # Add CrowdSec connector ID (any valid UUID v4)
      - CONNECTOR_TYPE=INTERNAL_ENRICHMENT
      - CONNECTOR_SCOPE=IPv4-Addr,IPv6-Addr # MIME type or Stix Object
      - CONNECTOR_CONFIDENCE_LEVEL=100 # From 0 (Unknown) to 100 (Fully trusted)
      - CONNECTOR_LOG_LEVEL=error
      - CONNECTOR_UPDATE_EXISTING_DATA=false
      - CONNECTOR_NAME=CrowdSec
      - CROWDSEC_KEY=ChangeMe # Add CrowdSec's CTI API Key
      - CROWDSEC_API_VERSION=v2 #v2 is the only supported version for now
    restart: always
  # If you add it to your OpenCTI docker-compose, add depends_on: - opencti
```

### Manual activation

If you want to manually launch the connector, you just have to install Python 3 and pip3 for dependencies:

```
$ apt install python3 python3-pip
```

Download the [release](https://github.com/OpenCTI-Platform/connectors/archive/%7BRELEASE_VERSION%7D.zip) of the connectors:

```
$ wget <https://github.com/OpenCTI-Platform/connectors/archive/{RELEASE_VERSION}.zip>
$ unzip {RELEASE_VERSION}.zip
$ cd connectors-{RELEASE_VERSION}/internal-enrichment/crowdsec

```

Install dependencies and initialize the configuration:

```
$ pip3 install -r requirements.txt
$ cp config.yml.sample config.yml
```

The config.yml initially contains the following contents.

```yaml
opencti:
  url: 'http://localhost:8080'
  token: ChangeMe

connector:
  id: ChangeMe
  type: 'INTERNAL_ENRICHMENT'
  name: 'CrowdSec'
  scope: 'IPv4-Addr' # MIME type or SCO
  confidence_level: 80 # From 0 (Unknown) to 100 (Fully trusted)
  log_level: 'info'
  auto: true

crowdsec:
  key: ChangeMe
  api_version: v2
  name: CrowdSec
  description: CrowdSec CTI
  max_tlp: 'TLP:AMBER'
```

Replace `opencti.token` with your openCTI token
Replace `connector.id` with an ID of your choice. 
Replace `crowdsec.key` with your CrowdSec CTI API key. See [instructions about obtaining it](/cti_api/api_getting_started.mdx)

Finally run the connector

```
$ python3 crowdsec.py
```

### Connector configuration

You'll find all config params in the repo's [User Guide](https://github.com/crowdsecurity/cs-opencti-internal-enrichment-connector/blob/main/docs/USER_GUIDE.md).  
You can choose what enrichments will be added: 
- Various labels base on reputation, behaviors, mitre attack and their colors
- Sightings
- Indicators and attack patterns
- Details note
- ...

Here are the recommended starter parameters:

```yaml
environment:
  # [...]
  - CROWDSEC_LABELS_SCENARIO_NAME=true
  - CROWDSEC_LABELS_SCENARIO_LABEL=false
  - CROWDSEC_LABELS_CVE=true
  - CROWDSEC_LABELS_MITRE=true
  - CROWDSEC_LABELS_REPUTATION=true
  - CROWDSEC_INDICATOR_CREATE_FROM='malicious,suspicious,known'
  - CROWDSEC_CREATE_NOTE=true
  - CROWDSEC_CREATE_SIGHTING=true
  - CROWDSEC_CREATE_TARGETED_COUNTRIES_SIGHTINGS=false
```
## Usage & Preview

Make sure the CrowdSec connector is registered, by navigating to `https://<opencti_host>/dashboard/data/ingestion/connectors`
(`http://<opencti_host>/dashboard/data/connectors` in older versions of openCTI)

Whenever an IP object is imported in your OpenCTI instances, it can get enriched automatically with CrowdSec Threat Intelligence.

In the example below you can see that our observables have labels created by our connector.  
They show the reputation, the mitre attack technique code and the behavior associated with that IP.  
Labels can be activated and deactivated for various enrichment dimensions as well as have a custom color of your choice. Refer to the [User Guide](https://github.com/crowdsecurity/cs-opencti-internal-enrichment-connector/blob/main/docs/USER_GUIDE.md) to know more.

![OpenCTI enriched](/img/opencti_observables_list.png)

There after you can see the kind of enrichments added to your observable:
- Labels of course
- External reference
- Various relationships like Indicators, Attack patterns ...
- And a note mentionning important informations like the date of first and last seen, top target countries and more.

![OpenCTI enriched](/img/opencti_observable_details.png)

Finally you can browse the various relationships created for this observable like the indicators:

![OpenCTI enriched](/img/opencti_indicators.png)
