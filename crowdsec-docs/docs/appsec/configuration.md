---
id: configuration
title: AppSec Component Configuration Files
sidebar_position: 6
---

## Foreword

Configuring the AppSec Component usually requires the use of multiple files:

 - [AppSec rules](/appsec/rules_syntax.md) allow you to write a signature to detect and/or block malevolent requests. [You can find more information about the syntax here](/appsec/rules_syntax.md)
 - [Acquisition configuration](/log_processor/data_sources/appsec.md) indicates which port is the AppSec Component listening on, and which AppSec configuration it will use.
 - AppSec configuration tells which rules are loaded in in-band (blocking) and out-of-band (non-blocking)
  phases. [it as well allows you to tweak the behavior of the component via the powerful expr bindings](/appsec/rules_syntax.md)

## Acquisition configuration

## Default configuration

The Acquisition configuration is usually present directly within `/etc/crowdsec/acquis.d/` or `/etc/crowdsec/acquis.yaml`:

> The default AppSec acquisition configuration
```yaml
appsec_config: crowdsecurity/appsec-default
labels:
  type: appsec
listen_addr: 127.0.0.1:7422
source: appsec
```

## Creating custom configuration

:::info
If you want to add some custom rules or hooks, it is suggested to add a custom `appsec_config`.
Modifying existing `appsec_config` will make it *tainted* and will interfere with future updates.
:::



```yaml title="/etc/crowdsec/acquis.d/appsec.yaml"
appsec_configs:
 - crowdsecurity/appsec-default
 - custom/my_vpatch_rules
labels:
  type: appsec
listen_addr: 127.0.0.1:7422
source: appsec
```

```yaml title="/etc/crowdsec/appsec-configs/my_vpatch_rules.yaml"
name: custom/my_vpatch_rules
default_remediation: ban
inband_rules:
 - custom/custom-vpatch-* 
#on_match:
#...
```

## Appsec configuration

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

Subset of options that can be applied to the in-band/out-of-band rules:
 - `disable_body_inspection` : boolean, allows to disable HTTP body inspection
 - `request_body_in_memory_limit` : a number of byes indicating the maximum body size to be loaded in memory
