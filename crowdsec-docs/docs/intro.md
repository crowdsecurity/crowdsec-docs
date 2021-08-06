---
title: Introduction
id: intro
---


<div style={{display: 'flex'}}>
    <div style={{textAlign: 'center', flex: '1'}}>
    <img src="../static/img/crowdsec_logo.png" width="300" height="200" ></img>
    </div>
</div>
&nbsp;
&nbsp;

[CrowdSec](https://github.com/crowdsecurity/crowdsec) is an open-source and lightweight software that allows you to detect peers with malevolent behaviors and block them from accessing your systems at various level (infrastructural, system, applicative).

To achieve this, CrowdSec reads logs from different sources (files, streams ...) to parse, normalize and enrich them before matching them to threats patterns called scenarios. 

CrowdSec is a modular and plug-able framework, it ships a large variety of [well known popular scenarios](https://hub.crowdsec.net/browse/#configurations); users can choose what scenarios they want to be protected from as well as easily adding new custom ones to better fit their environment.

Detected malevolent peers can then be prevented from accessing your resources by deploying [bouncers](https://hub.crowdsec.net/browse/#bouncers) at various levels (applicative, system, infrastructural) of your stack.

One of the advantages of Crowdsec when compared to other solutions is its crowd-sourced aspect : Meta information about detected attacks (source IP, time and triggered scenario) are sent to a central API and then shared amongst all users.

Thanks to this, besides detecting and stopping attacks in real time based on your logs, it allows you to preemptively block known bad actors from accessing your information system.


## Main features

CrowdSec, besides the core "detect and react" mechanism,  is committed to a few other key points :

 - **Easy Installation** : The provided wizard allows a [trivial deployment](/Crowdsec/v1/getting_started/installation/#using-the-interactive-wizard) on most standard setups
 - **Easy daily operations** : Using [cscli](/Crowdsec/v1/cscli/cscli_upgrade/) and the {{v0X.hub.htmlname}}, keeping your detection mechanisms up-to-date is trivial
 - **Reproducibility** : Crowdsec can run not only against live logs, but as well against cold logs. It makes it a lot easier to detect potential false-positives, perform forensic ou generate reporting
 - **Observability** : Providing strongs insights on what is going on and what {{v0X.crowdsec.name}} is doing :
    - Humans have [access to a trivially deployable web interface](/Crowdsec/v1/observability/dashboard/)
    - OPs have [access to detailed prometheus metrics](/Crowdsec/v1/observability/prometheus/)
    - Admins have [a friendly command-line interface tool](/Crowdsec/v1/observability/command_line/)