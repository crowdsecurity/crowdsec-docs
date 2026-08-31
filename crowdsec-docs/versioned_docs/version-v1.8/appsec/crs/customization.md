---
id: crs_config
title: Customization
sidebar_position: 2
---

In most cases, CRS will need some custom configuration to work properly without false positives on any moderatly complex application.

In order to update the behaviour of the CRS, we will be using the plugin system to update the configuration without modifying any existing file.

To get an overview of the plugin system, you can refer to the [dedicated documentation](/appsec/crs/plugin_support.md).

:::warning

CRS configuration applies globally.

If you serve multiple apps and want to change behaviour only on specific routes or FQDN, you will need to filter for those in the rules themselves.

:::

## Examples

All the rules shown in the examples need to be put in a file `<name>-before.conf` in the directory `/var/lib/crowdsec/data/crs-plugins/<plugin-name>/`

### Allow the PUT method

As a simple customization, you can create a small CRS plugin that adds PUT to the list of allowed HTTP methods.

```conf title="/var/lib/crowdsec/data/crs-plugins/my-custom-plugin/custom-plugin-before.conf"

SecRule &TX:allowed_methods "@eq 0" \
    "id:9900000,\
    phase:1,\
    pass,\
    nolog,\
    setvar:'tx.allowed_methods=GET HEAD POST OPTIONS PUT'"
```

Restart CrowdSec to load the plugin and apply the new method list.

### Allow the PUT method only on blog.mydomain.com

```conf title="/var/lib/crowdsec/data/crs-plugins/my-custom-plugin/custom-plugin-before.conf"
SecRule SERVER_NAME "@streq blog.mydomain.com" "phase:1,chain"
    SecRule &TX:allowed_methods "@eq 0" \
    "id:9900000,\
    phase:1,\
    pass,\
    nolog,\
    setvar:'tx.allowed_methods=GET HEAD POST OPTIONS PUT'"
```

### Disable a rule for a specific parameter

Other times, you might want to fully disable a rule on a specific endpoint for a specific parameter.

Let's say the `query` parameter on the `foo.php` page triggers a false positive on the rule `942100` (LibInjection SQL detection).

We can disable this rule on this specific parameter:

```conf title="/var/lib/crowdsec/data/crs-plugins/my-custom-plugin/custom-plugin-before.conf"
SecRule REQUEST_FILENAME "@streq /foo.php" \
  "id:9900001,\
  phase:1,
  pass,
  t:none,
  nolog,
  ctl:RemoveTargetById=942100;ARGS:query"
```

### Fully disable a rule

You might also want to fully disable a rule. While this should be avoided, and it's safer to target specific parameters, sometimes you might need to disable a rule globally because it causes too many false positives.

```conf title="/var/lib/crowdsec/data/crs-plugins/my-custom-plugin/custom-plugin-before.conf"
SecRuleRemoveById 942100
```
