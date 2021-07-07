<center>[[Hub]]({{v11X.hub.url}}) [[Releases]]({{v11X.crowdsec.download_url}})</center>

# Architecture

![Architecture](assets/images/crowdsec_architecture.png)


## Components

{{v11X.crowdsec.name}} ecosystem is based on the following components :

 - [{{v11X.crowdsec.Name}}]({{v11X.crowdsec.url}}) is the lightweight service that processes logs and keeps track of attacks.
 - [{{v11X.lapi.Name}}]({{v11X.lapi.url}}) is a core component of crowdsec-agent that exposes a local API to interact with crowdsec-agent.
 - [{{v11X.cli.name}}]({{v11X.cli.main_doc}}) is the command line interface for humans, it allows you to view, add, or remove bans as well as to install, find, or update scenarios and parsers
 - [{{v11X.bouncers.name}}]({{v11X.hub.bouncers_url}}) are the components that block malevolent traffic, and can be deployed anywhere in your stack

## Moving forward

To learn more about {{v11X.crowdsec.name}} and give it a try, please see :

 - [How to install {{v11X.crowdsec.name}}](/Crowdsec/v11/getting_started/installation/)
 - [Take a quick tour of {{v11X.crowdsec.name}} and {{v11X.cli.name}} features](/Crowdsec/v11/getting_started/crowdsec-tour/)
 - [Observability of {{v11X.crowdsec.name}}](/Crowdsec/v11/observability/overview/)
 - [Understand {{v11X.crowdsec.name}} configuration](/Crowdsec/v11/getting_started/concepts/)
 - [Deploy {{v11X.bouncers.name}} to stop malevolent peers](/Crowdsec/v11/bouncers/)
 - [FAQ](/faq/)

Don't hesitate to reach out if you're facing issues :

 - [report a bug](https://github.com/crowdsecurity/crowdsec/issues/new?assignees=&labels=bug&template=bug_report.md&title=Bug%2F)
 - [suggest an improvement](https://github.com/crowdsecurity/crowdsec/issues/new?assignees=&labels=enhancement&template=feature_request.md&title=Improvment%2F)
 - [ask for help on the forums](https://discourse.crowdsec.net)