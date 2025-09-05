---
id: advanced_deployments
title: Advanced WAF Deployments
sidebar_position: 6
---

# Advanced WAF Deployments

This guide covers advanced CrowdSec WAF deployment strategies for organizations looking to gradually enhance their web application security posture. Learn how to progressively improve your WAF configuration from basic virtual patching to comprehensive multi-layer protection.

:::info Prerequisites
This guide assumes you have completed the [General Setup](/appsec/quickstart/general.mdx) and have a functional basic WAF deployment.
:::

## About OWASP Core Rule Set (CRS)

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

## Security Enhancement Path

CrowdSec WAF supports multiple deployment strategies that can be implemented progressively:

### 1. Basic Virtual Patching (Quickstart)
**Current State**: Blocking protection against known CVEs
- Collections: `crowdsecurity/appsec-virtual-patching`
- Mode: In-band (blocking)
- Coverage: Known vulnerabilities only
- False Positives: Minimal

### 2. Enhanced Detection (Out-of-band CRS)
**Next Step**: Add comprehensive attack detection without performance impact
- Add: `crowdsecurity/appsec-crs` (out-of-band) alongside existing virtual patching
- Mode: Non-blocking analysis + behavioral banning
- Coverage: OWASP Top 10 + comprehensive attack patterns + specific CVE protection
- Performance: No latency impact ⚡
- Security: Layered approach - virtual patching + generic attack detection

### 3. Maximum Protection (In-band CRS)
**Advanced**: Full blocking protection with comprehensive coverage
- Modify: Configure CRS for in-band (blocking) mode while keeping virtual patching
- Mode: Immediate blocking of all detected attacks (both generic and CVE-specific)
- Coverage: Maximum protection with instant response 🛡️
- Security: Dual-layer blocking - virtual patching handles specific vulnerabilities, CRS covers generic attack patterns
- Consideration: Might require tuning to minimize false positives

## Implementation Guide

### Step 2: Adding Out-of-band CRS

Enhance your existing virtual patching deployment by adding comprehensive attack detection as an additional security layer:

```bash title="Install CRS collection"
sudo cscli collections install crowdsecurity/appsec-crs
```

The `crowdsecurity/appsec-crs` collection includes:
- **crowdsecurity/crs**: AppSec config that loads CRS rules in out-of-band mode
- **crowdsecurity/crowdsec-appsec-outofband**: Scenario that bans IPs after 5+ out-of-band rule violations

Update your WAF acquisition configuration to include both rule sets:

```yaml title="/etc/crowdsec/acquis.d/appsec.yaml"
appsec_configs:
  - crowdsecurity/virtual-patching   # Virtual patching rules (in-band blocking)
  - crowdsecurity/crs                # OWASP CRS rules (out-of-band detection)
labels:
  type: appsec
listen_addr: 127.0.0.1:7422
source: appsec
name: myAppSecComponent
```

```bash title="Restart CrowdSec"
sudo systemctl restart crowdsec
```

**Benefits of this layered configuration:**
- **Layer 1**: Immediate protection against known vulnerabilities (virtual patching)
- **Layer 2**: Comprehensive attack pattern detection (CRS out-of-band)
- **Complementary Coverage**: Virtual patching rules catch specific CVEs that CRS generic rules might miss
- Behavioral analysis and repeat offender banning
- No performance impact on legitimate traffic

#### How to Test Step 2: Out-of-band CRS Detection

After implementing the layered configuration, verify both protection layers are working correctly:

**Test 1: Virtual Patching Layer (Immediate Blocking)**

Test that virtual patching rules block requests immediately by trying to access sensitive files:

```bash
# Test .env file access (common vulnerability)
curl -v "http://your-app.com/.env"
curl -v "http://your-app.com/api/../.env"
```

Expected result: These requests should be immediately blocked with HTTP 403 Forbidden.

**Test 2: CRS Out-of-band Detection Layer**

The `crowdsecurity/crowdsec-appsec-outofband` scenario monitors for multiple attack attempts and bans IPs after 5+ out-of-band rule violations within the configured timeframe. Test with various attack patterns:

```bash
# Replace with your application URL
TARGET="http://your-app.com"

# SQL injection attempts (trigger multiple CRS rules)
curl "$TARGET/?id=1'+OR+'1'='1"
curl "$TARGET/?id=1+UNION+SELECT+*+FROM+users"
curl "$TARGET/?search='+OR+1=1--"
curl "$TARGET/?filter=admin'/**/OR/**/'1'='1"

# XSS attempts
curl "$TARGET/?q=<script>alert('xss')</script>"
curl "$TARGET/?comment=<img src=x onerror=alert(1)>"

# Command injection attempts
curl "$TARGET/?cmd=; cat /etc/passwd"
curl "$TARGET/?exec=|whoami"

# Additional malicious patterns to reach the 5+ threshold
curl "$TARGET/?test=../../../etc/passwd"
curl "$TARGET/?file=....//....//etc/hosts"

# Wait 10-15 seconds for the scenario to process and ban the IP
sleep 15

# Test if IP is now banned
curl "$TARGET/" # This should now be blocked
```

