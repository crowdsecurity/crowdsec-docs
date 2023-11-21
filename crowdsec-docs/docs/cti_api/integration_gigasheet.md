---
id: integration_gigasheet
title: Gigasheet
sidebar_position: 2
---

CrowdSec's CTI API can be used in Gigasheet's No-Code API-data-enrichment feature. 

## Prerequisites

- As always you'll need a CTI API-key: [Follow this guide to get yours](https://docs.crowdsec.net/docs/next/cti_api/getting_started/).
- Create a free account on Gigasheet by [signing up here](https://app.gigasheet.com/signup)

## Preview

You can find the full tutorial there: [No-Code API with CrowdSec](https://gigasheet.com/no-code-api/crowdsec-cti-api)

Along with the list of [API examples](https://gigasheet.com/features/run-data-enrichment-apis-without-code) on Gigasheet website

**Here's a quick preview of what to expect:**

*The API-data-enrichment feature will parse a typical curl request to the CTI API: *

```curl -X GET "https://cti.api.crowdsec.net/v2/smoke/<ip to lookup>" -H  "accept: application/json" -H  "x-api-key: <YOUR API KEY>"```

![Enrichement configuration](/img/gigasheet_enrichement_config.png)

*You can then see a preview on a few lines:*

![Enrichement configuration](/img/gigasheet_enrichement_preview.png)

*It will then apply the enrichment on all the targeted lines*

![Enrichement configuration](/img/gigasheet_enrichement_result.png)
