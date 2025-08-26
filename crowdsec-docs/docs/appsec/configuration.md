---
id: configuration
title: AppSec Configuration Files
sidebar_position: 6
---

## Overview

This page explains the interraction between various files involved in AppSec configuration and the details about the processing pipeline AppSec request processing.

**Prerequisites**: 
- Familiarity with [AppSec concepts](/appsec/intro.md)
- Basic AppSec setup completed (see Getting Started guides)

The AppSec Component configuration consists of three main parts:

 - **[Acquisition configuration](/log_processor/data_sources/appsec.md)**: Defines which port the AppSec Component listens on and which AppSec configurations files to load <!-- Fix linked page to ie. speak about appsec_configs-->
 - **AppSec configurations**: Define which rules are loaded and how they behave, along with [hooks](/appsec/hooks.md) for runtime customization
 - **[AppSec rules](/appsec/rules_syntax.md)**: The actual detection signatures that identify and block malicious requests

## AppSec Acquisition

The goals of the acquisition file are:
- To specify the **address** and **port** where the AppSec-enabled Remediation Component(s) will forward the requests to.
- And specify one or more [AppSec configuration files](#appsec-configuration) to use as definition of what rules to apply and how. 

Details can be found in the [AppSec Datasource page](/log_processor/data_sources/apps).

### Defining Multiple AppSec Configurations

Often you will want to activate multiple AppSec configuration defining groups of rules that will be handled the same way.  

Use the `appsec_configs` *(with an S)* parameter to load multiple configurations that work together.  

In the following example we have two configurations:
- One with [CrowdSec default AppSec rules ↗️](https://app.crowdsec.net/hub/author/crowdsecurity/appsec-configurations/appsec-default) running in inband mode 
- The other for the [CRS rules ↗️](https://app.crowdsec.net/hub/author/crowdsecurity/collections/appsec-crs) that by default run in out of band mode.

```yaml title="/etc/crowdsec/acquis.d/appsec.yaml"
appsec_configs:
  - crowdsecurity/appsec-default    # In-band virtual patching
  - crowdsecurity/crs               # Out-of-band detection based on ModSec CRS - from crowdsecurity/appsec-crs collection
labels:
  type: appsec
listen_addr: 127.0.0.1:7422
source: appsec
```

:::info
CrowdSec AppSec collections are available on [CrowdSec Hub ↗️](https://app.crowdsec.net/hub/collections?filters=search%3Dappsec) and kept up to date.  

For example the CRS collection: `sudo cscli collections install crowdsecurity/appsec-crs`.
This collection installs OWASP CRS in out-of-band and adds a scenario to ban IPs triggering multiple rules.
:::

### Using Custom Configurations

If you want to alter the default configuration files we recommend creating a new configuration files instead of modifying existing hub configurations.  
Modifying hub configurations will make them *tainted* and prevent automatic updates.

For example, if you want to change the default vpatch rules config, create your own and use it instead in the acquisition file.  

```yaml title="/etc/crowdsec/acquis.d/appsec.yaml"
appsec_configs:
  - crowdsecurity/appsec-default
  - custom/my_vpatch_rules
labels:
  type: appsec
listen_addr: 127.0.0.1:7422
source: appsec
```

A custom configuration file could look like this:

```yaml title="/etc/crowdsec/appsec-configs/my_vpatch_rules.yaml"
name: custom/my_vpatch_rules
default_remediation: ban
inband_rules:
  - custom/custom-vpatch-*
# Add custom hooks as needed
```

## AppSec Configuration Files

AppSec configuration files declare **which rules to load** in the **in-band** *(blocking)* and/or **out-of-band** *(non-blocking)*, define how matches are handled (e.g., default remediation), and let you tweak processing via hooks like `on_load`, `pre_eval`, `post_eval`, and `on_match`.

For details, jump to the [Configuration properties list](#appendix-appsec-configuration-properties)

:::info
When loading multiple AppSec configs, _hooks_ and _appsec rules_ are appended, and for conflicting options (e.g., `default_remediation`), the last one takes precedence.
:::

### Configuration Processing Order

When multiple AppSec configurations are loaded, they are processed in the order specified in the `appsec_configs` list. For details on how in-band and out-of-band rules work, see the [AppSec Introduction](/appsec/intro.md#inband-rules-and-out-of-band-rules).

### Multi-Config Rule Evaluation

1. All `inband_rules` from all configurations are combined and evaluated together
2. All `outofband_rules` from all configurations are combined and evaluated together  
3. Hooks from all configurations are executed in the order the configurations are listed
4. For conflicting configuration options (like `default_remediation`), the last configuration's value takes precedence

## AppSec Configuration Reference

Each AppSec configuration file defines how rules are loaded and processed.
You can create custom configuration files in the following folder: `/etc/crowdsec/appsec-configs/`  

Here's the complete reference of available directives:

### Core Configuration Directives

#### `name` (required)
Unique identifier for the AppSec configuration, used for logging and referencing.

```yaml
name: custom/my-appsec-config
```

#### `inband_rules` (optional)
List of rule patterns to load as in-band rules. See [in-band rule processing](/appsec/intro.md#inband-rule-processing) for details.

```yaml
inband_rules:
  - crowdsecurity/base-config
  - crowdsecurity/vpatch-*
  - custom/critical-patches
```

#### `outofband_rules` (optional)
List of rule patterns to load as out-of-band rules. See [out-of-band rule processing](/appsec/intro.md#out-of-band-rules-processing) for details.

```yaml
outofband_rules:
  - crowdsecurity/crs
  - custom/detection-rules
```

### Remediation Configuration

#### `default_remediation` (optional, default: "ban")
Default action for in-band rules that match. Special value `allow` prevents blocking.

```yaml
default_remediation: ban      # or "allow", "captcha", etc.
```

:::info
When using multiple AppSec configs the last declared one takes precedence for this property
:::

#### `default_pass_action` (optional, default: "allow")
Action for requests that don't match any rules or match rules with pass action.

```yaml
default_pass_action: allow    # or any custom value
```

:::info
When using multiple AppSec configs the last declared one takes precedence for this property
:::

### HTTP Response Codes

#### `blocked_http_code` (optional, default: 403)
HTTP status code returned to the remediation component for blocked requests.

#### `passed_http_code` (optional, default: 200)
HTTP status code returned to the remediation component for allowed requests.

#### `user_blocked_http_code` (optional, default: 403)
HTTP status code returned to the end user for blocked requests.

#### `user_passed_http_code` (optional, default: 200)
HTTP status code returned to the end user for allowed requests.

```yaml
blocked_http_code: 403
passed_http_code: 200
user_blocked_http_code: 403
user_passed_http_code: 200
```

### Performance and Processing Options

#### `inband_options` and `outofband_options`
Performance tuning options for rule processing:

```yaml
inband_options:
  disable_body_inspection: false           # Skip HTTP body inspection
  request_body_in_memory_limit: 1048576   # Max body size in memory (bytes)
  
outofband_options:
  disable_body_inspection: false
  request_body_in_memory_limit: 1048576
```

**`disable_body_inspection`**: Set to `true` to skip HTTP body analysis for performance.
**`request_body_in_memory_limit`**: Maximum request body size to load into memory (default: 1MB). Larger bodies are processed differently.

#### `log_level` (optional)
Logging verbosity for this configuration. Available levels: `debug`, `info`, `warn`, `error`.

```yaml
log_level: info    # Use "debug" for troubleshooting
```

### Hook Configuration

AppSec configurations support four types of hooks for custom behavior:

#### `on_load`
Executed when the configuration is loaded. Typically used for global rule modifications.

```yaml
on_load:
  - apply:
      - RemoveInBandRuleByName("problematic-rule")
```

#### `pre_eval`
Executed before rule evaluation for each request. Supports conditional logic.

```yaml
pre_eval:
  - filter: IsInBand && req.RemoteAddr == "192.168.1.100"
    apply:
      - RemoveInBandRuleByName("strict-rule")
```

#### `post_eval`
Executed after rule evaluation. Useful for debugging and analysis.

```yaml
post_eval:
  - filter: IsInBand
    apply:
      - DumpRequest().WithBody().ToJSON()
```

#### `on_match`
Executed when rules match. Used to modify remediation or generate custom alerts.

```yaml
on_match:
  - filter: req.URL.Host == "staging.example.com"
    apply:
      - SetRemediation("allow")
      - CancelAlert()
```

For complete hook documentation, see [AppSec Hooks](/appsec/hooks.md).

## Rule Management

### Disabling Rules at Runtime

You can disable rules at runtime, either globally (for all requests) or based on specific conditions (source IP, URI, ...).

You can disable rules by:
 - Name with `RemoveInBandRuleByName`: For CrowdSec rules (name as seen in `cscli appsec-rules list`)
 - ID with `RemoveInBandRuleByID`: For seclang/ModSecurity rules by numeric ID
 - Tag with `RemoveInBandRuleByTag`: For seclang/ModSecurity rules by tag

The same functions exist for out-of-band rules, prefixed with `RemoveOutBandRuleBy...`

To disable a rule, create a new AppSec config to avoid tainting the configuration from the hub (or update your existing custom configuration).

```yaml title="/etc/crowdsec/appsec-configs/my_config.yaml"
name: custom/my_config
on_load:
 - apply:
    - RemoveInBandRuleByName("crowdsecurity/vpatch-env-access")
pre_eval:
 - filter: IsInBand == true && req.URL.Path startsWith "/bar/"
   apply:
    - RemoveInBandRuleByName("crowdsecurity/generic-wordpress-uploads-php")
```

This example uses [hooks](/docs/appsec/hooks.md) to modify the configuration in 2 places:
 - `on_load`: Expressions here will be applied when CrowdSec loads the configuration, effectively disabling the rule `crowdsecurity/vpatch-env-access` globally.
 - `pre_eval`: Expressions here will be applied only if the provided filter matches. In this example, we are disabling the rule `crowdsecurity/generic-wordpress-uploads-php` only if the request URI starts with `/blog/` and if we are currently processing in-band rules.

You can also disable native (seclang) rules by providing their ID with the `RemoveInBandRuleByID` helper. See the [hooks](appsec/hooks.md) documentation for a list of available helpers.

Also note that we are not loading any rules in our custom config: the rules are loaded by the `crowdsecurity/appsec-default` config, and we are just modifying the runtime behavior with this config.

Finally, add your new config to the acquisition configuration:

```yaml title="/etc/crowdsec/acquis.d/appsec.yaml"
appsec_configs:
  - crowdsecurity/appsec-default
  - custom/my_config
labels:
  type: appsec
listen_addr: 127.0.0.1:7422
source: appsec
```

## Allowlisting

### Fully allow a specific IP or range

If you want to ignore all rule matches for a specific IP or range, you can use a [centralized allowlist](local_api/allowlists.md).

Rules will be processed as usual, but the request will not be blocked even if a rule matches.

### Disable specific rules for a specific IP/range

If you want to disable rule(s) for a specific IP (or range), you will need to use the `pre_eval` hook (refer to the section above for more details):

```yaml title="/etc/crowdsec/appsec-configs/my_config.yaml"
name: custom/my_config
pre_eval:
 - filter: req.RemoteAddr == "1.2.3.4"
   apply:
    - RemoveInBandRuleByName("crowdsecurity/generic-wordpress-uploads-php")
```

### Disable appsec for a specific FQDN

If your reverse-proxy forwards all requests to CrowdSec regardless of the FQDN, you can disable AppSec for specific domains with a custom AppSec config (the request will always be allowed):

```yaml title="/etc/crowdsec/appsec-configs/my_config.yaml"
name: custom/my_config
on_match:
 - filter: req.URL.Host == "foo.com"
   apply:
    - CancelEvent()
    - CancelAlert()
    - SetRemediation("allow")
```

With this config, the rules will still be evaluated, but if a rule matches no alert or event will be generated, and the remediation will be set to `allow`(ie, instruct the bouncer to let the request through).

## Appendix: Appsec configuration properties

The AppSec configuration is referenced by the acquisition configuration (`appsec_config`, `appsec_configs` or `appsec_config_path`):

> An example AppSec configuration
```yaml
name: crowdsecurity/virtual-patching
default_remediation: ban
#log_level: debug
inband_rules:
 - crowdsecurity/base-config 
 - crowdsecurity/vpatch-*
# inband_options:
#  disable_body_inspection: true
```

### `name`

(required) the `name` of the AppSec configuration, used for both logging purposes and to reference the configuration from acquisition configuration.

### `outofband_rules`

A supplementary list of rules can be loaded during the out-of-band phase. These out-of-band rules are non-blocking and are assessed only after the AppSec Component has responded to the remediation component. This approach is beneficial for rules that may be costly to execute, have a higher likelihood of generating false positives, or are applicable in specific scenarios.

### `inband_rules`

An optional list of rules to be loaded in in-band phase. In band rules are blocking and evaluated before answering the remediation component. Useful for virtual patching, rules with no/low false positives.

### `default_remediation`

An optional remediation for in-band rules, defaults to `ban`. If set to `allow`, remediation component won't block the request (even if it matched rules). Any other value (including `captcha`) is passed as-is back to the remediation component.

:::info
When using multiple AppSec configs the last declared one takes precedence for this property
:::

### `default_pass_action`

An optional remediation for requests that didn't match any rules (or rules with a pass action). Defaults to `allow`. Any other value will be passed as-is to the remediation component.

:::info
When using multiple AppSec configs the last declared one takes precedence for this property
:::

### `blocked_http_code`

The HTTP code to return to the remediation component when a request should be blocked. Defaults to `403`

### `passed_http_code`

The HTTP code to return to the remediation component when a request should not be blocked. Defaults to `200`

### `user_blocked_http_code`

The HTTP code to return to the final client when a request should be blocked. Defaults to `403`

### `user_passed_http_code` 

The HTTP code to return to the final client when a request should not be blocked. Defaults to `200`

### `on_load`

See the [dedicated doc](/docs/appsec/hooks.md#on_load)

### `pre_eval`

See the [dedicated doc](/docs/appsec/hooks.md#pre_eval)

### `post_eval`

See the [dedicated doc](/docs/appsec/hooks.md#post_eval)

### `on_match`

See the [dedicated doc](/docs/appsec/hooks.md#on_match)

### `inband_options` and `outofband_options`

Subset of options that can be applied to the in-band/out-of-band rules:
 - `disable_body_inspection` : boolean, allows to disable HTTP body inspection
 - `request_body_in_memory_limit` : a number of byes indicating the maximum body size to be loaded in memory
