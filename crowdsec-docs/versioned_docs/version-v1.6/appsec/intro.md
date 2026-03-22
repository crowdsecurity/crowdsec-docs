---
id: intro
title: AppSec Component - CrowdSec WAF
sidebar_position: 1
---

## Introduction

<!-- xx : fix crowdsec version -->

Meet the CrowdSec **Application Security Component** (AppSec Component), which turns your CrowdSec install into a full-fledged **WAF**.

The **AppSec Component** offers:

-   Low-effort **virtual patching**.
-   Support for legacy **ModSecurity** rules.
-   Classic WAF protection plus CrowdSec features for **advanced behavior detection**.
-   **Full integration** with the CrowdSec stack, including the console and remediation components.

<!-- xx :  links -->

This component uses existing remediation hooks in web servers (Nginx, Traefik, HAProxy, etc.) to provide web application firewall capabilities.

![appsec-global](/img/appsec-global.svg)

1. The web server receives the HTTP request.
2. The request is intercepted and passed to the CrowdSec Security Engine via [the HTTP API](appsec/protocol.md).
3. The Security Engine answers once the AppSec in-band rules have been processed.
4. Based on the [Security Engine answer](appsec/protocol.md#response-code), the web server either blocks the request or processes it as usual.

## In-band Rules and Out-of-Band Rules

The AppSec component relies on rules to inspect HTTP requests:

-   In-band rules are meant to interrupt request processing
-   Out-Of-Band rules are non-blocking and are evaluated asynchronously

### In-band rule processing

The security engine first evaluates the in-band rules, designed to identify and block specific requests.  
Once these rules are evaluated, a response is relayed to the remediation component.

This leads to two possible outcomes:

1. If an in-band rule is triggered, the remediation component returns a 403 or a captcha challenge to the requester, stopping processing.
2. Otherwise, the request will be normally processed

### Out-of-band rules processing

In the background, the security engine then evaluates out-of-band rules. These rules do not impact performance or response time, as they run after the AppSec Component instructs the web server to continue or stop processing the request.

They are usually meant to detect repetitive unwanted behavior (for example, application spam, resource enumeration, scalping). When these rules trigger, they emit an event that the Security Engine processes like a log line.

## Post processing

When a request triggers one or more rules, either in the in-band section (blocking) or out-of-band (non-blocking), several things happen:

-   In-band (blocking) rules appear in your `cscli alerts list` (and thus in your [console dashboard](https://app.crowdsec.net)).
-   In-band and Out-of-Band rules trigger an internal CrowdSec event that can be treated like any log line.

This lets scenarios leverage WAF rule events, such as extending a ban for an IP that triggers multiple virtual patching rules.

## Next steps

You can follow our quick start guides depending on your web server:

-   [Nginx/OpenResty](quickstart/nginxopenresty)
-   [Traefik](quickstart/traefik)
-   [WordPress](quickstart/wordpress)
-   [CrowdSec WAF with Nginx Reverse Proxy](/u/user_guides/waf_rp_howto)

Or consider learning more about the AppSec capabilities:

-   **Rules**: [How to read, write and debug rules](/appsec/rules_syntax.md)
-   **Scenarios**: [How to create scenarios that leverage the AppSec Component events](/appsec/alerts_and_scenarios.md)
-   **Hooks**: [To customize behavior of the AppSec at runtime](/appsec/hooks.md)
-   **Troubleshoot**: [How to troubleshoot the behavior of the AppSec Component](/appsec/troubleshooting.md)
-   **AppSec Protocol**: [If you're maintaining or creating a remediation component and want to add AppSec capabilities](/appsec/protocol.md)
