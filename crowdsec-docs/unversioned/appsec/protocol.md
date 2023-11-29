---
id: protocol
title: Protocol
sidebar_position: 1
---

## Introduction

To interact with the CrowdSec application security engine, a protocol need to be respected.

The application security engine expect some headers to be present in the HTTP request (in addition to the original HTTP headers and body) and according to the result, the application security engine will respond differently.

This documentation can be useful in case you want to write your own remediation component that interact with the CrowdSec application security engine, or if you want to improve your existing one.

## HTTP Headers

To work with the CrowdSec application security engine, some HTTP headers are require, in addition to the other HTTP headers and the body of the original request.

| Header Name               | Description                                                              |
| ------------------------- | ------------------------------------------------------------------------ |
| `X-Crowdsec-Waap-Ip`      | The Real IP address of the original HTTP request                         |
| `X-Crowdsec-Waap-Uri`     | The URI of the original HTTP request                                     |
| `X-Crowdsec-Waap-Host`    | The Host of the original HTTP request                                    |
| `X-Crowdsec-Waap-Verb`    | The Method of the original HTTP request                                  |
| `X-Crowdsec-Waap-Api-Key` | The API Key to communicate with the CrowdSec application security engine |

### Example

For this example:

- A HTTP request has been made by the IP `1.2.3.4`.
- The application security engine listen on `http://localhost:4241/`.

<details>
<summary>Original HTTP Request</summary>

```
POST /login HTTP/1.1
Host: example.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:68.0) Gecko/20100101 Firefox/68.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Content-Type: application/x-www-form-urlencoded
Content-Length: 73
Connection: keep-alive
Upgrade-Insecure-Requests: 1

username=admin' OR '1'='1' -- &password=password

```

</details>

<details>
<summary>HTTP Request sent to the application security engine</summary>

```
GET / HTTP/1.1
Host: localhost:4241
X-Crowdsec-Waf-ip: 1.2.3.4
X-Crowdsec-Waf-Uri: /login
X-Crowdsec-Waf-Host: example.com
X-Crowdsec-Waf-Verb: POST
X-Crowdsec-Waf-Api-Key: <API_KEY>
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:68.0) Gecko/20100101 Firefox/68.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Content-Type: application/x-www-form-urlencoded
Content-Length: 73
Connection: keep-alive
Upgrade-Insecure-Requests: 1

username=admin' OR '1'='1' -- &password=password

```

</details>

## Response Code

According to the result of the processing of the HTTP request, the application security engine will response with a different HTTP code and body.

| HTTP Code | Description                                                                                                                                        | Body                                             |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `200`     | The HTTP request is allowed                                                                                                                        | `{"action" : "allow"}`                           |
| `403`     | The HTTP request triggered one or more application security engine rules                                                                           | `{"action" : "ban"}` or `{"action" : "captcha"}` |
| `500`     | An error occurred in the application security engine. The remediation component must support a `WAAP_FAILURE_ACTION` parameter to handle this case | `null`                                           |
| `401`     | The remediation component is not authenticated. It must use the same API Key that was generated to pull the local API request                      | `null`                                           |
