---
id: integration_opencti
title: OpenCTI Plugin
sidebar_position: 2
---

OpenCTI connector which enriches your knowledge by using CrowdSec's CTI API. It enriches knowledge about every incoming IP in OpenCTI by looking it up in CrowdSec CTI.


## Installation

### Via Docker Compose using official repo

Add a `connector-crowdsec` in your `docker-compose.yml` file containing your OpenCTI deployment. Replace environment value `changeme`  with appropriate values.

```yaml
connector-crowdsec:
    image: opencti/connector-crowdsec:5.5.2
    environment:
      - OPENCTI_URL=http://changeme
      - OPENCTI_TOKEN=changeme
      - CROWDSEC_VERSION=v2
      - CROWDSEC_KEY=changeme
      - CROWDSEC_DESCRIPTION=crowdsec_desc
      - CROWDSEC_MAX_TLP=TLP:AMBER
      - CONNECTOR_ID=changeme
      - CONNECTOR_TYPE=INTERNAL_ENRICHMENT
      - CONNECTOR_NAME=crowdsec
      - CONNECTOR_SCOPE=IPv4-Addr # MIME type or Stix Object
      - CONNECTOR_CONFIDENCE_LEVEL=100 # From 0 (Unknown) to 100 (Fully trusted)
      - CONNECTOR_LOG_LEVEL=info
    restart: always
```

### Manual activation

If you want to manually launch connector, you just have to install Python 3 and pip3 for dependencies:

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
Replace `crowdsec.key` with your CrowdSec CTI API key. See [instructions about obtaining it](/cti_api/getting_started.mdx)

Finally run the connector

```
$ python3 crowdsec.py
```

## Usage

Make sure the crowdsec connector is registered, by navigating to `http://<opencti_host>/dashboard/data/connectors`

Whenever an IP object is imported in your OpenCTI instancem, it will get enriched automatically by CrowdSec knowledge.

![OpenCTI enriched](/img/opencti_crowdsec.png)
