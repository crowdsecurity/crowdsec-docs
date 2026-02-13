---
id: kubernetes
title: Kubernetes
---

This module allows the `Security Engine` to stream container logs from pods running in a Kubernetes cluster via the Kubernetes API. It only operates in streaming (`tail`) mode: when a pod matching the selector starts or restarts, the datasource follows every container's stdout/stderr until the pod disappears.

## Configuration example

### Running inside the cluster

```yaml
source: kubernetes
namespace: crowdsec
selector: "app=crowdsec-agent"
labels:
  type: crowdsec
```

### Using a kubeconfig file

```yaml
source: kubernetes
namespace: ingress-nginx
selector: "app.kubernetes.io/name=ingress-nginx"
kube_config: /etc/rancher/k3s/k3s.yaml
kube_context: production
labels:
  type: nginx
```

Look at the `configuration parameters` to view all supported options.

## Parameters

### `selector`

Label selector applied to pods in the target namespace. Supports the standard Kubernetes selector syntax (for example `app=caddy`, `component in (frontend,backend)` or `app!=nginx`); see the [Kubernetes documentation](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#label-selectors) for the full grammar. This field is mandatory and prevents the datasource from tailling every pod in the namespace.

### `namespace`

Namespace that contains the pods you want to follow. Defaults to `default`. Define multiple datasource entries if you need to cover several namespaces.

### `kube_config`

Path to a kubeconfig file to use when the agent runs outside the cluster. Defaults to `~/.kube/config`. The datasource always tries to use the in-cluster service-account first and only reads the kubeconfig file when in-cluster credentials are not available.

### `kube_context`

Optional name of the kubeconfig context to load (falls back to the kubeconfig current-context when omitted). Only used together with `kube_config`.

### `labels`

Labels attached to the emitted events. As with other datasources, the `type` label is required so that CrowdSec can pick the matching parser/collection.

### `source`

Must be `kubernetes`.

### `mode`

Only the `tail` mode is supported.

:::note
The CrowdSec service account (or user provided in the kubeconfig) must be allowed to `list`, `watch` and `get` pods as well as `get` pod logs (`pods/log`) in each namespace you configure.
:::

## DSN and command-line

This datasource does not support acquisition from the command line.
