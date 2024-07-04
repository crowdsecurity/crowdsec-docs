---
id: getting_started
title: Getting Started
---

:::info
This is an [enterprise plan](https://www.crowdsec.net/pricing) feature
:::

## What is the Service API ?

The **Service API**, **SAPI** for short, provides access to selected **CrowdSec SaaS features**.
New SaaS features will usually appear on **SAPI** first before getting their UI counterpart.
The current capabilities of this API are:

-  **Blocklist** creation & management
   -  Allowing you to create private blocklists and share them 
   -  As well as subscribing to any of the blocklists available to your organization
-  **Integrations** endpoints creation & management
   -  An Essential part of the **Blocklist as a Service** feature.
   -  Manage endpoints for your [**Firewalls**](/u/integrations/intro) or [**Remediation Components**](/u/bouncers/intro) to connect directly to.

## Getting your API keys

The CrowdSec Service API uses API keys to authenticate requests. You can create an API key in the CrowdSec Console by:

1. **Logging in** to the [CrowdSec Console](https://app.crowdsec.net/) and go to the **Settings** page.

![Settings_page](/img/console/settings/main.png)

2. Click on the **Service API Keys** section.

![Service_API_Keys](/img/console/settings/sapi_keys.png)

3. Click on the **Create API Key** button, fill in the form, set the permissions you want to grant.

![Create_API_Key](/img/console/settings/sapi_create_key.png)

6. Click on the **Create key** button.

![API_Key_Created](/img/console/settings/sapi_key_created.png)

Once you have created an API key, you can use it to authenticate requests to the CrowdSec Service API by including it in the `x-api-key` header of your HTTP requests.


## API Specifications

You can find a detailed description of the API in multiple formats here:

 - [Swagger](https://admin.api.crowdsec.net/v1/docs#/)
 - [Redoc](https://admin.api.crowdsec.net/v1/redoc)
 - [Openapi specs](https://admin.api.crowdsec.net/v1/openapi.json)




