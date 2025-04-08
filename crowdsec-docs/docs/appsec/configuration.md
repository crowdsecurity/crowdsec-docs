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


If you want to add some custom rules or hooks, it is suggested to add a custom `appsec_config`.
Modifying existing `appsec_config` will make it *tainted* and will interfere with future updates.

```yaml title="/etc/crowdsec/acquis.d/appsec.yaml"
appsec_configs:
 - crowdsecurity/appsec-default
 - custom/my_vpatch_rules
labels:
  type: appsec
listen_addr: 127.0.0.1:7422
source: appsec
```

:::info
When loading several app sec configs, _hooks_ and _appsec rules_ are appended, and for conflicting options (e.g., `default_remediation`), the last one takes precedence.
:::


```yaml title="/etc/crowdsec/appsec-configs/my_vpatch_rules.yaml"
name: custom/my_vpatch_rules
default_remediation: ban
inband_rules:
 - custom/custom-vpatch-* 
#on_match:
#...
```

## Disabling rules at runtime

Even though we try to provide rules without false positives, sometimes a virtual patching rule can block legitimate requests on a website.

You can disable rules at runtime, either globally (for all requests) or based on specific conditions (source IP, URI, ...).

To disable a rule, we'll first create a new `appsec-config` to avoid tainting the configuration from the hub (if you are already using a custom configuration, you can update this one instead).

```yaml title="/etc/crowdsec/appsec-configs/my_config.yaml"
name: custom/my_config
on_load:
 - apply:
    - RemoveInBandRuleByName("crowdsecurity/vpatch-env-access")
pre_eval:
 - filter: IsInBand == true && req.URL.Path startsWith "/bar/"
   apply:
    - RemoveInBandRuleByName("generic-wordpress-uploads-php")
```

We are using the [hooks](/docs/appsec/hooks.md) provided by the appsec to modify the configuration in 2 places:
 - `on_load`: Expressions here will be applied when crowdsec loads the configuration, effectively disabling the rule `crowdsecurity/vpatch-env-access` globally.
 - `pre_eval`: Expressions here will be applied only if the provided filter matches. In this example, we are disabling the rule `crowdsecurity/generic-wordpress-uploads-php` only if the request URI starts with `/blog/` and if we are currently processing in-band rules.

You can also disable native (seclang) rules by providing their ID with the `RemoveInBandRuleByID` helper. See the [hooks](/docs/appsec/hooks.md) documentation for a list of available helpers.

Also note that we are not loading any rules in our custom config: the rules are loaded by the `crowdsecurity/appsec-default` config, and we are just modifying the runtime behavior with this config.

Finally, we need to tell crowdsec to load our new config:

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
    - RemoveInBandRuleByName("generic-wordpress-uploads-php")
```

### Disable appsec for a specific FQDN

If your reverse-proxy forwards all requests to crowdsec, regardless of the FQDN, you can disable the appsec for specific domain with a custom appsec-config:

```yaml title="/etc/crowdsec/appsec-configs/my_config.yaml"
name: custom/my_config
pre_eval:
 - filter: req.URL.Host == "foo.com"
   apply:
    - CancelEvent()
    - CancelAlert()
    - SetRemediation("allow")
```

With this config, the rules will still be evaluated, but no alert or event will be generated, and if a rule matches, the remediation will be set to `allow`(ie, instruct the bouncer to let the request through).

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
