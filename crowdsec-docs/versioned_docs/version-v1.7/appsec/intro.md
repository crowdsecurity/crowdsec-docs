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

Meet the CrowdSec **Application Security Component** (AppSec Component), which turns your CrowdSec install into a full-fledged **WAF**.

The **AppSec Component** offers:

-   Low-effort **virtual patching**.
-   Support for legacy **ModSecurity** rules.
-   Classic WAF protection plus CrowdSec features for **advanced behavior detection**.
-   **Full integration** with the CrowdSec stack, including the console and remediation components.

<!-- xx :  links -->

The component uses existing remediation hooks in web servers and reverse proxies (Nginx, Traefik, HAProxy, etc.) to provide web application firewall capabilities.

![appsec-global](/img/appsec-global.svg)

### How it works

1. The web server receives the HTTP request.
2. The request is forwarded to the CrowdSec Security Engine over a local HTTP interface.
3. The engine evaluates the request against AppSec rules (in-band rules can block immediately).
4. Based on the result, the web server either blocks the request or processes it as usual.

### One WAF, many web servers

The AppSec Component lives in the **CrowdSec Security Engine**, so you get a single “source of truth” for:
- AppSec configurations and rules (collections from the Hub)
- logging, alerting, and Console visibility

This makes it easy to protect **multiple web servers / reverse proxies** with one CrowdSec instance: each remediation component forwards requests to the same AppSec `listen_addr`.

Compared to WAFs embedded directly inside each web server, you don’t have to duplicate rule and configuration updates across multiple locations: update the rules once in CrowdSec, and every connected remediation component benefits.

:::tip Common gotchas
- Installing rules is not enough: you must also enable the AppSec acquisition datasource and restart CrowdSec.
- The remediation component must support AppSec forwarding, and must be configured to forward to the same `listen_addr` you set in the acquisition file.
- In-band rules return an action for the current request (for example `ban`/`captcha`); longer-term bans are driven by scenarios and decisions.
:::

## Supported Web Servers & Reverse Proxies

The AppSec Component works seamlessly with modern web servers and reverse proxies:

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px'}}>

<div style={{display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', alignItems: 'center', textAlign: 'center'}}>
<img src="/img/nginx.svg" alt="Nginx" style={{height: '50px', objectFit: 'contain'}} />
<strong>Nginx</strong>
<a href="quickstart/nginxopenresty">Quick Start Guide →</a>
</div>

<div style={{display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', alignItems: 'center', textAlign: 'center'}}>
<img src="/img/openresty.png" alt="OpenResty" style={{height: '50px', objectFit: 'contain'}} />
<strong>OpenResty</strong>
<a href="quickstart/nginxopenresty">Quick Start Guide →</a>
</div>

<div style={{display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', alignItems: 'center', textAlign: 'center'}}>
<img src="/img/traefik.logo.png" alt="Traefik" style={{height: '50px', objectFit: 'contain'}} />
<strong>Traefik</strong>
<a href="quickstart/traefik">Quick Start Guide →</a>
</div>

<div style={{display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', alignItems: 'center', textAlign: 'center'}}>
<img src="/img/haproxy-logo.png" alt="HAProxy" style={{height: '50px', objectFit: 'contain'}} />
<strong>HAProxy</strong>
<a href="quickstart/haproxy_spoa">Quick Start Guide →</a>
</div>

<div style={{display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', alignItems: 'center', textAlign: 'center'}}>
<img src="/img/WordPress-logotype-wmark.png" alt="WordPress" style={{height: '50px', objectFit: 'contain'}} />
<strong>WordPress</strong>
<a href="quickstart/wordpress">Quick Start Guide →</a>
</div>

</div>

**Looking for other integrations?** Check out the [full list of remediation components](https://hub.crowdsec.net/browse/#remediation-components) on the CrowdSec Hub. We're constantly adding new integrations!

## Inband Rules and Out-Of-Band Rules

The AppSec component relies on rules to inspect HTTP requests:

-   Inband rules are meant to interrupt request processing
-   Out-Of-Band rules are non-blocking and are evaluated asynchronously

### In-band rule processing

The security engine first evaluates the inband rules, designed to identify and block specific requests.  
Once these rules are evaluated, a response is relayed to the remediation component.

This leads to two possible outcomes:

1. If an in-band rule is triggered, the remediation component returns a 403 or a captcha challenge to the requester, stopping processing.
2. Otherwise, the request will be normally processed

### Out-of-band rule processing

In the background, the security engine will then evaluate the out-of-band rules. These rules do not impact performance or response time, as they are evaluated after the AppSec Component instructs the webserver to continue or stop processing the request.

They are usually meant to detect repetitive unwanted behavior (for example, application spam, resource enumeration, scalping). When these rules trigger, they emit an event that the Security Engine processes like a log line.

## Post processing

When a request triggers one or more rules, either in the inband section (blocking) or out-of-band (non-blocking), several things happen:

-   Inband (blocking) rules will appear in your `cscli alerts list` (and thus in your [console dashboard](https://app.crowdsec.net)).
-   Inband and Out-Of-Band rules will trigger an internal crowdsec event that can be treated as any log lines.

This lets scenarios leverage WAF rule events, such as extending a ban for an IP that triggers multiple virtual patching rules.

## Next steps

You can follow our quick start guides depending on your web server:

-   [Nginx/OpenResty](quickstart/nginxopenresty)
-   [Traefik](quickstart/traefik)
-   [HAProxy (SPOA)](quickstart/haproxy_spoa)
-   [WordPress](quickstart/wordpress)
-   [CrowdSec WAF with Nginx Reverse Proxy](/u/user_guides/waf_rp_howto)

Or consider learning more about the AppSec capabilities:

-   **Rules**: [How to read, write and debug rules](rules_syntax.md)
-   **Scenarios**: [How to create scenarios that leverage the AppSec Component events](alerts_and_scenarios.md)
-   **Hooks**: [To customise behavior of the AppSec at runtime](hooks.md)
-   **Troubleshoot**: [How to troubleshoot the behavior of the AppSec Component](troubleshooting.md)
-   **AppSec Technical Details**: [For developers integrating with the AppSec Component](protocol.md)
