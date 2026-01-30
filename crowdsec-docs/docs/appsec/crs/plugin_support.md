---
id: plugin_support
title: Plugin support
sidebar_position: 1
---

The CRS provides a plugin mechanism, allowing you to extend the CRS or fine-tune its behaviour for specific applications.

The vast majority of plugins should work with CrowdSec. The only exception is plugins requiring Lua scripts.

## How plugins work

CRS plugins are injected both before and after the CRS rules. In a standalone CRS deployment, it typically looks like this:

```
Include crs/crs-setup.conf # CRS config include

Include crs/plugins/*-config.conf # CRS plugin
Include crs/plugins/*-before.conf # CRS plugin

Include crs/rules/*.conf # CRS rules include

Include crs/plugins/*-after.conf # CRS plugin
```

CrowdSec retains the same logic, but with slightly different paths. The following files are included automatically if present in `/var/lib/crowdsec/data/`:

```yaml
- crs-plugins/*/*-config.conf
- crs-plugins/*/*-before.conf
- crs-plugins/*/*-after.conf
```

:::warning

Plugins are enabled globally, meaning you cannot enable or disable one for one specific route or FQDN.

:::

## Installing a CRS plugin from the Hub

Exclusion plugins officially supported and maintained by the CRS team are available in the [CrowdSec Hub](https://app.crowdsec.net/hub). You can search for `appsec-crs-exclusion-plugin`.

If the plugin you want to use is listed in the Hub, you can simply install it with `cscli collections install crowdsecurity/<PLUGIN_NAME>`.

It will be automatically loaded by CrowdSec after a restart if you are using the CRS collection.

Plugins installed through the Hub are kept up to date automatically once installed.

:::warning
CRS plugins are treated as data files in CrowdSec. Any manual changes to them will be overwritten the next time they are updated.
:::

## Manually installing a plugin

If the plugin you want to use is not provided by the hub (or you want to make some changes to the plugin), you will need to manually install it.

Let's take the [Roundcube third-party plugin](https://github.com/EsadCetiner/roundcube-rule-exclusions-plugin) as an example.

You'll need to first create the plugin directory in the CrowdSec data directory (you can use any name you want for the directory):

```sh
sudo mkdir /var/lib/crowdsec/data/crs-plugins/roundcube
```

Next, we'll simply need to copy the contents of the `plugins` directory into the directory we just created.
Assuming the plugin repository was cloned to `/home/user/roundcube-rule-exclusions-plugin/`:

```sh
sudo cp /home/user/roundcube-rule-exclusions-plugin/plugins/*.conf /var/lib/crowdsec/data/crs-plugins/roundcube/
```

In any case, refer to the documentation of the plugin to check if you need to configure some plugin-specific options.

If you are writing a fully custom plugin, you can follow the exact same steps to deploy your plugin.

Finally, restart CrowdSec to load the new plugin.
