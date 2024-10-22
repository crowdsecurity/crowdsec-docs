---
id: configuration
title: Configuration Files
sidebar_position: 6
---

## Foreword

Configuring the AppSec Component usually requires the use of multiple files:

 - [AppSec rules](/appsec/rules_syntax.md) allow you to write a signature to detect and/or block malevolent requests. [You can find more information about the syntax here](/appsec/rules_syntax.md)
 - [acquisition configuration](/data_sources/appsec.md) indicates which port is the AppSec Component listening on, and which AppSec configuration it will use.
 - AppSec configuration tells which rules are loaded in inband (blocking) and out-of-band (non-blocking)
  phases. [it as well allows you to tweak the behavior of the component via the powerful expr bindings](/appsec/rules_syntax.md)


## Appsec configuration

The AppSec configuration is referenced by the acquisition configuration (`appsec_config` or `appsec_config_path`):

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

An optional list of rules to be loaded in inband phase. In band rules are blocking and evaluated before answering the remediation component. Useful for virtual patching, rules with no/low false positives.

### `default_remediation`

An optional remediation for inband rules, defaults to `ban`. If set to `allow`, remediation component won't block the request (even if it matched rules). Any other value (including `captcha`) is passed as-is back to the remediation component.

### `default_pass_action`

An optional remediation for requests that didn't match any rules (or rules with a pass action). Defaults to `allow`. Any other value will be passed as-is to the remediation component.

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

Subset of options that can be applied to the inband/outofband rules:
 - `disable_body_inspection` : boolean, allows to disable HTTP body inspection
 - `request_body_in_memory_limit` : a number of byes indicating the maximum body size to be loaded in memory
