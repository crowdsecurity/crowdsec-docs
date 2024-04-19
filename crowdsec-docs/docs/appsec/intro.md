---
id: intro
title: Introduction
sidebar_position: 1
---

## Introduction

<!-- xx : fix crowdsec version -->

Meet the Crowdsec **Application Security Component** (AKA : **AppSec Component**), a new capability for advanced application security:

The **AppSec Component** offers:

- Low-effort **virtual patching** capabilities.
- Support for your legacy **ModSecurity** rules.
- Combining classic WAF benefits with advanced CrowdSec features for otherwise difficult **advanced behavior detection**.
- **Full integration** with the Crowdsec software stack, including the console and remediation components.

<!-- xx :  links -->

This component capitalizes on existing remediation functions in web servers (such as Nginx, Traefik, Haproxy, etc.) to provide web application firewall capabilities.

![appsec-global](/img/appsec-global.png)

## Request inspection

Examining Three Key Layers of the AppSec Component's Request Inspection

### 1 Remediation component: request relaying

If the AppSec capability is activated on the remediation component, the incoming requests will be channeled to the CrowdSec Security engine.

### 2 Security Engine: inband rule processing

The security engine first evaluates the inband rules, designed to identify and block specific requests.  
Once these rules are evaluated, a response is relayed to the remediation component.

This leads to two possible outcomes:

1.  If no inband rule is triggered, the processing of the request will continue on the web-server side as usual
2.  If an inband rule is triggered, the remediation component will answer with a 403 or a captcha request to the user of the incriminated request, stopping the request processing.

### 3 Security Engine: out-of-band rules processing

In the background, the security engine will then evaluate the out-of-band rules. These rules do not impact performance or response time, as they are evaluated after the AppSec Component instructs the webserver to continue or stop processing the request.

## Post processing

When a request triggers one or more rules, either in the inband section (blocking) or out-of-band (non-blocking), several things happen:

- Inband (blocking) rules will appear in your `cscli alerts list` (and thus in your [console dashboard](https://app.crowdsec.net)).
- Inband and Out-Of-Band rules will trigger an internal crowdsec event that can be treated as any log lines.

This is meant to allow for scenarios to exploit the WAF rules events, such as blocking for a longer time an IP that clearly engages in malevolent activities, triggering several virtual patching rules.

## Next steps

Let's now start using this AppSec capabilities:

- **Installation**: [How to configure the Application Security Component with an existing remediation component](/appsec/installation.md)
- **Rules**: [How to read, write and debug rules](/appsec/rules_syntax.md)
- **Scenarios**: [How to create scenarios that leverage the AppSec Component events](#TODO)
- **Hooks**: [For advanced use let's talk about possible Hooks](/appsec/hooks.md)
- **Troubleshoot**: [How to troubleshoot the behavior of the AppSec Component](/appsec/troubleshooting.md)
- **AppSec Protocol**: [if you're maintaining or creating a remedation component and want to add the AppSec capabilities](/appsec/protocol.md)
