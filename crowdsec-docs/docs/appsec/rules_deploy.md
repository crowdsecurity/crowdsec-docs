---
id: rules_deploy
title: Custom Rules deployment
sidebar_position: 81
---

# WAF Rules Deployment

This guide starts once you have already authored and validated a custom AppSec (WAF) rule locally. The steps below focus on packaging that rule so CrowdSec can load it, wiring the configuration into the acquisition pipeline, deploying the files, and finally smoke-testing the result.

## Step 1 — Stage the Rule File

CrowdSec loads AppSec rules from `/etc/crowdsec/appsec-rules/`. Copy your YAML rule into that directory (create a `custom/` subfolder to keep things tidy if you manage several rules):

```bash
sudo install -d -m 750 /etc/crowdsec/appsec-rules/custom
sudo install -m 640 ./my-virtual-patch.yaml \
  /etc/crowdsec/appsec-rules/custom/my-virtual-patch.yaml
```

Make sure the `name` inside the rule file matches the file name convention you plan to reference (for example `custom/my-virtual-patch`).

:::tip
If you run CrowdSec in a container, copy the file into the volume that is mounted at `/etc/crowdsec/appsec-rules/` inside the container.
:::

## Step 2 — Create an AppSec Configuration

An AppSec configuration lists which rules to load and how to handle matches. Create a new file under `/etc/crowdsec/appsec-configs/` that targets your custom rule:

```yaml title="/etc/crowdsec/appsec-configs/custom-virtual-patching.yaml"
name: custom/virtual-patching
default_remediation: ban
inband_rules:
  - custom/my-virtual-patch
# Add outofband_rules or hooks here if needed
```

Key points:
- `name` is how you will reference this configuration from the acquisition file and in logs.
- `inband_rules` (and/or `outofband_rules`) accept glob patterns, so you can load multiple rules with a single entry such as `custom/my-virtual-patch-*`.
- Keep file permissions restrictive (`640`) so only the `crowdsec` user can read the file.
- During the reload step CrowdSec validates the syntax; if anything is off, the reload fails and the service logs the parsing error.

## Step 3 — Reference the Configuration in the Acquisition File

The AppSec acquisition file (`/etc/crowdsec/acquis.d/appsec.yaml`) controls which configurations are active for the WAF component. Add your configuration to the `appsec_configs` list. Order matters: later entries override conflicting defaults such as `default_remediation`.

```yaml title="/etc/crowdsec/acquis.d/appsec.yaml"
appsec_configs:
  - crowdsecurity/appsec-default
  - custom/virtual-patching
labels:
  type: appsec
listen_addr: 127.0.0.1:7422
source: appsec
```

If you only want to run your custom configuration, remove other entries and keep the list with a single item.

## Step 4 — Reload CrowdSec and Validate the Load

Apply the changes by reloading the CrowdSec service:

```bash
sudo systemctl reload crowdsec
```

If your init system does not support reload, perform a restart instead. Then verify the rule and configuration are active:

```bash
sudo cscli appsec-rules list | grep my-virtual-patch
sudo cscli appsec-configs list | grep virtual-patching
sudo journalctl -u crowdsec --since "5 minutes ago" | grep appsec
```

The rule should appear as `enabled`, and the configuration should show up in the list. CrowdSec logs confirm the configuration was loaded without errors.

## Step 5 — Functional Test with `curl`

Trigger the behaviour your rule is meant to catch to ensure it blocks as expected. For example, if the rule protects `/admin` against a malicious header, you can test from the WAF host:

```bash
curl -i -H 'X-Foobar-Bypass: 1' \
     -d 'user_id=123;cat /etc/passwd&do=yes' \
     http://127.0.0.1/admin
```

A successful block returns an HTTP status such as `403 Forbidden`, and CrowdSec logs a matching alert:

```bash
sudo journalctl -u crowdsec -n 20 | grep "my-virtual-patch"
```

If the request is not blocked, double-check that the rule `name` matches the pattern in your AppSec configuration, that the acquisition file lists your configuration, and that the CrowdSec service picked up the changes.

## Next Steps

- Add automated regression tests with `cscli hubtest` so future updates do not break the rule.
- Version-control your custom rule and configuration files to keep track of changes.
