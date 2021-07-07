# Observability Overview

Observability in security software is crucial, especially when this software might take important decision such as blocking IP addresses.

We attempt to provide good observability of {{v10X.crowdsec.name}}'s behavior :

 - {{v10X.crowdsec.name}} itself exposes a [prometheus instrumentation](/Crowdsec/v1/observability/prometheus/)
 - {{v10X.cli.Name}} allows you to view part of prometheus metrics in [cli (`{{v10X.cli.bin}} metrics`)](/Crowdsec/v1/observability/command_line/)
 - {{v10X.crowdsec.name}} logging is contextualized for easy processing
 - for **humans**, {{v10X.cli.name}} allows you to trivially start a service [exposing dashboards](/Crowdsec/v1/observability/dashboard/) (using [metabase](https://www.metabase.com/))

Furthermore, most of {{v10X.crowdsec.name}} configuration should allow you to enable partial debug (ie. per-scenario, per-parser etc.)

