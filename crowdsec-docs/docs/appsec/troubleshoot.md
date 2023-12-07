---
id: troubleshoot
title: Troubleshooting
sidebar_position: 6
---

## Debugging AppSec Component

Debugging configuration is cascading in the AppSec Component.

Setting `log_level` to `debug` or `trace` in the acquisition config section or in the appsec config will enable debug logging for the whole appsec component. You can as well set `debug` to `true` directly in a appsec rule.


When enabling debug at acquisition or appsec config level:
 - load time debug will be enabled, such as information regarding the translation of the rule to `SecRule` format.
 - runtime debug will be enabled for all the rules loaded by the appsec component / appsec config.

When enabling debug directly at the appsec rule level, only runtime evaluation information of the rule will be displayed, such as:

```
DEBU[2023-12-06 15:40:26] Evaluating rule                               band=inband name=appseclol rule_id=2145145579 type=appsec uuid=adc5ffc4-6080-432c-af93-7c76c79afc25
DEBU[2023-12-06 15:40:26] Expanding arguments for rule                  band=inband name=appseclol rule_id=2145145579 type=appsec uuid=adc5ffc4-6080-432c-af93-7c76c79afc25 variable=REQUEST_URI
DEBU[2023-12-06 15:40:26] Transforming argument for rule                band=inband name=appseclol rule_id=2145145579 type=appsec uuid=adc5ffc4-6080-432c-af93-7c76c79afc25
DEBU[2023-12-06 15:40:26] Arguments transformed for rule                band=inband name=appseclol rule_id=2145145579 type=appsec uuid=adc5ffc4-6080-432c-af93-7c76c79afc25
DEBU[2023-12-06 15:40:26] Matching rule                                 band=inband key= name=appseclol rule_id=2145145579 type=appsec uuid=adc5ffc4-6080-432c-af93-7c76c79afc25 variable_name=REQUEST_URI
DEBU[2023-12-06 15:40:26] Evaluating operator: MATCH                    arg=/rpc2 band=inband name=appseclol operator_data=/rpc2 operator_function=@endsWith rule_id=2145145579 type=appsec uuid=adc5ffc4-6080-432c-af93-7c76c79afc25
DEBU[2023-12-06 15:40:26] Executing disruptive action for rule          action=deny band=inband name=appseclol rule_id=2145145579 type=appsec uuid=adc5ffc4-6080-432c-af93-7c76c79afc25
DEBU[2023-12-06 15:40:26] Rule matched                                  band=inband name=appseclol rule_id=2145145579 type=appsec uuid=adc5ffc4-6080-432c-af93-7c76c79afc25
DEBU[2023-12-06 15:40:26] Finish evaluating rule                        band=inband name=appseclol rule_id=2145145579 type=appsec uuid=adc5ffc4-6080-432c-af93-7c76c79afc25
```

## Ensuring the AppSec Component is running

For the Application Security Component to be running, you need to have:
 - Acquisition : Acquisition configuration decides on which interface and port is the appsec component running
 - AppSec Config : appsec config decides which rules are loaded in inband and outofband sections
 - AppSec Rules : the appsec rules referenced in the appsec config must be installed

Appsec config & rules are obtained by installing the relevant appsec collection, for example `crowdsecurity/appsec-virtual-patching` (`cscli collections install crowdsecurity/appsec-virtual-patching`)

> Example Acquisition config

```yaml
name: appsec-test
listen_addr: 127.0.0.1:4242
appsec_config: crowdsecurity/virtual-patching
source: appsec
labels:
  type: appsec
```

> Example AppSec config

```yaml
name: crowdsecurity/virtual-patching
default_remediation: ban
#log_level: debug
inband_rules:
 - crowdsecurity/vpatch-CVE-2023-40044
 - crowdsecurity/vpatch-CVE-2023-42793
# inband_options:
#  disable_body_inspection: true
```

> Eample AppSec rule

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

