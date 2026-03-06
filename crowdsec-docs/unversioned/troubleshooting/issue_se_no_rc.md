---
title: Security Engine No Remediation Component
id: issue_se_no_rc
---

The **Security Engine No Remediation Component** issue appears when a Security Engine has no Remediation Component *(bouncer)* registered against it.

A Security Engine that detects threats but has no Remediation Component attached cannot act on its decisions — attackers are detected but **never blocked**.

## What Triggers This Issue

- **Trigger condition**: Security Engine has no Remediation Component registered
- **Criticality**: 💡 Recommended
- **Impact**: Threats are detected but no remediation action is taken — your infrastructure is not actively protected.

## Common Root Causes

- [**No Remediation Component installed**](#no-remediation-component-installed): No bouncer has been installed and registered to this Security Engine.
- [**Intentional — this Security Engine is detection-only**](#intentional--this-security-engine-is-detection-only): The absence of a local RC is deliberate and this alert can be safely ignored.

## Diagnosis & Resolution

### No Remediation Component installed

#### 🔎 Check registered bouncers

Verify which Remediation Components are currently registered with this Security Engine:

- You can check directly in the console's [Security Engine details page](/u/console/security_engines/details_page#remediation-components)
- Or via the following command line:

```bash
sudo cscli bouncers list
```

<details>
  <summary>Run this command for Docker or Kubernetes</summary>

**Docker**
```bash
docker exec crowdsec cscli bouncers list
```

**Kubernetes**
```bash
kubectl exec -n crowdsec -it $(kubectl get pods -n crowdsec -l type=lapi -o name) -- cscli bouncers list
```

</details>

If the list is empty, it confirms that no Remediation Component is registered.

#### 🛠️ Install and/or register a Remediation Component

Choose and install a Remediation Component suited to your infrastructure:

- **[cs-firewall-bouncer](https://docs.crowdsec.net/u/bouncers/firewall)** — blocks IPs at the OS firewall level (nftables/iptables)
- **[cs-nginx-bouncer](https://docs.crowdsec.net/u/bouncers/nginx)** — blocks at the NGINX web server level
- **[cs-traefik-bouncer](https://docs.crowdsec.net/u/bouncers/traefik)** — blocks at the Traefik reverse proxy level
- More options available on the [Remediation Components page](/u/bouncers/intro)

Typical Remediation Component **auto-registers** during installation, verify registration:

```bash
sudo cscli bouncers list
```

If it doesn't appear after installation follow the [**bouncer registration guide**](/u/bouncers/intro)
Don't forget to update the credentials in the bouncer config and restart it

### Intentional — this Security Engine is detection-only

If you knowingly have no Remediation Component on this Security Engine, this alert can be ignored. A few common intentional setups:

- **Remediation handled by another Security Engine**: Your bouncers are registered against a different LAPI in your infrastructure. Decisions from this SE are not automatically enforced there.

- **Perimeter protection via a Blocklist Integration**: You rely on a BLaaS integration (e.g. a firewall or CDN at the edge) for enforcement and only want this SE for detection and signal sharing. This is a valid architecture.

- **Other intentional reason** *(custom remediation pipeline, testing/staging environment, detection-only node, etc.)*: You know what you're doing — this alert does not indicate a problem.

:::tip
Did you know:  [Remediation Sync](/u/console/remediation_sync) lets you propagate decisions across all your Security Engines enrolled in the Console and to Blocklist Integrations too. It can be useful to remediate on the edge of your perimeter or make sure your SE protect each other.
:::

## Verify Resolution

After registering a Remediation Component:

1. **Check registration**:
```bash
sudo cscli bouncers list
```
The bouncer should appear with a recent **Last Pull** timestamp.

You'll also see it appear in the console's [Security Engine details page](/u/console/security_engines/details_page#remediation-components)

## Related Issues

- [Security Engine Offline](/u/troubleshooting/issue_se_offline) — If the Security Engine itself is not reporting
- [Security Engine No Alerts](/u/troubleshooting/issue_se_no_alerts) — If the Security Engine is not generating decisions to enforce

## Getting Help

If you need help choosing or installing a Remediation Component:

- Browse the [Remediation Components catalog](/u/bouncers/intro)
- Ask on [Discord](https://discord.gg/crowdsec) with your infrastructure details
- Check [Discourse](https://discourse.crowdsec.net/) for setup examples
