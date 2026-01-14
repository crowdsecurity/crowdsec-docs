---
id: configuration_creation_testing
title: Creation & Testing
sidebar_position: 3
---

## AppSec Acquisition

The acquisition file is used to:
- Specify the **address** and **port** where AppSec-enabled remediation components forward requests.
- Specify one or more AppSec configuration files that define which rules to apply and how.

Details can be found in the [AppSec Datasource page](/log_processor/data_sources/appsec.md).

### Defining Multiple AppSec Configurations

Often you will want multiple AppSec configurations to define groups of rules that are handled the same way.

Use the `appsec_configs` parameter to load multiple configurations that work together.

In the following example we have two configurations:
- One with [CrowdSec default AppSec rules ↗️](https://app.crowdsec.net/hub/author/crowdsecurity/appsec-configurations/appsec-default) running in in-band mode
- The other for the [CRS rules ↗️](https://app.crowdsec.net/hub/author/crowdsecurity/collections/appsec-crs) that run in out-of-band mode by default

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

If you want to alter default configuration files, create a new configuration file instead of modifying hub configurations.
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

AppSec configuration files declare **which rules to load** in **in-band** *(blocking)* and/or **out-of-band** *(non-blocking)* mode, define how matches are handled (for example, default remediation), and let you tweak processing via hooks like `on_load`, `pre_eval`, `post_eval`, and `on_match`.

For the full list of keys, see [Configuration Syntax](configuration).

:::info
When loading multiple AppSec configs, _hooks_ and _appsec rules_ are appended, and for conflicting options (for example, `default_remediation`), the last one takes precedence.
:::

### Configuration Processing Order

When multiple AppSec configurations are loaded, they are processed in the order specified in the `appsec_configs` list. For details on how in-band and out-of-band rules work, see the [AppSec Introduction](/appsec/intro.md#inband-rules-and-out-of-band-rules).

### Multi-Config Rule Evaluation

1. All `inband_rules` from all configurations are combined and evaluated together
2. All `outofband_rules` from all configurations are combined and evaluated together
3. Hooks from all configurations are executed in the order the configurations are listed
4. For conflicting configuration options (like `default_remediation`), the last configuration's value takes precedence

## Testing Changes

After updating AppSec configuration files:

1. Reload CrowdSec so it picks up the new configuration.
2. Validate behavior with your usual test traffic, or use the [generic AppSec test rule](https://app.crowdsec.net/hub/author/crowdsecurity/appsec-rules/appsec-generic-test).
3. Inspect results in logs or via `cscli metrics show appsec`.

For more troubleshooting guidance, see [AppSec Troubleshooting](/appsec/troubleshooting.md).
