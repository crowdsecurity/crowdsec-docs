---
id: python
title: Python
---

## Installation

You can install the Python SDK using `pip`.

```bash
pip install crowdsec-service-api
```

## References

You will find the references for the Python SDK below.

- [crowdsecurity/crowdsec-service-api-sdk-python](https://github.com/crowdsecurity/crowdsec-service-api-sdk-python/tree/main/doc)

## Usage

### Pre-requisites

- An active [CrowdSec account](https://app.crowdsec.net/)
- An API key for the Service API (guide [here](/unversioned/console/service_api/getting_started.mdx#getting-your-api-keys))

### Authentication

After obtaining an API key, you can authenticate requests to the Service API by including the key in the `x-api-key` header of your HTTP requests.

:::info
 - We're assuming your API key is set in the environment variable `$KEY`
:::

#### Python

```python
import os
from crowdsec_service_api import (
    Server,
    Info
    ApiKeyAuth,
)

KEY = os.getenv('KEY')

auth = ApiKeyAuth(api_key=KEY)
client = Info(base_url=Server.production_server.value, auth=auth)
# Get info about the user
response = client.get_info()
print(response)
```

### Making Requests

You can use the SDK to interact with the Service API. it's defined by service endpoints, such as `blocklists`, `integrations`, etc.

#### Python

```python
# Get all blocklists
import os
from crowdsec_service_api import (
    Blocklists,
    Server,
    ApiKeyAuth,
)

KEY = os.getenv('KEY')

auth = ApiKeyAuth(api_key=KEY)
client = Blocklists(base_url=Server.production_server.value, auth=auth)
response = client.get_blocklists(
    page=1,
    page_size=100,
    include_filter=['private', 'public'],
    size=50,
)
print(response)
```

### Error Handling

#### Python

The SDK raises exceptions when an error occurs. You can catch these exceptions and handle them as needed.

```python
import os
from crowdsec_service_api import (
    Blocklists,
    Server,
    ApiKeyAuth,
)
from httpx import HTTPStatusError

KEY = os.getenv('KEY')

auth = ApiKeyAuth(api_key=KEY)
client = Blocklists(base_url=Server.production_server.value, auth=auth)
try:
    response = client.get_blocklists(
        page=1,
        page_size=100,
        include_filter=['private', 'public'],
        size=50,
    )
    print(response)
except HTTPStatusError as e:
    if e.response.status_code == 401:
        print("Unauthorized: Invalid API key")
    elif e.response.status_code == 409:
        print("Conflict", e.response.json())
    else:
        print(f"An error occurred: {e}")
except Exception as e:
    print(f"Another error occurred: {e}")
```

### Support

* Discord: [CrowdSec Discord](https://discord.gg/crowdsec)
* GitHub: 
    - [crowdsecurity/crowdsec-service-api-sdk-python](https://github.com/crowdsecurity/crowdsec-service-api-sdk-python)

