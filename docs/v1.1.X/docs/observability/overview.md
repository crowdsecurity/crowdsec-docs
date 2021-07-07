# Observability Overview

Observability in security software is crucial, especially when this software might take important decision such as blocking IP addresses.

We attempt to provide good observability of {{v11X.crowdsec.name}}'s behavior :

 - {{v11X.crowdsec.name}} itself exposes a [prometheus instrumentation](/Crowdsec/v11/observability/prometheus/)
 - {{v11X.cli.Name}} allows you to view part of prometheus metrics in [cli (`{{v11X.cli.bin}} metrics`)](/Crowdsec/v11/observability/command_line/)
 - {{v11X.crowdsec.name}} logging is contextualized for easy processing
 - for **humans**, {{v11X.cli.name}} allows you to trivially start a service [exposing dashboards](/Crowdsec/v11/observability/dashboard/) (using [metabase](https://www.metabase.com/))

Furthermore, most of {{v11X.crowdsec.name}} configuration should allow you to enable partial debug (ie. per-scenario, per-parser etc.)

