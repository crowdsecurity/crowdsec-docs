---
id: configuration
title: Configuration Files
sidebar_position: 6
---

## Foreword

A few files are often involved when configuring the appsec component:
 - [appsec rules](/appsec/rules_syntax.md) allows you to write a signature to detect and/or block malevolent requests. [You can find more information about the syntax here](/appsec/rules_syntax.md)
 - [acquisition configuration](/data_sources/appsec.md) indicates on which port is the appsec component listening to, and which appsec configuration it will use.
 - appsec configuration tells which rules are loaded in inband (blocking) and out-of-band (non-blocking)
  phases. [it as well allows you to tweak the behavior of the component via the powerfull expr bindings](/appsec/rules_syntax.md)


## Appsec configuration

The appsec configuration is referenced by the acquisition configuration (`appsec_config` or `appsec_config_path`):

> An example appsec configuration
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

(required) the `name` of the appsec configuration, used for both logging purposes and to reference the configuration from acquisition configuration.

### `outofband_rules`

An optional list of rules to be loaded in out of band phase. Out of band rules are non-blocking and are evaluated only once the appsec component answered to the remediation component. Useful for rules that are either expensive, can trigger false positives or are used for other scenarios.

### `inband_rules`

An optional list of rules to be loaded in inband phase. In band rules are blocking and evaluated before answering to the remediation component. Useful for virtual patching, rules with no/low false positives.

### `default_remediation`

An optional remediation for inband rules, defaults to `block`.

### `default_pass_action`

An optional remediation for requests that didn't match any rules (or rules with a pass action). Defaults to nothing.

### `blocked_http_code`

The HTTP code to return to the remediation component when a request should be blocked. Defaults to `403`

### `passed_http_code`

The HTTP code to return to the remediation component when a request should not be blocked. Defaults to `200`

### `on_load`

See the [dedicated doc](/docs/appsec/hooks.md#on_load)

### `pre_eval`

See the [dedicated doc](/docs/appsec/hooks.md#pre_eval)

### `post_eval`

See the [dedicated doc](/docs/appsec/hooks.md#post_eval)

### `on_match`

See the [dedicated doc](/docs/appsec/hooks.md#on_match)

### `inband_options` and `outofband_options`

Subset of options that can be applied to the inband/outofband rules:
 - `disable_body_inspection` : boolean, allows to disable HTTP body inspection
 - `request_body_in_memory_limit` : a number of byes indicating the maximum body size to be loaded in memory
