---
id: intro
title: AppSec Component - CrowdSec WAF
sidebar_position: 1
---

## Introduction

<!-- xx : fix crowdsec version -->

Meet the Crowdsec **Application Security Component** (AKA : **AppSec Component**), a new capability for advanced application security turning your CrowdSec install into a full fledged **WAF**.

The **AppSec Component** offers:

-   Low-effort **virtual patching** capabilities.
-   Support for your legacy **ModSecurity** rules.
-   Combining classic WAF benefits with advanced CrowdSec features for otherwise difficult **advanced behavior detection**.
-   **Full integration** with the Crowdsec software stack, including the console and remediation components.

<!-- xx :  links -->

This component capitalizes on existing remediation functions in web servers (such as Nginx, Traefik, Haproxy, etc.) to provide web application firewall capabilities.

![appsec-global](/img/appsec-global.svg)

1. The Web Server receives the HTTP request
2. The HTTP Request is intercepted and passed to the CrowdSec Security Engine via [the HTTP API](appsec/protocol.md)
3. The Security Engine answers to the Web Server once the Appsec inband rules have been processed.
4. Based on the [Security Engine answer](appsec/protocol.md#response-code), the Web Server either blocks the HTTP Request or processes it as usual

## Inband Rules and Out-Of-Band Rules

The AppSec component relies on rules to inspect HTTP Requests:

-   Inband rules are meant to interrupt request processing
-   Out-Of-Band rules are non-blocking and are evaluated asynchronously

### Inband rule processing

The security engine first evaluates the inband rules, designed to identify and block specific requests.  
Once these rules are evaluated, a response is relayed to the remediation component.

This leads to two possible outcomes:

1. If an inband rule is triggered, the remediation component will answer with a 403 or a captcha request to the user of the incriminated request, stopping the request processing.
2. Otherwise, the request will be normally processed

### Out-of-band rules processing

In the background, the security engine will then evaluate the out-of-band rules. These rules do not impact performance or response time, as they are evaluated after the AppSec Component instructs the webserver to continue or stop processing the request.

They are usually meant to detect unwanted behaviors that exhibit a repetitive aspect (ie. Applicative Spam, Resource enumeration, Scalping etc.). When those rules trigger, they emit an event is processed by the Security Engine in the same way a log line is.

## Post processing

When a request triggers one or more rules, either in the inband section (blocking) or out-of-band (non-blocking), several things happen:

-   Inband (blocking) rules will appear in your `cscli alerts list` (and thus in your [console dashboard](https://app.crowdsec.net)).
-   Inband and Out-Of-Band rules will trigger an internal crowdsec event that can be treated as any log lines.

This is meant to allow for scenarios to exploit the WAF rules events, such as blocking for a longer time an IP that clearly engages in malevolent activities, triggering several virtual patching rules.

## Next steps

You can follow our quick start guides depending on your web server:

-   [Nginx/OpenResty](/appsec/quickstart/nginxopenresty.mdx)
-   [Traefik](/appsec/quickstart/traefik.mdx)
-   [How to setup CrowdSec WAF as Nginx Reverse Proxy](/u/user_guides/waf_rp_howto)

Or consider learning more about the AppSec capabilities:

-   **Rules**: [How to read, write and debug rules](/appsec/rules_syntax.md)
-   **Scenarios**: [How to create scenarios that leverage the AppSec Component events](/appsec/alerts_and_scenarios.md)
-   **Hooks**: [To customise behavior of the AppSec at runtime](/appsec/hooks.md)
-   **Troubleshoot**: [How to troubleshoot the behavior of the AppSec Component](/appsec/troubleshooting.md)
-   **AppSec Protocol**: [if you're maintaining or creating a remedation component and want to add the AppSec capabilities](/appsec/protocol.md)
