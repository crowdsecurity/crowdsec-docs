---
id: configuration_rule_management
title: Allowlisting and Rule Overrides
sidebar_position: 3
---

## Disabling Rules at Runtime

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

This example uses [hooks](/appsec/hooks.md) to modify the configuration in 2 places:
 - `on_load`: Expressions here will be applied when CrowdSec loads the configuration, effectively disabling the rule `crowdsecurity/vpatch-env-access` globally.
 - `pre_eval`: Expressions here will be applied only if the provided filter matches. In this example, we are disabling the rule `crowdsecurity/generic-wordpress-uploads-php` only if the request URI starts with `/blog/` and if we are currently processing in-band rules.

You can also disable native (seclang) rules by providing their ID with the `RemoveInBandRuleByID` helper. See the [hooks](/appsec/hooks.md) documentation for a list of available helpers.

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

If you want to ignore all rule matches for a specific IP or range, you can use a [centralized allowlist](/local_api/allowlists.md).

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
 - filter: req.Host == "foo.com"
   apply:
    - CancelEvent()
    - CancelAlert()
    - SetRemediation("allow")
```

With this config, the rules will still be evaluated, but if a rule matches no alert or event will be generated, and the remediation will be set to `allow` (i.e., instruct the bouncer to let the request through).
