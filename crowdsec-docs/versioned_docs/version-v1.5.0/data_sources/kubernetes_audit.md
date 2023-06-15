---
id: kubernetes_audit
title: Kubernetes Audit
---

This module allows the `Security Engine` to expose an HTTP server that can be used by a Kubernetes cluster to send its [audit logs](https://kubernetes.io/docs/tasks/debug/debug-cluster/audit/).

## Configuration example

```yaml
source: k8s-audit
listen_addr: 127.0.0.1
listen_port: 9876
webhook_path: /webhook
labels:
 type: k8s-audit
```

Look at the `configuration parameters` to view all supported options.

## Parameters

### `listen_addr`

The address on which the datasource will listen.

Mandatory.

### `listen_port`

The port on which the datasource will liste.

Mandatory.

### `webhook_path`

The path on which the datasource will accept requests from kubernetes.

Mandatory.

### `source`

Must be `k8s-audit`

## DSN and command-line

This datasource does not support acquisition from the command line.

