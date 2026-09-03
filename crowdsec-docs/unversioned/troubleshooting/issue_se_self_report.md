---
title: Security Engine Self-Report
id: issue_se_self_report
---

The **Security Engine Self-Report** issue appears when a Security Engine sends the Console an alert or decision whose source IP is the engine itself.  
This usually means the engine is not seeing the real client IP behind a proxy, or that something running on the host is triggering scenarios against its own services.

## What Triggers This Issue

- **Trigger condition**: A decision reported by the Security Engine targets either:
  - a **loopback address** (`127.0.0.1` or `::1`), or
  - the **engine's own public IP**, as seen when the engine connects to the Central API
- **Criticality**: 🔥 Critical
- **Impact**: The engine may ban itself. Remediation Components can start dropping legitimate traffic, block access to the Local API, or lock you out of the host. The alerts are also noise that hides real attacks.

The issue is raised on the **Security Engine** that sent the decision. The alert details include the scenario, the reported source and the reason it was flagged: `loopback_source` or `source_equals_target`.

## Common Root Causes

- [**Reverse proxy or load balancer hides the client IP**](#reverse-proxy-or-load-balancer-hides-the-client-ip): The service behind the proxy only logs the proxy address, so every attacker looks like `127.0.0.1` or the host's own IP.
- [**Local monitoring, health checks or scanners**](#local-monitoring-health-checks-or-scanners): Uptime probes, vulnerability scanners or scripts running on the host trigger scenarios against its own services.
- [**Missing default whitelist**](#missing-default-whitelist): The `crowdsecurity/whitelists` parser that discards loopback and private ranges has been removed or is not installed.
- [**Manual test decision**](#manual-test-decision): A decision was added by hand with `cscli` or from the Console on the engine's own IP.

## Diagnosis & Resolution

### First, make sure the engine is not banning itself

Before investigating the root cause, remove any active decision on the engine's own addresses so remediation components stop blocking you:

```bash
sudo cscli decisions list --ip 127.0.0.1
sudo cscli decisions list --ip ::1
sudo cscli decisions list --ip <engine public IP>
```

```bash
sudo cscli decisions delete --ip 127.0.0.1
sudo cscli decisions delete --ip ::1
sudo cscli decisions delete --ip <engine public IP>
```

<details>
   <summary>Run this command for Docker or Kubernetes</summary>

Docker
```bash
docker exec crowdsec cscli decisions list --ip 127.0.0.1
docker exec crowdsec cscli decisions delete --ip 127.0.0.1
```

Kubernetes
```bash
kubectl exec -n crowdsec -it $(kubectl get pods -n crowdsec -l type=lapi -o name) -- cscli decisions list --ip 127.0.0.1
kubectl exec -n crowdsec -it $(kubectl get pods -n crowdsec -l type=lapi -o name) -- cscli decisions delete --ip 127.0.0.1
```

</details>

Then find out which scenario fired and on which log lines:

```bash
sudo cscli alerts list --ip 127.0.0.1
sudo cscli alerts inspect <alert ID> -d
```

The detailed output shows the log lines that triggered the scenario. The `source_ip`, `service` and `log_type` fields tell you which service produced them.

### Reverse proxy or load balancer hides the client IP

This is the most common cause. When a web server, application or the Local API sits behind a reverse proxy, a load balancer or a CDN, the backend logs show the proxy address instead of the client. If the proxy runs on the same host, that address is `127.0.0.1`.

#### 🔎 Check what the logs contain

Look at the raw log lines from the alert details above. If every source IP is `127.0.0.1`, `::1` or the host address, the client IP is not reaching the log.

You can also test a sample line directly:

```bash
sudo cscli explain --log "<sample log line>" --type <log type>
```

Check the `source_ip` value in the parsed output.

#### 🛠️ Forward and log the real client IP

1. Configure the proxy to send the client address, usually through the `X-Forwarded-For` or `X-Real-IP` header.
2. Configure the backend to replace the connecting address with the forwarded one before logging. With nginx use the `set_real_ip_from` and `real_ip_header` directives of the `ngx_http_realip_module`. With Apache use `mod_remoteip` with `RemoteIPHeader` and `RemoteIPTrustedProxy`.
3. If the **Local API** itself is behind a proxy, set `use_forwarded_for_headers` and `trusted_proxies` in `config.yaml`. See [Local API behind a reverse proxy](/local_api/configuration#server).

CrowdSec parsers read the client address field of the standard log formats (`remote_addr` for nginx, `%h` or `%a` for Apache). They do not read the `X-Forwarded-For` header themselves, so the real IP must already be substituted in that field when the line is written.

### Local monitoring, health checks or scanners

#### 🔎 Identify the process behind the traffic

Look at the timing and the scenario in the alert details. Regular intervals point at a probe. Bursts of many different paths point at a scanner or an audit tool. Typical culprits:

- uptime or readiness checks hitting `http://localhost/...`
- vulnerability scanners run from the host itself
- backup, deployment or CI scripts calling the service
- log replay tools or `cscli explain` sessions on production logs

#### 🛠️ Whitelist the tool, not the address

Prefer whitelisting the specific behaviour over the loopback address:

- Point the probe at a dedicated health endpoint and exclude that path in a [parser whitelist](/log_processor/whitelist/create_expr) using an expression such as `evt.Meta.http_path startsWith "/healthz"`.
- Run scanners from a known IP and add it to a [centralized allowlist](/local_api/allowlists):

```bash
sudo cscli allowlists create internal_tools -d "monitoring and scanners"
sudo cscli allowlists add internal_tools <scanner IP>
```

### Missing default whitelist

The `crowdsecurity/whitelists` parser is installed with the default collections. It discards events coming from `127.0.0.1`, `::1` and private ranges before they reach any scenario.

#### 🔎 Check the parser is installed

```bash
sudo cscli parsers list | grep whitelists
```

<details>
   <summary>Run this command for Docker or Kubernetes</summary>

```bash
docker exec crowdsec cscli parsers list | grep whitelists
```

```bash
kubectl exec -n crowdsec -it $(kubectl get pods -n crowdsec -l type=lapi -o name) -- cscli parsers list | grep whitelists
```

</details>

#### 🛠️ Install or restore it

```bash
sudo cscli parsers install crowdsecurity/whitelists
sudo systemctl reload crowdsec
```

If you removed it on purpose because you need to detect attacks from your internal network, keep it removed and rely on a narrower [whitelist](/log_processor/whitelist/create_ip) that only excludes loopback addresses.

### Manual test decision

Decisions added with `cscli decisions add`, imported with `cscli decisions import` or created from the Console are reported like any other decision. A test such as `cscli decisions add -i 127.0.0.1` raises this issue.

#### 🛠️ Remove the decision

```bash
sudo cscli decisions delete --ip 127.0.0.1
```

Use a documentation IP such as `192.0.2.1` for future tests.

## Verify Resolution

1. Confirm no decision targets the engine anymore: `sudo cscli decisions list`
2. Generate some legitimate traffic and check the source IPs are real clients: `sudo cscli alerts list -l 20`
3. Make sure your remediation components still pull decisions: `sudo cscli bouncers list`
4. The issue resolves in the Console once no new self-report is received from this engine.

## Related Issues

- [Security Engine Troubleshooting](/u/troubleshooting/security_engine) - General Security Engine issues, including [how to prevent banning a given IP](/u/troubleshooting/security_engine#how-to-add-whitelists-or-prevent-the-security-engine-from-banning-a-given-ip)
- [Security Engine Too Many Alerts](/u/troubleshooting/issue_se_too_many_alerts) - A hidden client IP can also inflate the alert count on a single address

## Getting Help

If the reported source IP is neither loopback nor your public IP, or the alerts keep coming after applying the fixes above:

- Share the output of `cscli alerts inspect <alert ID> -d` (anonymized) on [Discourse](https://discourse.crowdsec.net/)
- Ask on [Discord](https://discord.gg/crowdsec)
