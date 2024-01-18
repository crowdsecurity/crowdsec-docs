---
id: install_softagent
title: Soft Agent
sidebar_position: 1
---

# Using our SDK

With the help of our SDK, If you are developing security software that detects misbehaviors and does remediation on IPs, you can send signals about your detections and benefit from the community blocklist.

Our SDK do the heavy lifting of the CAPI connectivity so you can simply, sendSignals, getDecisions and getRemediationForIp, as well as enrolling your soft-agent into the console

![Possible integration](/img/php-libs-crowdsec-overview.jpg)

## PHP CAPI client + Remediation Engine

The [php-capi-client](https://github.com/crowdsecurity/php-capi-client) will deal automatically with connecting to CAPI and renewing the token when necessary.  
Provides the following public functions:
* pushSignals(array $signals)
* getStreamDecisions()
* enroll(...)

The [php-remediation-engine](https://github.com/crowdsecurity/php-remediation-engine) is built on top of the php-capi-client and provides decisions caching and querying utility.  
This way you can let it worry about the blocklist update and expiration of decisions.  
It provides the following public functions:
* getIpRemediation(string $ip)
  * Returns the recommended remediation for an IP
* refreshDecisions()
  * Called periodically by a cron for example
  * Read the [good practices](#good-practices) to know more about the frequency of refreshing

You can refer to the very detailed Developer and Installation guides linked in the repository to know more about it.

## Good practices

### php-capi-client
Via the php-capi-client your soft-agent is identified by CAPI via a randomly generated **machineId** and **password**.  
The **machineId** is what links your endpoint to your console account when you enroll.

The rules are : 
* The [**machineId-password**] couple **MUST NOT** change after having been validated by CAPI.
* Do not copy them for your other endpoints: the **machineId** must be unique for your endpoint
* You can configure a **prefix** for the **machineId** if you need to. Once set, avoid changing the **machine_id_prefix** as it will result in resetting the credentials

### php-remediation-engine

You will call the decisions-list/blocklist refresh via cron or schedulers.
* Call the decisions-refresh **no more** than once every 2 hours.
  * The blocklist is not likely to have drastically changed in 2 hours 
  * Although too often is not good we still recommend refreshing once a day

### Your signals

When you remediate locally a misbehavior, you would generate a signal for the corresponding scenario

**There are 2 types of signals**:
* decisions: when your security module triggers remediation on an IP (block or captcha) for some misbehaviors (brute force, spam, trying to access a file known for )
* whispers: behaviors that can seem trivial and may occur only once on your site but might result in identifying a malicious actor if he does the same action on hundreds of sites

**Examples of decision signals:**
* brute force on login-form
* contact form spam (either by repetition or if you have a way to identify spam content of the sent message like commercial links, known scams ...)
* trying to access a file known for a vulnerability (may it be on your type of system or another)
* credit card stuffing
...

**Example of Whisper signals**
* 404

Please get in touch with us to validate 

When sending signals the name of your scenario must follow this convention **^[a-z0-9_-]+\/[a-z0-9_-]+$** example **mysecmodule/login-bruteforce**

For categories of behaviors, you can refer to our behaviors list in the [taxonomy ](https://doc.crowdsec.net/docs/next/u/cti_api/taxonomy/#behaviors)

(!) **Avoid spamming CAPI with signals:**

Ideally, save them to a buffer and send the buffer periodically
* Frequency of emission: between 10 seconds and 10 minutes depending on how big the buffer gets in that period
* However, don't send more than 250 signals in a single call

### User-agent

Via the configuration or the php-capi-client you can set a user-agent.

This user agent will be set for queries towards CAPI and allow us to do a finer analysis of the signals sent by your security solution.

See the [User Guide](https://github.com/crowdsecurity/php-capi-client/blob/main/docs/USER_GUIDE.md#user-agent-suffix) for more info