If the appsec component is running, you will see the following in the startup logs:

> rules loading

```
...
INFO[2023-12-06 15:06:36] Loaded 0 outofband rules                      component=appsec_config name=crowdsecurity/virtual-patching type=appsec
INFO[2023-12-06 15:06:36] loading inband rule crowdsecurity/vpatch-CVE-2023-40044  component=appsec_config name=crowdsecurity/virtual-patching type=appsec
INFO[2023-12-06 15:06:36] loading inband rule crowdsecurity/vpatch-CVE-2023-42793  component=appsec_config name=crowdsecurity/virtual-patching type=appsec
...
```

> appsec component runner starting up

```
INFO[2023-12-06 15:06:36] 1 appsec runner to start                      name=appseclol type=appsec
INFO[2023-12-06 15:06:36] Starting Appsec server on 127.0.0.1:4242/     name=appseclol type=appsec
INFO[2023-12-06 15:06:36] Appsec Runner ready to process event          name=appseclol type=appsec uuid=077f5139-3b4a-4c74-80df-8dc8084b3c5b
```

## Authenticating with the AppSec component

:::note
We are assuming the appsec engine is running on `127.0.0.1:4242`. See [installation directives](/docs/next/appsec/install)
:::

> Create a valid API Key

```bash
cscli bouncers add appsec_test -k this_is_a_bad_password
```

> Emit a request to the AppSec component

```bash
curl -I -X POST localhost:4242/ -i -H 'x-crowdsec-appsec-api-key: this_is_a_bad_password' -H 'x-crowdsec-appsec-ip: 42.42.42.42' -H 'x-crowdsec-appsec-uri: /test' -H 'x-crowdsec-appsec-host: test.com' -H 'x-crowdsec-appsec-verb: GET' 
HTTP/1.1 200 OK
Date: Tue, 05 Dec 2023 19:37:56 GMT
Content-Length: 18
Content-Type: text/plain; charset=utf-8
```

If you receive a `200 OK`, you can authenticate to the appsec component. If the component is misconfigured or your API key is invalid, you will receive a `401 Unauthorized`:

```bash
curl -I -X POST localhost:4242/ -i  -H 'x-crowdsec-appsec-api-key: meeh' -H 'x-crowdsec-appsec-ip: 42.42.42.42' -H 'x-crowdsec-appsec-uri: /test' -H 'x-crowdsec-appsec-host: test.com' -H 'x-crowdsec-appsec-verb: GET'          
HTTP/1.1 401 Unauthorized
Date: Tue, 05 Dec 2023 19:38:51 GMT
Content-Length: 0

```


## Ensuring your rule(s) are loaded

When starting crowdsec is AppSec component enabled, the list of loaded rules is displayed in logs:

```
...
INFO[2023-12-06 14:58:19] Adding crowdsecurity/vpatch-CVE-2023-40044 to appsec rules 
INFO[2023-12-06 14:58:19] Adding crowdsecurity/vpatch-CVE-2023-42793 to appsec rules 
INFO[2023-12-06 14:58:19] loading acquisition file : ...
```

## Testing a given rule

We can create a skeleton environment like this:

> /etc/crowdsec/acquis.yaml
```yaml
name: test_appsec
listen_addr: 127.0.0.1:4242
appsec_config: crowdsecurity/test-appsec
source: appsec
labels:
  type: appsec
```

> /etc/crowdsec/appsec-config/test-appsec.yaml
```yaml
name: crowdsecurity/test-appsec
default_remediation: ban
#log_level: debug
inband_rules:
 - crowdsecurity/test-rule
```

> /etc/crowdsec/appsec-rules/test-rule.yaml
```yaml
name: crowdsecurity/test-rule
description: "Detect test pattern"
rules:
  - zones:
    - URI
    transform:
    - lowercase
    match:
      type: contains
      value: this-is-a-appsec-rule-test
```




## Interacting with the AppSec Component

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
