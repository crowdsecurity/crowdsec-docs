---
id: rules
title: Rules
sidebar_position: 3
---

<!--

 describe the overall rule (waap rules) organization, relevant section.
 explain the DSL
 speak a bit about how to write yours and how to write waap-tests in the hub (kka)
 how to debug them

-->

Rules are the core of the application security engine. They are used to detect and block attacks.

There are 2 types of rules:
 - In-band rules: Those rules are evaluated by the Application Security Engine in a "blocking" manner, meaing the remediation component will wait for all rules to be evaluated before blocking or not the request (based on the response from the Application Security Engine).
 - Out-band rules: Those rules are evaluated by the Application Security Engine in a "non-blocking" manner, after the remediation component has received the response. It is very useful if you have rules that could be considered expensive to evaluate, or are part of a more complex detection logic (eg, blocking an exploit that span multiple requests).


In-Band rules and out-band rules differ slightly in their default behavior when a rule matches:
 - If an in-band rule matches, an alert will be created inside crowdsec, allowing you to take a longer term action againt the offending IP. No event will be generated.
 - If an out-band rule mathes, no alert will be generated (meaning no decision from crowdsec), but an event will be generated and sent through the normal parsers/scenarios pipeline, allowing to detect more complex behaviors.  



## Rules Syntax

The rules syntax follows a simple DSL:

```yaml

```


### Seclang Support

The application security engine is also able to load rule in the seclang format (modsecurity rules).

We recommend using this format only to use existings rules you may have.

Modsecurity syntax support is provided by [coraza](https://github.com/corazawaf/coraza/), and the reference documentation is available [here](https://coraza.io/docs/seclang/syntax/).

There are 2 ways to provide crowdsec with seclang rules:
 - Provide rules directly by using the `seclang_rules` parameter in your rule file
 - Provide a file containing the rules by using the `seclang_rules_file` parameter in your rule file. The file must be located inside crowdsec data directory

 :::info
The default paths for the data directory per OS:
- Linux: `/var/lib/crowdsec/data`
- Freebsd: `/var/db/crowdsec/data`
- Windows: `C:\programdata\crowdsec\data`
:::

```yaml
type: waap-rule
name: example/secrules
seclang_rules:
 - SecRule ARGS:ip ";" "t:none,log,deny,msg:'semi colon test',id:2"
seclang_files_rules:
 - my-rule-file.conf
```

## Writing your own rules

### Rules


#### In-band rules


#### Out-band rules

Now, we will write an out-band rule to detect a specific behaviour.

Let's assume that we have a web application that exposes an API endpoint on `/api` with multiple actions, and that always return a `200` status code, even if the action failed:
 - Login
 - Get information about a product
 
It is not possible to detect a brute-force attack on this endpoint by looking only at the logs, as the application will always return a `200` status code, meaning we cannot distinguish a login attempt from a simple information request.

But we can write an out-band rule that will generate an event for any login attempt, and a scenario that will used a standard [leaky bucket](/scenarios/format.md) to detect brute-force attacks.

Here is an example of a login request:
```http
POST /api HTTP/1.1

Content-Type: application/json

{
  "action": "login",
  "username": "admin",
  "password": "password"
}
```
 
First, our waap-rule:

```yaml
type: waap-rule
name: example/bf-detection
description: "Always matches on login attempts"
rules:
  - body_type: json
    and:
    - zones:
        - METHOD
      match:
        type: equal
        value: POST
	- zones:
		- URI
	  match:
	  	type: equal
		value: /api
    - zones:
        - BODY_ARGS
      variables:
        - login
      match:
        type: regex
        value: ".+"
    - zones:
        - BODY_ARGS
      variables:
        - password
      match:
        type: regex
        value: ".+"

### Testing


## Debugging rules