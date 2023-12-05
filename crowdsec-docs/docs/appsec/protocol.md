---
id: protocol
title: Protocol
sidebar_position: 5
---

:::warning

This section is only relevant if you want to add support for the CrowdSec aplication security component in your own remediation component or directly at the application level.

:::


## Introduction

To interact with the CrowdSec aplication security component, a protocol need to be respected.

The aplication security component expect some headers to be present in the HTTP request (in addition to the original HTTP headers and body) and according to the result, the aplication security component will respond differently.

This documentation can be useful in case you want to write your own remediation component that interact with the CrowdSec aplication security component, or if you want to improve your existing one.

## HTTP Headers

To work with the CrowdSec aplication security component, some HTTP headers are require, in addition to the other HTTP headers and the body of the original request.

| Header Name               | Description                                                              |
| ------------------------- | ------------------------------------------------------------------------ |
| `X-Crowdsec-Appsec-Ip`      | The Real IP address of the original HTTP request                         |
| `X-Crowdsec-Appsec-Uri`     | The URI of the original HTTP request                                     |
| `X-Crowdsec-Appsec-Host`    | The Host of the original HTTP request                                    |
| `X-Crowdsec-Appsec-Verb`    | The Method of the original HTTP request                                  |
| `X-Crowdsec-Appsec-Api-Key` | The API Key to communicate with the CrowdSec aplication security component |

### Example

For this example:

- A HTTP request has been made by the IP `1.2.3.4`.
- The aplication security component listen on `http://localhost:4241/`.

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
<summary>HTTP Request sent to the aplication security component</summary>

```
GET / HTTP/1.1
Host: localhost:4241
X-Crowdsec-Appsec-ip: 1.2.3.4
X-Crowdsec-Appsec-Uri: /login
X-Crowdsec-Appsec-Host: example.com
X-Crowdsec-Appsec-Verb: POST
X-Crowdsec-Appsec-Api-Key: <API_KEY>
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

According to the result of the processing of the HTTP request, the aplication security component will response with a different HTTP code and body.

| HTTP Code | Description                                                                                                                                        | Body                                             |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `200`     | The HTTP request is allowed                                                                                                                        | `{"action" : "allow"}`                           |
| `403`     | The HTTP request triggered one or more aplication security component rules                                                                           | `{"action" : "ban"}` or `{"action" : "captcha"}` |
| `500`     | An error occurred in the aplication security component. The remediation component must support a `WAAP_FAILURE_ACTION` parameter to handle this case | `null`                                           |
| `401`     | The remediation component is not authenticated. It must use the same API Key that was generated to pull the local API request                      | `null`                                           |
