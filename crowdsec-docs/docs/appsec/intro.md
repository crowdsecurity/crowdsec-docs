---
id: intro
title: Introduction
sidebar_position: 1
---

# Introduction

<!-- xx : fix crowdsec version -->
The application security engine available in crowdsec:

 - Provides low-effort virtual patching capabilities
 - Supports your legacy ModSecurity rules
 - Combines the advantages of classical WAF with the enhanced crowdsec capabilities to allow the detection of behaviors that would otherwise be difficult
 - Is fully integrated with the Crowdsec software stack, such as the console and remediation components.


Detailed installation and configuration instructions can be found here.


<!-- xx :  links -->
The application security engine takes advantage of the remediation components existing in web servers (such as Nginx, Traefik, Haproxy etc.) to provide this capability :

![appsec-global](/img/appsec-global.png)

1. The remediation component - if the application security engine is enabled - will forward the incoming request to the Crowdsec Security engine.
2. The security engine will first evaluate the inband rules, meant to detect requests that must be blocked. As soon as these rules are processed, an answer is provided to the remediation component:
   1. If no inband rule is triggered, the processing of the request will continue on the webserver side as usual
   2. If an inband rule is triggered, the remediation component will answer with a 403 or a captcha request to the user of the incriminated request, stopping the request processing.
3. In the background, the security engine will then evaluate the out-of-band rules. out-of-band rules do not impact performance nor response time, as they are evaluated after the application security engine instructs the webserver to stop or go on with the request processing.
