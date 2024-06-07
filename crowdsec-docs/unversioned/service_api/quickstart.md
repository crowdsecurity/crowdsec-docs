---
id: quickstart
title: Quickstart
---

:::info
 - We're assuming your API key is set in the environment variable `$KEY`
:::

## Blocklist(s) manipulation

<!--

 - show how to download blocklists

-->

### Create a blocklist

> Create a new private blocklist named `my_test_blocklist`

```bash
curl -i -H "x-api-key: ${KEY}" -X POST -H "Content-Type: application/json" \
https://admin.api.crowdsec.net/v1/blocklists \
-d '{ "name":"my_test_blocklist", "description": "testing blocklists feature" }' 
```

 - [Swagger method link](https://admin.api.crowdsec.net/v1/docs#/Blocklists/createBlocklist)

:::info
The `id` element of the response payload is going to be used as the future identifier operations targeting this blocklist.
:::

<details>
  <summary>answer on success</summary>

```json
{
  "id": "1234MYBLOCKLISTID",
  "created_at": "2024-06-06T07:33:38.509837Z",
  "updated_at": "2024-06-06T07:33:38.509839Z",
  "name": "my_test_blocklist",
  "label": "my_test_blocklist",
  "description": "testing blocklists feature",
  "references": [],
  "is_private": true,
  "tags": [],
  "pricing_tier": "free",
  "source": "custom",
  "stats": {
    "content_stats": {
      "total_seen": 0,
      "total_fire": 0,
      "total_seen_1m": 0,
      "total_in_other_lists": 0,
      "total_false_positive": 0,
      "false_positive_removed_by_crowdsec": 0,
      "most_present_behaviors": [],
      "most_present_categories": [],
      "most_present_scenarios": [],
      "top_as": [],
      "top_attacking_countries": [],
      "top_ips": [],
      "updated_at": null
    },
    "usage_stats": {
      "engines_subscribed_directly": 0,
      "engines_subscribed_through_org": 0,
      "engines_subscribed_through_tag": 0,
      "total_subscribed_engines": 0,
      "updated_at": null
    },
    "addition_2days": 0,
    "addition_month": 0,
    "suppression_2days": 0,
    "suppression_month": 0,
    "change_2days_percentage": 0,
    "change_month_percentage": 0,
    "count": 0,
    "updated_at": null
  },
  "from_cti_query": null,
  "since": null,
  "shared_with": [],
  "organization_id": "MY-ORG-ID-abcdef1234",
  "subscribers": []
}

```

</details>


### Add some IPs to blocklist

> Add IPs `1.2.3.4` and `5.6.7.8` to blocklist for the next 24h

```bash
curl -i -H "x-api-key: ${KEY}" -X POST -H "Content-Type: application/json" \
https://admin.api.crowdsec.net/v1/blocklists/1234MYBLOCKLISTID/ips \
-d '{ "ips": ["1.2.3.4", "5.6.7.8"], "expiration": "'`date --date='tomorrow' '+%FT%T'`'"}'
```

 - [Swagger method link](https://admin.api.crowdsec.net/v1/docs#/Blocklists/addIpsToBlocklist)


:::note

The `expiration` field is mandatory and indicates when the IP should be deleted from the blocklist.

:::


### View blocklist stats

:::info
When querying stats about a blocklist, you will also get information about how the IPs are known in the CTI.
However, keep in mind that those statistics are computed upon list modification, and then refreshed every 6 hours.
:::

```bash
curl -i -H "x-api-key: ${KEY}"  -H "Content-Type: application/json" \
https://admin.api.crowdsec.net/v1/blocklists/1234MYBLOCKLISTID
```

 - [Swagger method link](https://admin.api.crowdsec.net/v1/docs#/Blocklists/getBlocklist)


<details>
  <summary>answer on success</summary>
```json
{
  "id": "1234MYBLOCKLISTID",
  "created_at": "2024-06-06T07:33:38.509000Z",
  "updated_at": "2024-06-06T07:33:38.509000Z",
  "name": "my_test_blocklist",
  "label": "my_test_blocklist",
  "description": "testing blocklists feature",
  "references": [],
  "is_private": true,
  "tags": [],
  "pricing_tier": "free",
  "source": "custom",
  "stats": {
    "content_stats": {
      "total_seen": 1,
      "total_fire": 0,
      "total_seen_1m": 0,
      "total_in_other_lists": 1,
      "total_false_positive": 0,
      "false_positive_removed_by_crowdsec": 0,
      "most_present_behaviors": [
        {
          "name": "ssh:bruteforce",
          "label": "SSH Bruteforce",
          "description": "IP has been reported for performing brute force on ssh services.",
          "references": [],
          "total_ips": 1
        },
        {
          "name": "http:dos",
          "label": "HTTP DoS",
          "description": "IP has been reported trying to perform denial of service attacks.",
          "references": [],
          "total_ips": 1
        },
        {
          "name": "tcp:scan",
          "label": "TCP Scan",
          "description": "IP has been reported for performing TCP port scanning.",
          "references": [],
          "total_ips": 1
        },
        {
          "name": "http:scan",
          "label": "HTTP Scan",
          "description": "IP has been reported for performing actions related to HTTP vulnerability scanning and discovery.",
          "references": [],
          "total_ips": 1
        },
        {
          "name": "http:exploit",
          "label": "HTTP Exploit",
          "description": "IP has been reported for attempting to exploit a vulnerability in a web application.",
          "references": [],
          "total_ips": 1
        },
        {
          "name": "http:bruteforce",
          "label": "HTTP Bruteforce",
          "description": "IP has been reported for performing a HTTP brute force attack (either generic HTTP probing or applicative related brute force).",
          "references": [],
          "total_ips": 1
        }
      ],
      "most_present_categories": [
        {
          "name": "proxy:vpn",
          "label": "VPN",
          "description": "IP exposes a VPN service or is being flagged as one.",
          "total_ips": 1
        }
      ],
      "most_present_scenarios": [
        {
          "name": "crowdsecurity/nginx-req-limit-exceeded",
          "label": "Nginx request limit exceeded",
          "description": "Detects IPs which violate nginx's user set request limit.",
          "references": [],
          "total_ips": 1
        },
        {
          "name": "crowdsecurity/jira_cve-2021-26086",
          "label": "Jira CVE-2021-26086 exploitation",
          "description": "Detect Atlassian Jira CVE-2021-26086 exploitation attemps",
          "references": [],
          "total_ips": 1
        },
        {
          "name": "crowdsecurity/http-bad-user-agent",
          "label": "Bad User Agent",
          "description": "Detect usage of bad User Agent",
          "references": [],
          "total_ips": 1
        },
        {
          "name": "crowdsecurity/ssh-bf",
          "label": "SSH Bruteforce",
          "description": "Detect ssh bruteforce",
          "references": [],
          "total_ips": 1
        },
        {
          "name": "crowdsecurity/CVE-2017-9841",
          "label": "PHP Unit Test Framework CVE-2017-9841",
          "description": "Detect CVE-2017-9841 exploits",
          "references": [],
          "total_ips": 1
        },
        {
          "name": "crowdsecurity/vpatch-env-access",
          "label": "Access to .env file",
          "description": "Detect access to .env files",
          "references": [],
          "total_ips": 1
        },
        {
          "name": "firewallservices/pf-scan-multi_ports",
          "label": "PF Scan Multi Ports",
          "description": "ban IPs that are scanning us",
          "references": [],
          "total_ips": 1
        },
        {
          "name": "crowdsecurity/ssh-slow-bf",
          "label": "SSH Slow Bruteforce",
          "description": "Detect slow ssh bruteforce",
          "references": [],
          "total_ips": 1
        },
        {
          "name": "crowdsecurity/http-bf-wordpress_bf_xmlrpc",
          "label": "WP XMLRPC bruteforce",
          "description": "detect wordpress bruteforce on xmlrpc",
          "references": [],
          "total_ips": 1
        },
        {
          "name": "crowdsecurity/http-probing",
          "label": "HTTP Probing",
          "description": "Detect site scanning/probing from a single ip",
          "references": [],
          "total_ips": 1
        }
      ],
      "top_as": [
        {
          "as_num": "0",
          "as_name": "AS0",
          "total_ips": 1
        }
      ],
      "top_attacking_countries": [
        {
          "country_short": "AU",
          "total_ips": 1
        }
      ],
      "top_ips": [
        {
          "ip": "1.2.3.4",
          "total_signals_1m": 4,
          "reputation": "suspicious"
        }
      ],
      "updated_at": "2024-06-06T10:31:28.724000Z"
    },
    "usage_stats": {
      "engines_subscribed_directly": 0,
      "engines_subscribed_through_org": 0,
      "engines_subscribed_through_tag": 0,
      "total_subscribed_engines": 0,
      "updated_at": "2024-06-06T10:31:28.727000Z"
    },
    "addition_2days": 2,
    "addition_month": 2,
    "suppression_2days": 0,
    "suppression_month": 0,
    "change_2days_percentage": 100,
    "change_month_percentage": 100,
    "count": 2,
    "updated_at": "2024-06-06T10:31:28.727000Z"
  },
  "from_cti_query": null,
  "since": null,
  "shared_with": [],
  "organization_id": "MY-ORG-ID-abcdef1234",
  "subscribers": []
}

```
</details>


### Subscribe to a blocklist

You can see details about the [subscriber's logic here](/unversioned/service_api/blocklists.md#subscribing-to-blocklists).

```bash
curl -i -H "x-api-key: ${KEY}" -X POST -H "Content-Type: application/json" \
https://admin.api.crowdsec.net/v1//blocklists/1234MYBLOCKLISTID/subscribers \
-d '{ "ids": ["SECENGINEID5678"], "entity_type": "engine", "remediation": "ban" }'
```
 - [Swagger method link](https://admin.api.crowdsec.net/v1/docs#/Blocklists/subscribeBlocklist)

<details>
  <summary>answer on success</summary>
```json
{"updated":["SECENGINEID5678"],"errors":[]}
```
</details>


### Download blocklist content

```bash
GET -H "x-api-key: ${KEY}" https://admin.api.crowdsec.net/v1/blocklists/1234MYBLOCKLISTID/download
```

## Integrations manipulation

### Creating integration

```bash
curl -i -H "x-api-key: ${KEY}" -X POST -H "Content-Type: application/json" \
https://admin.api.crowdsec.net/v1/integrations \
-d '{ "name": "test_integration_1", "description": "my test integration", "entity_type": "firewall_integration", "output_format": "plain_text" }'
```

:::warning
The `username` and `password` will only be displayed at creation time, be sure to write them down.
:::

 - [Swagger method link](https://admin.api.crowdsec.net/v1/docs#/Integrations/createIntegration)

<details>
  <summary>answer on success</summary>
```json
{
  "id": "INTEGRATIONID12345",
  "name": "test_integration_1",
  "organization_id": "MY-ORG-ID-abcdef1234",
  "description": "my test integration",
  "created_at": "2024-06-07T14:00:31.645929Z",
  "updated_at": "2024-06-07T14:00:31.645943Z",
  "entity_type": "firewall_integration",
  "output_format": "plain_text",
  "last_pull": null,
  "blocklists": [],
  "endpoint": "https://admin.api.crowdsec.net/v1/integrations/INTEGRATIONID12345/content",
  "stats": {
    "count": 0
  },
  "credentials": {
    "username": "<login>",
    "password": "<password>"
  }
}

```
</details>

### View integration content

View integration content allows you to preview the list of IPs that are returned to your firewall (or whatever is going to consume the integration).

```bash
curl -i   -u '<login>:<password>' https://admin.api.crowdsec.net/v1/integrations/INTEGRATIONID12345/content
```