**Expected behavior:**
1. **First 1-4 requests**: Pass through to your application (out-of-band mode)
2. **After 5+ violations**: CrowdSec processes the violations (may take up to 10 seconds)
3. **After ~10 seconds**: IP gets banned by the `crowdsec-appsec-outofband` scenario
4. **Subsequent requests**: Blocked at CrowdSec level before reaching your application

:::info Processing Delay
The out-of-band scenario processes violations asynchronously, so there's typically a 5-10 second delay between reaching the violation threshold and the IP ban taking effect. This is normal behavior for out-of-band detection.
:::

**Test 3: Verify Out-of-band Alerts (Optional)**

To see individual out-of-band rule triggers (not just the ban), add a dedicated appsec config:

```yaml title="Add to /etc/crowdsec/acquis.d/appsec.yaml for detailed alerts"
appsec_configs:
  - crowdsecurity/virtual-patching   # Virtual patching rules (in-band blocking)
  - crowdsecurity/crs                # OWASP CRS rules (out-of-band detection)
  - crowdsecurity/crs-alert          # Generate alert for each CRS rule triggered
```

This will create individual alerts for each out-of-band rule violation, providing better visibility into attack patterns.

**Verification Commands:**

```bash
# Check for active bans
sudo cscli decisions list

# Review recent alerts (including out-of-band detections)
sudo cscli alerts list --limit 10

# Monitor real-time activity
sudo tail -f /var/log/crowdsec.log
```

<!-- ![Screenshot placeholder: CrowdSec Console showing out-of-band detection alerts and IP bans](placeholder-outofband-alerts.png) -->

### Step 3: CRS In-band (Blocking Mode)

For organizations requiring maximum protection, configure CRS rules to block requests immediately by installing the in-band CRS collection:

```bash title="Install CRS in-band collection"
sudo cscli collections install crowdsecurity/appsec-crs-inband
```

#### Update Acquisition Configuration

Modify your acquisition to use the in-band CRS configuration:

```yaml title="/etc/crowdsec/acquis.d/appsec.yaml"
appsec_configs:
  - crowdsecurity/virtual-patching   # Virtual patching rules (in-band blocking)
  - crowdsecurity/crs-inband         # OWASP CRS rules (in-band blocking)
labels:
  type: appsec
listen_addr: 127.0.0.1:7422
source: appsec
name: myAppSecComponent
```

```bash title="Restart CrowdSec"
sudo systemctl restart crowdsec
```

#### How to Test Step 3: CRS In-band Blocking

After configuring CRS for in-band (blocking) mode, test that both virtual patching and CRS rules provide immediate blocking:

**Test 1: Virtual Patching Layer (Still Blocking)**

Verify virtual patching continues to work:

```bash
# These should still be immediately blocked
curl -v "http://your-app.com/.env"
curl -v "http://your-app.com/.git/config"
```

Expected result: HTTP 403 Forbidden immediately.

**Test 2: CRS In-band Blocking**

Test that CRS rules now block requests immediately (no more out-of-band delay):

```bash
TARGET="http://your-app.com"

# SQL injection - should be blocked immediately
curl -v "$TARGET/?id=1' OR '1'='1"

# XSS - should be blocked immediately  
curl -v "$TARGET/?q=<script>alert('xss')</script>"

# Command injection - should be blocked immediately
curl -v "$TARGET/?cmd=; cat /etc/passwd"

# Path traversal - should be blocked immediately
curl -v "$TARGET/?file=../../../etc/passwd"
```

**Expected behavior:**
- **All requests above**: Immediately blocked with HTTP 403 Forbidden
- **No delay**: Unlike out-of-band mode, blocking is instant
- **Dual protection**: Both virtual patching AND CRS rules provide immediate blocking

**Verification Commands:**

```bash
# Check for immediate decisions (should see blocks right after requests)
sudo cscli decisions list

# Review alerts (should see both virtual patching and CRS alerts)
sudo cscli alerts list --limit 5

# Monitor real-time blocking
sudo tail -f /var/log/crowdsec.log
```

<!-- ![Screenshot placeholder: CrowdSec Console showing immediate in-band CRS blocks](placeholder-inband-blocks.png) -->

:::warning Important Considerations
In-band CRS blocking provides maximum protection but requires:
- **Thorough testing** in a staging environment
- **Gradual rollout** to production traffic
- **Monitoring and tuning** to prevent blocking legitimate requests
- **Whitelisting capabilities** for false positives
:::

## Next Steps

Once you've implemented advanced deployments:

- Configure [Custom Rules](/appsec/create_rules.md) for application-specific protection
- Set up [Hooks](/appsec/hooks.md) for custom response actions
- Explore [Configuration Options](/appsec/configuration.md) for fine-tuning
- Review [Troubleshooting Guide](/appsec/troubleshooting.md) for operational issues
