---
id: intro
title: AppSec Component - CrowdSec WAF
sidebar_position: 1
---

## What is CrowdSec?

If you're new to CrowdSec, here's a quick overview:

**CrowdSec** is an open-source, collaborative security solution that:
- Detects and blocks malicious actors threatening your infrastructure and applications
- Provides real-time threat intelligence through a participative community
- Offers both **Infrastructure Protection** (IP reputation, DDoS mitigation) and **Application Security** (WAF capabilities)

:::tip New to CrowdSec?
For a more detailed introduction, check out our [Getting Started Guide](/u/getting_started/intro).
:::

## Introduction

Meet the Crowdsec **Application Security Component** (AKA : **AppSec Component**), a new capability for advanced application security turning your CrowdSec install into a full fledged **WAF**.

The **AppSec Component** offers:

-   Low-effort **virtual patching** capabilities.
-   Support for your legacy **ModSecurity** rules.
-   Combining classic WAF benefits with advanced CrowdSec features for otherwise difficult **advanced behavior detection**.
-   **Full integration** with the Crowdsec software stack, including the console and remediation components.

<!-- xx :  links -->

This component capitalizes on existing remediation functions in web servers (such as Nginx, Traefik, Haproxy, etc.) to provide web application firewall capabilities.

![appsec-global](/img/appsec-global.svg)

### How it works

1. The Web Server receives the HTTP request
2. The HTTP Request is forwarded to the CrowdSec Security Engine via a local HTTP interface
3. The Security Engine analyzes the request against AppSec rules (inband rules for immediate blocking)
4. Based on the analysis, the Web Server either blocks the HTTP Request or processes it as usual

## Supported Web Servers & Reverse Proxies

The AppSec Component works seamlessly with modern web servers and reverse proxies:

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px'}}>

<div style={{display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', alignItems: 'center', textAlign: 'center'}}>
<img src="/img/nginx.svg" alt="Nginx" style={{height: '50px', objectFit: 'contain'}} />
<strong>Nginx</strong>
<a href="/appsec/quickstart/nginxopenresty.mdx">Quick Start Guide →</a>
</div>

<div style={{display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', alignItems: 'center', textAlign: 'center'}}>
<img src="/img/openresty.png" alt="OpenResty" style={{height: '50px', objectFit: 'contain'}} />
<strong>OpenResty</strong>
<a href="/appsec/quickstart/nginxopenresty.mdx">Quick Start Guide →</a>
</div>

<div style={{display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', alignItems: 'center', textAlign: 'center'}}>
<img src="/img/traefik.logo.png" alt="Traefik" style={{height: '50px', objectFit: 'contain'}} />
<strong>Traefik</strong>
<a href="/appsec/quickstart/traefik.mdx">Quick Start Guide →</a>
</div>

{/* HAProxy support coming soon - uncomment when feature is released */}
{/*
<div style={{display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', alignItems: 'center', textAlign: 'center'}}>
<img src="/img/haproxy-logo.png" alt="HAProxy" style={{height: '50px', objectFit: 'contain'}} />
<strong>HAProxy</strong>
<a href="https://hub.crowdsec.net/browse/#remediation-components">Hub Component →</a>
</div>
*/}

<div style={{display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', alignItems: 'center', textAlign: 'center'}}>
<img src="/img/WordPress-logotype-wmark-white.png" alt="WordPress" style={{height: '50px', objectFit: 'contain'}} />
<strong>WordPress</strong>
<a href="/appsec/quickstart/wordpress.mdx">Quick Start Guide →</a>
</div>

</div>

**Looking for other integrations?** Check out the [full list of remediation components](https://hub.crowdsec.net/browse/#remediation-components) on the CrowdSec Hub. We're constantly adding new integrations!

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
-   [WordPress](/appsec/quickstart/wordpress.mdx)
-   [CrowdSec WAF with Nginx Reverse Proxy](/u/user_guides/waf_rp_howto)

Or consider learning more about the AppSec capabilities:

-   **Rules**: [How to read, write and debug rules](/appsec/rules_syntax.md)
-   **Scenarios**: [How to create scenarios that leverage the AppSec Component events](/appsec/alerts_and_scenarios.md)
-   **Hooks**: [To customise behavior of the AppSec at runtime](/appsec/hooks.md)
-   **Troubleshoot**: [How to troubleshoot the behavior of the AppSec Component](/appsec/troubleshooting.md)
-   **AppSec Technical Details**: [For developers integrating with the AppSec Component](/appsec/protocol.md)
