---
id: configuration
title: Configuration Files
sidebar_position: 6
---

# Collections and AppSec component

When installing collections related to the Application Security Component, it often

Before jumping into the action, let's review the type of configuration items that are involved into the appsec component configuration:

- **acquisition configuration** tells on which interface and port is the service exposed, as well as the associated AppSec component configuration it will use.
<!--@sbl we need anchor for the on_whatever and expr helpers -->
- **appsec component configuration** tells which rules are loaded in inband (blocking) and out-of-band (non-blocking)
  phases. [it as well allows you to tweak the behavior of the component via the powerfull expr bindings](/appsec/rules_syntax.md)
- **rules** allow you to write a signature to detect and/or block malevolent requests. [You can find more information about the syntax here](/appsec/rules_syntax.md)

With that covered, we can now install our collection. This will bring the appsec component configuration, alongside with a set of rules for virtual patching. It will as well install some scenarios that are here to laverage the alerts from the appsec component, banning attackers that trigger too many rules:
