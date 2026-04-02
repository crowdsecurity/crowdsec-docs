---
id: create_expr
title: Expression
---

Expression-based whitelists let you discard events during parsing using [expr](https://github.com/antonmedv/expr) expressions. This is the most flexible option for whitelisting patterns such as HTTP paths, user agents, status codes, or any mix of parsed fields.

## What this achieves

A **parser whitelist** (enrich stage) drops matching **log lines** before they reach scenarios, so they do not create buckets or alerts. This is usually the cleanest way to cut false positives and resource usage.

:::info

If you need to centrally allowlist **IP/CIDR across all components**, use **AllowLists** (available since CrowdSec `1.6.8`). For event-pattern exceptions (URI/user-agent/etc.), use parser whitelists. See [LAPI AllowLists](/local_api/allowlists.md) for details.

:::

Because this uses data available at parse time, you can do it at the `Parsing Whitelist` level. See the [introduction](/log_processor/whitelist/introduction.md) for OS-specific paths.

## Workflow: From an alert to a parser whitelist

There are two main ways to create an expression-based whitelist:

1. **Starting from an alert**: When you have a false positive alert and want to whitelist the pattern that triggered it
2. **Starting from a log line**: When you know the log line pattern you want to whitelist

### Path 1: Starting from an alert

When you have a false-positive alert, inspect it to extract event details and build a whitelist.

#### Step 1: Identify the alert and extract events

1. List recent alerts:

```bash
sudo cscli alerts list
```

2. Inspect an alert with event details:

```bash
sudo cscli alerts inspect <ALERT_ID> -d
```

The `-d/--details` flag shows events associated with the alert. From the output, note:

- The **log type** (e.g., `nginx`, `apache2`, `sshd`, etc.)
- Any helpful **meta** fields (http path, status, verb, user-agent, etc.)
- The **source** you want to exempt (endpoint, health-check path, internal scanner, etc.)

:::important

In the **Events** section, each key maps to a field in `evt.Meta.*`. For example, `http_path` becomes `evt.Meta.http_path` in your whitelist expression.

:::

<details>
  <summary>Example: Alert inspection output</summary>

```bash
$ cscli alerts inspect 176012 -d

################################################################################################

 - ID           : 176012
 - Date         : 2026-01-07T15:11:08Z
 - Machine      : testMachine
 - Simulation   : false
 - Remediation  : true
 - Reason       : crowdsecurity/http-crawl-non_statics
 - Events Count : 44
 - Scope:Value  : Ip:192.168.1.100
 - Country      : US
 - AS           : EXAMPLE-AS-BLOCK
 - Begin        : 2026-01-07T15:11:05Z
 - End          : 2026-01-07T15:11:07Z
 - UUID         : 0061339c-f070-4859-8f2a-66249c709d73

╭────────────────────────────────────────────────────────────────────────────╮
│ Active Decisions                                                           │
├───────────┬───────────────────┬────────┬────────────┬──────────────────────┤
│     ID    │    scope:value    │ action │ expiration │      created_at      │
├───────────┼───────────────────┼────────┼────────────┼──────────────────────┤
│ 905003939 │ Ip:192.168.1.100  │ ban    │ 23h35m33s  │ 2026-01-07T15:11:08Z │
╰───────────┴───────────────────┴────────┴────────────┴──────────────────────╯

 - Context  :
╭────────────┬────────────╮
│     Key    │    Value   │
├────────────┼────────────┤
│ method     │ GET        │
│ status     │ 404        │
│ target_uri │ /lanz.php  │
│ target_uri │ /xwpg.php  │
│ target_uri │ /slsqc.php │
│ target_uri │ /fs8.php   │
│ target_uri │ /flap.php  │
│ target_uri │ /ws34.php  │
│ user_agent │ -          │
╰────────────┴────────────╯

 - Events  :

- Date: 2026-01-07 15:11:07 +0000 UTC
╭─────────────────┬─────────────────────────────╮
│       Key       │            Value            │
├─────────────────┼─────────────────────────────┤
│ ASNNumber       │ 64512                       │
│ ASNOrg          │ EXAMPLE-AS-BLOCK            │
│ IsInEU          │ false                       │
│ IsoCode         │ US                          │
│ SourceRange     │ 192.168.0.0/16              │
│ datasource_path │ /var/log/nginx/access.log   │
│ datasource_type │ file                        │
│ http_args_len   │ 0                           │
│ http_path       │ /lanz.php                   │
│ http_status     │ 404                         │
│ http_user_agent │ -                           │
│ http_verb       │ GET                         │
│ log_type        │ http_access-log             │
│ service         │ http                        │
│ source_ip       │ 192.168.1.100               │
│ target_fqdn     │ example.com                 │
│ timestamp       │ 2026-01-07T15:11:07Z        │
╰─────────────────┴─────────────────────────────╯

- Date: 2026-01-07 15:11:07 +0000 UTC
╭─────────────────┬─────────────────────────────╮
│       Key       │            Value            │
├─────────────────┼─────────────────────────────┤
│ ASNNumber       │ 64512                       │
│ ASNOrg          │ EXAMPLE-AS-BLOCK            │
│ IsInEU          │ false                       │
│ IsoCode         │ US                          │
│ SourceRange     │ 192.168.0.0/16              │
│ datasource_path │ /var/log/nginx/access.log   │
│ datasource_type │ file                        │
│ http_args_len   │ 0                           │
│ http_path       │ /xwpg.php                   │
│ http_status     │ 404                         │
│ http_user_agent │ -                           │
│ http_verb       │ GET                         │
│ log_type        │ http_access-log             │
│ service         │ http                        │
│ source_ip       │ 192.168.1.100               │
│ target_fqdn     │ example.com                 │
│ timestamp       │ 2026-01-07T15:11:07Z        │
╰─────────────────┴─────────────────────────────╯
```

In this example, the events section lists keys such as `http_path`, `http_status`, `http_verb`, and `source_ip`. Those keys map to `evt.Meta.*` fields you can use in your whitelist expressions. For instance, `http_path` becomes `evt.Meta.http_path`.

</details>

#### Step 2: Pick a representative log line

From the alert details, pick one triggering log line. You will use the raw line with `cscli explain` in the next step.

#### Step 3: Use `cscli explain` to reveal parsed fields

To write a safe whitelist, use the exact field names and values available at parse/enrich time.

Run `cscli explain` against the log line:

```bash
sudo cscli explain \
  --log '<PASTE_ONE_TRIGGERING_LOG_LINE_HERE>' \
  --type <LOG_TYPE> \
  -v
```

`cscli explain -v` shows which parsers ran and what they populated in `evt.Parsed.*`, `evt.Meta.*`, and related fields.

**What to look for** in the explain output:

- The specific fields that uniquely identify the "good" traffic you want to ignore, for example:
  - `evt.Parsed.http_user_agent`
  - `evt.Meta.http_path`
  - `evt.Meta.http_verb`
  - `evt.Meta.http_status`
- Anything stable that will not accidentally exempt real attacks

### Path 2: Starting from a log line

When you already know the log line pattern you want to whitelist (e.g., health check endpoints, monitoring tools), you can use `cscli explain` directly.

#### Step 1: Use `cscli explain` to reveal parsed fields

Use [cscli explain](/cscli/cscli_explain.md) on a log line or a log file.

For example, with a single log line:

```bash
sudo cscli explain \
  --log '5.5.8.5 - - [04/Jan/2020:07:25:02 +0000] "GET /.well-known/acme-challenge/FMuukC2JOJ5HKmLBujjE_BkDo HTTP/1.1" 404 522 "-" "MySecretUserAgent"' \
  --type nginx \
  -v
```

Or with a file:

```bash
sudo cscli explain --file /path/to/logfile --type nginx -v
```

<details>
  <summary>Example output: </summary>

```bash
line: 5.5.8.5 - - [04/Jan/2020:07:25:02 +0000] "GET /.well-known/acme-challenge/FMuukC2JOJ5HKmLBujjE_BkDo HTTP/1.1" 404 522 "-" "MySecretUserAgent"
	├ s00-raw
	|	├ 🟢 crowdsecurity/non-syslog (+5 ~8)
	|		├ update evt.ExpectMode : %!s(int=0) -> 1
	|		├ update evt.Stage :  -> s01-parse
	|		├ update evt.Line.Raw :  -> 5.5.8.5 - - [04/Jan/2020:07:25:02 +0000] "GET /.well-known/acme-challenge/FMuukC2JOJ5HKmLBujjE_BkDo HTTP/1.1" 404 522 "-" "MySecretUserAgent"
	|		├ update evt.Line.Src :  -> /tmp/cscli_explain156736029/cscli_test_tmp.log
	|		├ update evt.Line.Time : 0001-01-01 00:00:00 +0000 UTC -> 2023-07-21 14:05:09.67803335 +0000 UTC
	|		├ create evt.Line.Labels.type : nginx
	|		├ update evt.Line.Process : %!s(bool=false) -> true
	|		├ update evt.Line.Module :  -> file
	|		├ create evt.Parsed.message : 5.5.8.5 - - [04/Jan/2020:07:25:02 +0000] "GET /.well-known/acme-challenge/FMuukC2JOJ5HKmLBujjE_BkDo HTTP/1.1" 404 522 "-" "MySecretUserAgent"
	|		├ create evt.Parsed.program : nginx
	|		├ update evt.Time : 0001-01-01 00:00:00 +0000 UTC -> 2023-07-21 14:05:09.678072613 +0000 UTC
	|		├ create evt.Meta.datasource_path : /tmp/cscli_explain156736029/cscli_test_tmp.log
	|		├ create evt.Meta.datasource_type : file
	├ s01-parse
	|	├ 🟢 crowdsecurity/nginx-logs (+22 ~2)
	|		├ update evt.Stage : s01-parse -> s02-enrich
	|		├ create evt.Parsed.remote_addr : 5.5.8.5
	|		├ create evt.Parsed.request_length : 
	|		├ create evt.Parsed.verb : GET
	|		├ create evt.Parsed.http_user_agent : MySecretUserAgent
	|		├ create evt.Parsed.request : /.well-known/acme-challenge/FMuukC2JOJ5HKmLBujjE_BkDo
	|		├ create evt.Parsed.body_bytes_sent : 522
	|		├ create evt.Parsed.remote_user : -
	|		├ create evt.Parsed.time_local : 04/Jan/2020:07:25:02 +0000
	|		├ create evt.Parsed.http_referer : -
	|		├ create evt.Parsed.request_time : 
	|		├ create evt.Parsed.proxy_alternative_upstream_name : 
	|		├ create evt.Parsed.proxy_upstream_name : 
	|		├ create evt.Parsed.status : 404
	|		├ create evt.Parsed.target_fqdn : 
	|		├ create evt.Parsed.http_version : 1.1
	|		├ update evt.StrTime :  -> 04/Jan/2020:07:25:02 +0000
	|		├ create evt.Meta.http_status : 404
	|		├ create evt.Meta.http_user_agent : MySecretUserAgent
	|		├ create evt.Meta.log_type : http_access-log
	|		├ create evt.Meta.service : http
	|		├ create evt.Meta.http_path : /.well-known/acme-challenge/FMuukC2JOJ5HKmLBujjE_BkDo
	|		├ create evt.Meta.http_verb : GET
	|		├ create evt.Meta.source_ip : 5.5.8.5
	├ s02-enrich
	|	├ 🟢 crowdsecurity/dateparse-enrich (+2 ~2)
	|		├ create evt.Enriched.MarshaledTime : 2020-01-04T07:25:02Z
	|		├ update evt.Time : 2023-07-21 14:05:09.678072613 +0000 UTC -> 2020-01-04 07:25:02 +0000 UTC
	|		├ update evt.MarshaledTime :  -> 2020-01-04T07:25:02Z
	|		├ create evt.Meta.timestamp : 2020-01-04T07:25:02Z
	|	├ 🟢 crowdsecurity/geoip-enrich (+13)
	|		├ create evt.Enriched.ASNumber : 6805
	|		├ create evt.Enriched.Latitude : 51.299300
	|		├ create evt.Enriched.SourceRange : 5.4.0.0/14
	|		├ create evt.Enriched.ASNOrg : Telefonica Germany
	|		├ create evt.Enriched.IsInEU : true
	|		├ create evt.Enriched.IsoCode : DE
	|		├ create evt.Enriched.Longitude : 9.491000
	|		├ create evt.Enriched.ASNNumber : 6805
	|		├ create evt.Meta.ASNOrg : Telefonica Germany
	|		├ create evt.Meta.IsInEU : true
	|		├ create evt.Meta.IsoCode : DE
	|		├ create evt.Meta.ASNNumber : 6805
	|		├ create evt.Meta.SourceRange : 5.4.0.0/14
	|	├ 🟢 crowdsecurity/http-logs (+7)
	|		├ create evt.Parsed.impact_completion : false
	|		├ create evt.Parsed.file_ext : 
	|		├ create evt.Parsed.file_frag : FMuukC2JOJ5HKmLBujjE_BkDo
	|		├ create evt.Parsed.file_name : FMuukC2JOJ5HKmLBujjE_BkDo
	|		├ create evt.Parsed.static_ressource : false
	|		├ create evt.Parsed.file_dir : /.well-known/acme-challenge/
	|		├ create evt.Meta.http_args_len : 0
	|	└ 🟢 my/whitelist (unchanged)
	├-------- parser success 🟢
	├ Scenarios
		├ 🟢 crowdsecurity/http-crawl-non_statics
		└ 🟢 crowdsecurity/http-probing
```

This output shows what data is available from the `s01-parse` stage. Look for fields in `evt.Parsed.*` and `evt.Meta.*` that you can use in your whitelist expression.

</details>

## Create the parser whitelist file

Once you have identified the fields you want to use, create a new YAML file in the appropriate directory. See the [introduction](/log_processor/whitelist/introduction.md) for OS-specific paths.

For example:

```bash
sudo nano /etc/crowdsec/parsers/s02-enrich/zz-whitelist-myapp.yaml
```

### Example 1: Whitelist by user-agent

```yaml
name: "myorg/whitelist-healthcheck-ua"
description: "Ignore our synthetic checks user-agent"
whitelist:
  reason: "synthetic monitoring"
  expression:
    - evt.Parsed.http_user_agent == 'MyHealthcheckBot/1.0'
```

### Example 2: Whitelist a specific endpoint (health check)

Use values you confirmed via `cscli explain`:

```yaml
name: "myorg/whitelist-healthz"
description: "Ignore health checks hitting /healthz"
whitelist:
  reason: "health endpoint"
  expression:
    - evt.Meta.http_path == '/healthz' and evt.Meta.http_verb == 'GET'
```

:::tip

Keep whitelist expressions as narrow as possible (path + verb + optional user-agent) to avoid hiding real attacks.

:::

### Example 3: Whitelist by multiple conditions

You can combine conditions:

```yaml
name: "myorg/whitelist-acme-challenge"
description: "Ignore ACME challenge requests"
whitelist:
  reason: "legitimate certificate renewal"
  expression:
    - evt.Meta.http_path startsWith '/.well-known/acme-challenge/' and evt.Meta.http_verb == 'GET'
```

### Example 4: Whitelist by status code and path

```yaml
name: "myorg/whitelist-monitoring"
description: "Ignore monitoring tool requests"
whitelist:
  reason: "internal monitoring"
  expression:
    - evt.Meta.http_path == '/metrics' and evt.Meta.http_status == '200'
```

### Real-world example: Nextcloud

For a real-world example of expression-based whitelists, see the [Nextcloud whitelist example on the Hub](https://hub.crowdsec.net/author/crowdsecurity/configurations/nextcloud-whitelist), which shows how to whitelist common Nextcloud endpoints and patterns.

## Reload CrowdSec and validate

Reload CrowdSec to apply the new parser whitelist:

```bash
sudo systemctl reload crowdsec
```

Then validate in two ways:

1. **Re-run `cscli explain`** on the same triggering line and confirm it is discarded/whitelisted. CrowdSec logs when lines are discarded because they match a whitelist.

2. **Confirm new decisions are no longer created** for the same pattern/IP:

```bash
sudo cscli decisions list --ip <IP>
```

## Clean up any existing bans

A whitelist prevents *future* triggers, but it does not remove decisions that already exist.

If you need to remove an active decision immediately:

```bash
sudo cscli decisions delete -i <IP>
```

Or delete all decisions for a specific scenario:

```bash
sudo cscli decisions delete --scenario <SCENARIO_NAME>
```

## Verify whitelist is working

You can verify that the whitelist is working by checking the CrowdSec logs:

```bash
tail -f /var/log/crowdsec.log
```

CrowdSec will log when lines are discarded because they match the whitelist expression.

## Finding available fields

The key to creating effective expression whitelists is knowing which fields are available. Use `cscli explain -v` to see the fields available at each stage:

- **`evt.Parsed.*`**: Fields extracted by parsers
- **`evt.Meta.*`**: Metadata fields (often normalized versions of parsed fields)
- **`evt.Enriched.*`**: Fields added by enrichment parsers (geoip, rdns, etc.)

For more information about available fields, see the [expr documentation](/expr/event.md).
