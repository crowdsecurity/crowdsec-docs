---
title: Introduction
description: Introduction to the CrowdSec Service API
---

The CrowdSec Service API allows you to interact programmatically with the CrowdSec platform. With this API, you can manage blocklists and integrations. More features will be added in the future to provide more control over the CrowdSec Console.

## Authentication

The CrowdSec Service API uses API keys to authenticate requests. You can create an API key in the CrowdSec Console by:

1. **Logging in** to the [CrowdSec Console](https://app.crowdsec.net/).
2. Go to the **Settings** page.
3. Click on the **Service API Keys** section.
4. Click on the **Create API Key** button.
5. Give your API key a name, description, set expiration if needed and select the permissions you want to grant.
6. Click on the **Create key** button.

Once you have created an API key, you can use it to authenticate requests to the CrowdSec Service API by including it in the `x-api-key` header of your HTTP requests.

## Making Requests

* Base URL: `https://admin.api.crowdsec.net/v1`
* Headers: `x-api-key: YOUR_API_KEY`

You can use any HTTP client library to make requests to the CrowdSec Service API. Here is an example using `curl`:

```bash
curl -X 'GET' 'https://admin.api.crowdsec.net/v1/blocklists' -H 'accept: application/json' -H 'x-api-key: YOUR_API_KEY'
```

## API Reference

The CrowdSec Service API reference is available at:

* [Swagger UI](https://admin.api.dev.crowdsec.net/v1/docs): The Swagger documentation for the CrowdSec Service API.
* [Redoc](https://admin.api.dev.crowdsec.net/v1/redoc): The ReDoc documentation for the CrowdSec Service API.

## SDKs

We provide SDKs for the CrowdSec Service API to make it easier to interact with the API in your preferred programming language:

* [Python SDK](https://github.com/crowdsecurity/crowdsec-service-api-sdk-python): A Python SDK for the CrowdSec Service API.

## Next Steps

Now that you have an API key and know how to authenticate requests, you can start using the CrowdSec Service API to manage blocklists and integrations. Check out the API reference and SDKs to get started.
