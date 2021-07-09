<center>[[Hub]]({{v1X.hub.url}}) [[Releases]]({{v1X.crowdsec.download_url}})</center>


# What is {{v1X.crowdsec.Name}} ?

[{{v1X.crowdsec.Name}}]({{v1X.crowdsec.url}}) is an open-source and lightweight software that allows you to detect peers with malevolent behaviors and block them from accessing your systems at various level (infrastructural, system, applicative).

To achieve this, {{v1X.crowdsec.Name}} reads logs from different sources (files, streams ...) to parse, normalize and enrich them before matching them to threats patterns called scenarios. 

{{v1X.crowdsec.Name}} is a modular and plug-able framework, it ships a large variety of [well known popular scenarios](https://hub.crowdsec.net/browse/#configurations); users can choose what scenarios they want to be protected from as well as easily adding new custom ones to better fit their environment.

Detected malevolent peers can then be prevented from accessing your resources by deploying [bouncers]({{v1X.hub.bouncers_url}}) at various levels (applicative, system, infrastructural) of your stack.

One of the advantages of Crowdsec when compared to other solutions is its crowd-sourced aspect : Meta information about detected attacks (source IP, time and triggered scenario) are sent to a central API and then shared amongst all users.

Thanks to this, besides detecting and stopping attacks in real time based on your logs, it allows you to preemptively block known bad actors from accessing your information system.


## Main features

{{v1X.crowdsec.Name}}, besides the core "detect and react" mechanism,  is committed to a few other key points :

 - **Easy Installation** : The provided wizard allows a [trivial deployment](/Crowdsec/v1/getting_started/installation/#using-the-interactive-wizard) on most standard setups
 - **Easy daily operations** : Using [cscli](/Crowdsec/v1/cscli/cscli_upgrade/) and the {{v1X.hub.htmlname}}, keeping your detection mechanisms up-to-date is trivial
 - **Reproducibility** : Crowdsec can run not only against live logs, but as well against cold logs. It makes it a lot easier to detect potential false-positives, perform forensic ou generate reporting
 - **Observability** : Providing strongs insights on what is going on and what {{v1X.crowdsec.name}} is doing :
    - Humans have [access to a trivially deployable web interface](/Crowdsec/v1/observability/dashboard/)
    - OPs have [access to detailed prometheus metrics](/Crowdsec/v1/observability/prometheus/)
    - Admins have [a friendly command-line interface tool](/Crowdsec/v1/observability/command_line/)


## Architecture

![Architecture](assets/images/crowdsec_architecture.png)


## Components

{{v1X.crowdsec.name}} ecosystem is based on the following components :

 - [{{v1X.crowdsec.Name}}]({{v1X.crowdsec.url}}) is the lightweight service that processes logs and keeps track of attacks.
 - [{{v1X.lapi.Name}}]({{v1X.lapi.url}}) is a core component of crowdsec-agent that exposes a local API to interact with crowdsec-agent.
 - [{{v1X.cli.name}}]({{v1X.cli.main_doc}}) is the command line interface for humans, it allows you to view, add, or remove bans as well as to install, find, or update scenarios and parsers
 - [{{v1X.bouncers.name}}]({{v1X.hub.bouncers_url}}) are the components that block malevolent traffic, and can be deployed anywhere in your stack

## Moving forward

To learn more about {{v1X.crowdsec.name}} and give it a try, please see :

 - [How to install {{v1X.crowdsec.name}}](/Crowdsec/v1/getting_started/installation/)
 - [Take a quick tour of {{v1X.crowdsec.name}} and {{v1X.cli.name}} features](/Crowdsec/v1/getting_started/crowdsec-tour/)
 - [Observability of {{v1X.crowdsec.name}}](/Crowdsec/v1/observability/overview/)
 - [Understand {{v1X.crowdsec.name}} configuration](/Crowdsec/v1/getting_started/concepts/)
 - [Deploy {{v1X.bouncers.name}} to stop malevolent peers](/Crowdsec/v1/bouncers/)
 - [FAQ](/faq/)

Don't hesitate to reach out if you're facing issues :

 - [report a bug](https://github.com/crowdsecurity/crowdsec/issues/new?assignees=&labels=bug&template=bug_report.md&title=Bug%2F)
 - [suggest an improvement](https://github.com/crowdsecurity/crowdsec/issues/new?assignees=&labels=enhancement&template=feature_request.md&title=Improvment%2F)
 - [ask for help on the forums](https://discourse.crowdsec.net)


## About this documentation

This document is split according to major {{v1X.crowdsec.Name}} versions :

 - [Crowdsec v0](/Crowdsec/v0/) Refers to versions `0.3.X`, before the local API was introduced. (_note: this is going to be deprecated and your are strongly incited to migrate to versions 1.X_)
 - [Crowdsec v1](/Crowdsec/v1/) Refers to versions `1.X`, it is the current version