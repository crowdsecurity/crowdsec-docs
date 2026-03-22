---
id: troubleshooting
title: Troubleshooting
sidebar_position: 81
---


## Monitoring with `cscli`

`cscli metrics` exposes basic metrics about the AppSec Component:
- Number of requests processed and blocked by the component/data source
- Number of triggers for each rule

```
Appsec Metrics:
╭───────────────────┬───────────┬─────────╮
│   Appsec Engine   │ Processed │ Blocked │
├───────────────────┼───────────┼─────────┤
│ myAppSecComponent │ 1.30k     │ 312     │
╰───────────────────┴───────────┴─────────╯

Appsec 'myAppSecComponent' Rules Metrics:
╭────────────────────────────────────┬───────────╮
│              Rule ID               │ Triggered │
├────────────────────────────────────┼───────────┤
│ crowdsecurity/vpatch-CVE-2017-9841 │ 38        │
│ crowdsecurity/vpatch-env-access    │ 274       │
╰────────────────────────────────────┴───────────╯

```

Prometheus metrics are more detailed, including analysis time for each request and processing time for in-band and out-of-band rule groups.

They are available in the dedicated [Grafana dashboard](/observability/prometheus.md#exploitation-with-prometheus-server--grafana).

You can also inspect an AppSec rule directly with `cscli appsec-rules inspect <rule_name>` to see the amount of requests that were blocked by the rule.

## Enabling Debug in the AppSec Component

Debugging configuration is cascading in the AppSec Component.

Setting `log_level` to `debug` or `trace` in the acquisition config section or the AppSec config will enable debug logging for the whole AppSec Component. You can also set `debug` to `true` directly in an AppSec rule.


When enabling debug at acquisition or AppSec config level:
- Load-time debug is enabled (for example, rule translation to `SecRule` format).
- Runtime debug is enabled for all rules loaded by the AppSec Component/AppSec config.

When enabling debug directly at the AppSec rule level, only runtime evaluation details for that rule are displayed, such as:

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

## Authenticating with the AppSec Component

:::note
We assume the AppSec engine is running on `127.0.0.1:7422`. See the [installation directives](/appsec/quickstart/general.mdx).
:::

> Create a valid API Key

```bash
cscli bouncers add appsec_test -k this_is_a_bad_password
```

> Send a request to the AppSec Component

```bash
curl -I -X POST localhost:7422/ -i -H 'x-crowdsec-appsec-api-key: this_is_a_bad_password' -H 'x-crowdsec-appsec-ip: 192.168.1.1' -H 'x-crowdsec-appsec-uri: /test' -H 'x-crowdsec-appsec-host: test.com' -H 'x-crowdsec-appsec-verb: GET' 
HTTP/1.1 200 OK
Date: Tue, 05 Dec 2023 19:37:56 GMT
Content-Length: 18
Content-Type: text/plain; charset=utf-8
```

If you receive a `200 OK`, you can authenticate to the AppSec Component. If the component is misconfigured or your API key is invalid, you will receive a `401 Unauthorized`:

```bash
curl -I -X POST localhost:7422/ -i  -H 'x-crowdsec-appsec-api-key: meeh' -H 'x-crowdsec-appsec-ip: 192.168.1.1' -H 'x-crowdsec-appsec-uri: /test' -H 'x-crowdsec-appsec-host: test.com' -H 'x-crowdsec-appsec-verb: GET'          
HTTP/1.1 401 Unauthorized
Date: Tue, 05 Dec 2023 19:38:51 GMT
Content-Length: 0

```


## Ensuring your rule(s) are loaded

CrowdSec shows all installed rules at startup (even if they are not used by any active AppSec config).
Seeing a rule here does not mean it will be used by the AppSec Component; it depends on the AppSec config you are using.

```
...
INFO[2023-12-06 14:58:19] Adding crowdsecurity/vpatch-CVE-2023-40044 to appsec rules 
INFO[2023-12-06 14:58:19] Adding crowdsecurity/vpatch-CVE-2023-42793 to appsec rules 
INFO[2023-12-06 14:58:19] loading acquisition file : ...
```

## Testing a given rule

Create a minimal test environment with:
- An acquisition config that loads your test AppSec config
- An AppSec config that loads the test rule
- The test rule itself

> /etc/crowdsec/acquis.d/test_appsec.yaml 
```bash
mkdir -p /etc/crowdsec/acquis.d/
cat > /etc/crowdsec/acquis.d/test_appsec.yaml <<EOF
name: test_appsec
listen_addr: 127.0.0.1:4243
appsec_configs:
 - crowdsecurity/test-appsec
source: appsec
labels:
  type: appsec
EOF
```

> /etc/crowdsec/appsec-config/test_appsec_config.yaml
```bash
mkdir -p /etc/crowdsec/appsec-configs/
cat > /etc/crowdsec/appsec-configs/test_appsec_config.yaml <<EOF
name: crowdsecurity/test-appsec
default_remediation: ban
#log_level: debug
inband_rules:
 - crowdsecurity/test-rule
EOF
```

> /etc/crowdsec/appsec-rules/test-rule.yaml
```bash
mkdir -p /etc/crowdsec/appsec-rules/
cat > /etc/crowdsec/appsec-rules/test-rule.yaml <<EOF
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
EOF
```

When starting crowdsec, you will see the following lines in the logs:

```
time="2023-12-20 13:39:29" level=info msg="loading inband rule crowdsecurity/test-rule" component=appsec_config name=crowdsecurity/test-appsec type=appsec
time="2023-12-20 13:39:29" level=info msg="Loaded 1 inband rules" component=appsec_config name=crowdsecurity/test-appsec type=appsec
time="2023-12-20 13:39:29" level=info msg="Created 1 appsec runners" name=test_appsec type=appsec
time="2023-12-20 13:39:29" level=info msg="Starting processing data"
time="2023-12-20 13:39:29" level=info msg="1 appsec runner to start" name=test_appsec type=appsec
time="2023-12-20 13:39:29" level=info msg="Starting Appsec server on 127.0.0.1:4243/" name=test_appsec type=appsec
time="2023-12-20 13:39:29" level=info msg="Appsec Runner ready to process event" name=test_appsec runner_uuid=846db2c6-4089-487e-a40e-6c778e5e125b type=appsec
```


## Interacting with the AppSec Component

To test that the AppSec Component is working, send requests directly to it. Keep in mind:
- You need a valid remediation component API key
- The AppSec Component expects specific values in headers


This example tests detection for CVE-2023-42793, part of the [virtual patching collection](https://app.crowdsec.net/hub/author/crowdsecurity/collections/appsec-virtual-patching). Make sure the collection is installed (`cscli appsec-rules list`).
[This rule](https://app.crowdsec.net/hub/author/crowdsecurity/appsec-rules/vpatch-CVE-2023-42793) detects requests to a URI ending with `/rpc2`:

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

To communicate with the AppSec Component, create a bouncer API key:

```bash
cscli bouncers add appsec_test -k this_is_a_bad_password
```

You can now query the AppSec Component (assuming the default `127.0.0.1:7422`; see the `listen_addr` setting in your acquisition config):

```bash
▶ curl -X POST localhost:7422/ -i -H 'x-crowdsec-appsec-ip: 192.168.1.1' -H 'x-crowdsec-appsec-uri: /rpc2' -H 'x-crowdsec-appsec-host: google.com' -H 'x-crowdsec-appsec-verb: POST' -H 'x-crowdsec-appsec-api-key: this_is_a_bad_password'
HTTP/1.1 403 Forbidden
Date: Tue, 05 Dec 2023 11:17:51 GMT
Content-Length: 16
Content-Type: text/plain; charset=utf-8

{"action":"ban"}
```

The alert should appear in `crowdsec.log`:

```
...
INFO[2023-12-05 12:17:52] (test) alert : crowdsecurity/vpatch-CVE-2023-42793 by ip 192.168.1.1
...
```

And in `cscli alerts list`:

```
╭────┬────────────────┬─────────────────────────────────────┬─────────┬────┬───────────┬───────────────────────────────╮
│ ID │     value      │               reason                │ country │ as │ decisions │          created_at           │
├────┼────────────────┼─────────────────────────────────────┼─────────┼────┼───────────┼───────────────────────────────┤
│ 1  │ Ip:192.168.1.1 │ crowdsecurity/vpatch-CVE-2023-42793 │         │    │           │ 2023-12-05 11:17:51 +0000 UTC │
╰────┴────────────────┴─────────────────────────────────────┴─────────┴────┴───────────┴───────────────────────────────╯

```
