---
id: request_lifecycle
title: Request Lifecycle
sidebar_position: 5
---

# **CrowdSec AppSec Request Lifecycle & Detection Pipeline**

The CrowdSec AppSec architecture relies on several steps, involving **stateless inspection** (immediate pattern matching) and **stateful analysis** (long-term behavioral tracking). 

This document outlines the journey of an HTTP request through the engine's hooks, rulesets, and scenario-based alerting.

![waf-req-lifecycle](/img/waf_request_lifecycle.png)


## **Phase I: In-Band Processing (Synchronous)**

The In-Band phase is synchronous. The Remediation Component (e.g., Nginx, Traefik, or Ingress) pauses the request to wait for a verdict from the AppSec engine.

* **pre\_eval Hook:** The initial entry point. This hook executes logic before any rules are run. It is commonly used to whitelist trusted IPs or to disable specific rules for certain URIs to mitigate false positives.  
* **In-Band Rules:** The engine evaluates the request against rules defined in inband\_rules. These are typically high-confidence signatures used for "Virtual Patching" against known exploits (e.g., Log4Shell, SQL Injection).  
* **on\_match Hook:** Triggered only if a rule matches. It allows for logic overrides, such as logging the attempt without blocking, or setting specific remediation types.  
* **post\_eval Hook:** Executes regardless of the outcome. It is primarily used for technical logging or dumping request metadata for debugging via DumpRequest().  
* **Immediate Remediation:** If a match is confirmed, the engine returns a blocking status (e.g., 403 Forbidden or Captcha) and an **Immediate Alert** is sent to the Local API (LAPI).

## **Phase II: Out-of-Band Processing (Asynchronous)**

Once the In-Band phase completes, the request is passed to the backend application. Simultaneously, a copy of the request context is processed asynchronously to avoid adding latency to the user experience.

* **Out-of-Band (OOB) Rules:** These rulesets, such as the full **OWASP Core Rule Set (CRS)**, inspect the request for broader or lower-confidence indicators of malicious intent.  
* **Internal Event Generation:** Unlike the In-Band phase, an OOB match does not result in an immediate block. Instead, it generates an **Internal Event** (type appsec-info) containing enriched metadata about the suspicious activity.

## **Phase III: Scenario Evaluation (Behavioral Analysis)**

The internal events generated in Phase I and II flow into the standard CrowdSec Parser and Scenario pipeline. This stage transforms individual "signals" into actionable security "intelligence."

* **The Leaky Bucket Logic:** Scenarios employ a "leaky bucket" algorithm to aggregate events. While a single OOB rule match might be a false positive, a Scenario can be configured to trigger only if an IP exceeds a specific threshold (e.g., **X matches within Y seconds**).  
* **Behavioral Detection:** Scenarios allow the system to identify complex threats that stateless rules cannot see in isolation, such as:  
  * **Distributed Scans:** An IP probing multiple endpoints with varied payloads.  
  * **Aggressive Crawling:** Automated bots triggering several low-severity WAF rules across a session.  
* **Final Alert & Decision:** When a Scenario’s threshold is met, it creates a **Final Alert** in the LAPI. This generates a **Decision** (e.g., a 4-hour IP ban) which is synchronized back to all Remediation Components, blocking the attacker at the network edge for all subsequent requests.

**Summary of Component Roles**

| Component | Nature | Goal | Execution |
| :---- | :---- | :---- | :---- |
| **In-Band Rules** | Stateless | Immediate protection (Virtual Patching) | Blocking |
| **Out-of-Band Rules** | Stateless | Deep inspection without user latency | Non-blocking |
| **Scenarios** | Stateful | Identifies intent and patterns (Behavioral) | Post-processing |
