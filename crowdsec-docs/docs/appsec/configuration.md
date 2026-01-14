---
id: configuration
title: Syntax
sidebar_position: 1
---

## CrowdSec AppSec config

AppSec configuration files define which rules are loaded, how they run, and how the WAF responds.

Below is a minimal example followed by the full key reference.

```yaml
name: custom/my-appsec-config
inband_rules:
  - crowdsecurity/base-config
default_remediation: ban
```

Each AppSec configuration file controls how rules are loaded and processed.
You can create custom configuration files in `/etc/crowdsec/appsec-configs/`.

## Configuration File Format

Configuration files share a common structure:

- a [`name`](#name) (required)
- optional rule lists such as [`inband_rules`](#inband_rules) and [`outofband_rules`](#outofband_rules)
- optional behavior keys like [`default_remediation`](#default_remediation) and [`default_pass_action`](#default_pass_action)
- HTTP response codes (for example, [`blocked_http_code`](#blocked_http_code))
- optional performance settings ([`inband_options`](#inband_options), [`outofband_options`](#outofband_options))
- optional hooks ([`on_load`](#on_load), [`pre_eval`](#pre_eval), [`post_eval`](#post_eval), [`on_match`](#on_match))
- optional logging ([`log_level`](#log_level))

```yaml
name: custom/my-appsec-config
inband_rules:
  - crowdsecurity/base-config
outofband_rules:
  - crowdsecurity/crs
default_remediation: ban
default_pass_action: allow
blocked_http_code: 403
passed_http_code: 200
log_level: info
```

## Configuration Structure

### name

> string

Unique identifier for the AppSec configuration, used for logging and referencing.

```yaml
name: custom/my-appsec-config
```

### inband_rules

> array of strings

List of rule patterns to load as in-band rules. See [in-band rule processing](/appsec/intro.md#inband-rule-processing).

```yaml
inband_rules:
  - crowdsecurity/base-config
  - crowdsecurity/vpatch-*
```

### outofband_rules

> array of strings

List of rule patterns to load as out-of-band rules. See [out-of-band rule processing](/appsec/intro.md#out-of-band-rules-processing).

```yaml
outofband_rules:
  - crowdsecurity/crs
  - custom/detection-rules
```

### default_remediation

> string

Default action for in-band rules that match. The special value `allow` disables blocking.

:::info
When using multiple AppSec configs, the last declared one takes precedence for this property.
:::

```yaml
default_remediation: ban
```

### default_pass_action

> string

Action for requests that do not match any rules, or match rules with pass actions.

:::info
When using multiple AppSec configs, the last declared one takes precedence for this property.
:::

```yaml
default_pass_action: allow
```

### blocked_http_code

> integer

HTTP status code returned to the remediation component when a request is blocked.

```yaml
blocked_http_code: 403
```

### passed_http_code

> integer

HTTP status code returned to the remediation component when a request is allowed.

```yaml
passed_http_code: 200
```

### user_blocked_http_code

> integer

HTTP status code returned to the end user when a request is blocked.

```yaml
user_blocked_http_code: 403
```

### user_passed_http_code

> integer

HTTP status code returned to the end user when a request is allowed.

```yaml
user_passed_http_code: 200
```

### inband_options

> object

Performance tuning options for in-band rule processing.

- `disable_body_inspection` (bool): Skip HTTP body inspection.
- `request_body_in_memory_limit` (integer): Max body size in memory (bytes, default: 1048576).

```yaml
inband_options:
  disable_body_inspection: false
  request_body_in_memory_limit: 1048576
```

### outofband_options

> object

Performance tuning options for out-of-band rule processing.

- `disable_body_inspection` (bool): Skip HTTP body inspection.
- `request_body_in_memory_limit` (integer): Max body size in memory (bytes, default: 1048576).

```yaml
outofband_options:
  disable_body_inspection: false
  request_body_in_memory_limit: 1048576
```

### log_level

> string

Logging verbosity for this configuration. Available levels: `debug`, `info`, `warn`, `error`.

```yaml
log_level: info
```

### on_load

> array

Executed when the configuration is loaded. Typically used for global rule changes.

```yaml
on_load:
  - apply:
      - RemoveInBandRuleByName("problematic-rule")
```

### pre_eval

> array

Executed before rule evaluation for each request. Supports conditional logic.

```yaml
pre_eval:
  - filter: IsInBand && req.RemoteAddr == "192.168.1.100"
    apply:
      - RemoveInBandRuleByName("strict-rule")
```

### post_eval

> array

Executed after rule evaluation. Useful for debugging and analysis.

```yaml
post_eval:
  - filter: IsInBand
    apply:
      - DumpRequest().WithBody().ToJSON()
```

### on_match

> array

Executed when rules match. Used to adjust remediation or generate custom alerts.

```yaml
on_match:
  - filter: req.Host == "staging.example.com"
    apply:
      - SetRemediation("allow")
      - CancelAlert()
```

For complete hook documentation, see [AppSec Hooks](/appsec/hooks.md).
