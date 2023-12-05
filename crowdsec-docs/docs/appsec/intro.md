---
id: intro
title: Introduction
sidebar_position: 1
---

# Introduction

<!-- xx : fix crowdsec version -->
The application security component available in crowdsec:

 - Provides low-effort virtual patching capabilities
 - Supports your legacy ModSecurity rules
 - Combines the advantages of classical WAF with the enhanced crowdsec capabilities to allow the detection of behaviors that would otherwise be difficult
 - Is fully integrated with the Crowdsec software stack, such as the console and remediation components.

<!-- xx :  links -->
The application security component takes advantage of the remediation components existing in web servers (such as Nginx, Traefik, Haproxy etc.) to provide web application firewall capabilities:

![appsec-global](/img/appsec-global.png)

## Request inspection

1. The remediation component - if the application security component is enabled - forwards the incoming request to the Crowdsec Security engine.
2. The security engine will first evaluate the inband rules, meant to detect requests that must be blocked. As soon as these rules are processed, an answer is provided to the remediation component:
   1. If no inband rule is triggered, the processing of the request will continue on the webserver side as usual
   2. If an inband rule is triggered, the remediation component will answer with a 403 or a captcha request to the user of the incriminated request, stopping the request processing.
3. In the background, the security engine will then evaluate the out-of-band rules. out-of-band rules do not impact performance nor response time, as they are evaluated after the aplication security component instructs the webserver to stop or go on with the request processing.

## Post processing

When a request triggers one or more rules, either in the inband section (blocking) or out-of-band (non-blocking), several things happens:
 - Inband (blocking) rules will appear in your `cscli alerts list` (and thus in your [console dashboard](https://app.crowdsec.net)).
 - Inband and Out-Of-Band rules will trigger an internal crowdsec event that can be treated as any log lines.

 This is meant to allow for scenarios to exploit the WAF rules events, such as blocking for a longer time an IP that clearly engages in malevolent activities, triggering several virtual patching rules.

## Next steps

This section should provides you pointer for the next steps:
 - [How to configure the Application Security Component with an existing remediation component](/appsec/installation.md )
 - [How to read, write and debug rules](/appsec/rules.md)
 - [How to troubleshoot the behavior of the AppSec component](/appseec/troubleshoot.md)
 - [How to create scenarios that laverage the AppSec component events](/appsec/scenarios.md)

And if you're maintaining or creating a remedation component, you can find the specs of the communication with the appsec component [here](/appsec/protocol.md).
