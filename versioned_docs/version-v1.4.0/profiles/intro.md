---
id: intro
title: Introduction
sidebar_position: 1
---

The profiles configuration allows users to configure which kind of remediation should be applied when a scenario is triggered. The profile can be used to:

- increase or decrease decisions `duration` (default: `4h`)
- decide the type of remediation that should be applied (default: `ban`)
- decide the scope of the remediation (default: `ip`)
- enable/disable debugging for a specific profile
- enable [notification plugins](https://docs.crowdsec.net/docs/next/notification_plugins/intro/) to receive warnings via mail, slack or other means

The profiles configuration is located in `/etc/crowdsec/profiles.yaml`.

You can also write your profiles in a `profiles.yaml.local` file (as explained
in [Crowdsec configuration](/configuration/crowdsec_configuration.md)), and they
will be read _before_ `profiles.yaml`. In this case, you may want to provide
`on_success: break` because the YAML files are not merged together, but read as
a single multi-document configuration.
