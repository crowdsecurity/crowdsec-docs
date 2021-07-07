# Overview

`{{v11X.cli.name}}` is the utility that will help you to manage {{v11X.crowdsec.name}}. This tool has the following functionalities:

 - manage [decisions](/Crowdsec/v11/cscli/cscli_decisions/) and [alerts](/Crowdsec/v11/cscli/cscli_alerts/) : This is how you monitor ongoing remediation and detections
 - manage configurations such as [collections](/Crowdsec/v11/cscli/cscli_collections/), [parsers](/Crowdsec/v11/cscli/cscli_parsers/), [scenarios](/Crowdsec/v11/cscli/cscli_scenarios/) : This is how you install/update {{v11X.crowdsec.htmname}}'s detection capabilities and manage whitelists
 - interact with the [hub](/Crowdsec/v11/cscli/cscli_hub/) to find new configurations or update existing ones
 - manage local api (LAPI) [bouncers](/Crowdsec/v11/cscli/cscli_bouncers/) and [machines](/Crowdsec/v11/cscli/cscli_machines/) : This allows you to manage LAPI credentials, this is how you make {{v11X.crowdsec.htmname}} and bouncers comunicate
 - observe crowdsec via [metrics](/Crowdsec/v11/cscli/cscli_metrics/) or the [dashboard](/Crowdsec/v11/cscli/cscli_dashboard/) : This is how you gain real-time observability 
 - manage [simulation](/Crowdsec/v11/cscli/cscli_simulation/) configurations, allowing you to disable/modify remediation triggered by specific scenarios


Take a look at the [dedicated documentation](/Crowdsec/v11/cscli/cscli)

!!! tips
    You can enable `cscli` auto completion in `bash` or `zsh`.

    You can find `cscli completion` documentation [here](/Crowdsec/v11/cscli/cscli_completion/).

# Configuration

`{{v11X.cli.name}}` shares the configuration file of {{v11X.crowdsec.name}}, usually in `/etc/crowdsec/config.yaml`
