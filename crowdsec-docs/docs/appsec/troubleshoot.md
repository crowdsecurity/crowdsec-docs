---
id: troubleshoot
title: Troubleshooting
sidebar_position: 6
---


<!--
 test that your setup works
  - waap engine works
  - bouncer works
  - test given rules
  - view cscli metrics
  - explain overall metrics


-->

# Interacting with the AppSec Component

To test that the AppSec component is working correctly, you can send requests directly to it. A few things to know:
 - To speak to the appsec component, you need to have a valid remediation component API Key
 - The appsec component expects to receive some of the element in specific headers

We are going to test that the appsec component detects correctly CVE-2023-42793, which is part of the [CISA virtual patching collection](https://hub.crowdsec.net), that should be installed for this to work (see `cscli appsec-rules list`). <!-- @tko: fix link to collection when merged -->This rule is pretty straightforward and detects requests to an URI ending with `/rpc2`:

> cat /etc/crowdsec/appsec-rules/vpatch-CVE-2023-42793.yaml
```yaml
name: crowdsecurity/vpatch-CVE-2023-42793
description: "Detect CVE-2023-42793"
rules:
  - zones:
    - URI
    transform:
    - lowercase
    match:
      type: endsWith
      value: /rpc2
labels:
  type: exploit
  service: http
  confidence: 3
  spoofable: 0
  behavior: "http:exploit"
  label: "JetBrains Teamcity auth bypass (CVE-2023-42793)"
  classification:
   - cve.CVE-2023-42793
   - attack.T1595
   - attack.T1190
   - cwe.CWE-288
```

To be able to communicate with the appsec component, let's create an bouncer API Key:

```bash
cscli bouncers add appsec_test -k this_is_a_bad_password
```

We can now query our appsec component (we're assuming here that it runs on `127.0.0.1:4242`, see the `listen_addr` parameter of the acquisition config):

```bash
▶ curl -X POST localhost:4242/ -i -H 'x-crowdsec-appsec-ip: 42.42.42.42' -H 'x-crowdsec-appsec-uri: /rpc2' -H 'x-crowdsec-appsec-host: google.com' -H 'x-crowdsec-appsec-verb: POST' -H 'x-crowdsec-appsec-api-key: this_is_a_bad_password'
HTTP/1.1 403 Forbidden
Date: Tue, 05 Dec 2023 11:17:51 GMT
Content-Length: 16
Content-Type: text/plain; charset=utf-8

{"action":"ban"}
```

And we see the alert appearing in `crowdsec.log` :

```
...
INFO[2023-12-05 12:17:52] (test) alert : crowdsecurity/vpatch-CVE-2023-42793 by ip 42.42.42.42
...
```

And in `cscli alerts list` : 

```
╭────┬────────────────┬─────────────────────────────────────┬─────────┬────┬───────────┬───────────────────────────────╮
│ ID │     value      │               reason                │ country │ as │ decisions │          created_at           │
├────┼────────────────┼─────────────────────────────────────┼─────────┼────┼───────────┼───────────────────────────────┤
│ 1  │ Ip:42.42.42.42 │ crowdsecurity/vpatch-CVE-2023-42793 │         │    │           │ 2023-12-05 11:17:51 +0000 UTC │
╰────┴────────────────┴─────────────────────────────────────┴─────────┴────┴───────────┴───────────────────────────────╯

```

