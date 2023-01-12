---
id: integration_maltego
title: Maltego Transforms
sidebar_position: 4
---

Maltego transforms, which allow users to enrich IP entities in maltego with CrowdSec CTI intelligence.

# Deployment Guide

## Prerequisites

Make sure your instance has docker and docker compose installed. The instance should have a public IP.

## Steps

### Starting the transform server

Clone the repo and cd into it and start docker compose:

```
git clone https://github.com/crowdsecurity/maltego-transforms
cd maltego-transforms
docker compose up
```

### Modify settings to point to your IP

With your current working directory being in the cloned repo. Run the following command to point the settings to your instance's IP

```
sed -i "s/my_ip/1.2.3.4/g" transforms.csv
```

Replace **1.2.3.4** with your instance's IP


### Registering at pTDS

#### Importing Transforms

1. Navigate your browser to [pTDS website](https://public-tds.paterva.com/ptds/login)

2. Create an account and login.

3. Navigate to [Transforms](https://public-tds.paterva.com/transforms)

4. Click on import Transforms.

5. Click on Choose File and navigate to `transforms.csv` file we modified earlier.

6. Finally click on **Import Transform** Button

#### Creating a Seed

1. Navigate to [Seeds](https://public-tds.paterva.com/seeds)

2. Click on **Add Seed** Button.

3. Fill in the Seed Name, with name of your choice.

4. Click on the Transforms dropdown  and select all the CrowdSec Transforms.

5. Click on the **Add Seed** Button.


Done ! You can now share the Seed URL to maltego clients, and they'd be able to use the transforms. 


# User Guide

## Installation

### Registering the Seed URL

In your maltego client register the Seed URL we created in the above deployment guide  by following [this guide](https://docs.maltego.com/support/solutions/articles/15000011965-how-do-i-add-a-new-transform-seed-to-my-maltego-client-)

### Adding CrowdSec API key to the transforms

1. Obtain the CrowdSec CTI API key by following [this guide.](/docs/next/cti_api/getting_started)

2. Follow [this guide](https://docs.maltego.com/support/solutions/articles/15000017851-setting-api-keys-for-all-transforms-inside-a-hub-item) except select CrowdSec Transform Server.

3. Copy paste the API key in the `API key` field in the tranform properties

Done !

## Usage

All the CrowdSec transforms take the builtin IP entity as an input. You'd have an option to run them whenever you right click an IP entity.

As per your requirements you can either run multiple transforms or just a single one.

Below is a reference to what each transform does.


# Transform reference

#### CrowdSecAS

Adds AS entity for an IP by leveraging CrowdSec CTI data

#### CrowdSecActivity

Adds activity details properties to an IP using CrowdSec data.

#### CrowdSecAddAPIResp

Attaches CrowdSec CTI API response as a property to IP entity.

#### CrowdSecBehaviours

Creates a behaviour entity for an IP by leveraging CrowdSec CTI data

#### CrowdSecClassification

Creates classification details entities for an IP using CrowdSec data.

#### CrowdSecIPRange

Creates an IP range entity for an IP by leveraging CrowdSec CTI data.

#### CrowdSecLocation

Adds location entities by leveraging CrowdSec CTI data.

#### CrowdSecReverseDNS

Creates Reverse DNS entity for an IP by leveraging CrowdSec CTI data

#### CrowdSecScenarios

Creates entites for scenarios triggered by IP using CrowdSec CTI data.

#### CrowdSecScores

Adds score details for an IP by using CrowdSec CTI.

#### CrowdSecTargetCountries

Links IP entity with countries most attacked by it, using CrowdSec data.
