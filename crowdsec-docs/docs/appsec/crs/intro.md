---
id: intro
title: CRS Support
---

The CrowdSec WAF is compatible with the [OWASP CRS](https://coreruleset.org/) project.

The **OWASP Core Rule Set (CRS)** is a set of generic attack detection rules for use with ModSec-compatible web application firewalls. CRS aims to protect web applications from a wide range of attacks, including the OWASP Top Ten, with minimal false positives.

**Key features of OWASP CRS:**

- **Comprehensive Coverage**: Protects against SQL injection, XSS, command injection, path traversal, and many other attack types
- **Generic Detection**: Uses pattern-based rules that detect attack techniques rather than specific exploits
- **Mature Ruleset**: Actively maintained by the OWASP community with regular updates
- **Configurable Sensitivity**: Supports paranoia levels to balance security vs false positives
- **Wide Compatibility**: Works with various WAF engines including CrowdSec's AppSec component

**CRS vs Virtual Patching:**

- **Virtual Patching**: Targets specific known vulnerabilities (CVEs) with minimal false positives
- **CRS**: Provides broad attack pattern detection with comprehensive coverage but may require tuning

In CrowdSec, CRS rules can be deployed in two modes:

- **Out-of-band**: Analyzes traffic without blocking, triggers bans after multiple violations
- **In-band**: Blocks malicious requests immediately at detection time

CRS compatibility is provided through [Coraza](https://github.com/corazawaf/coraza).
