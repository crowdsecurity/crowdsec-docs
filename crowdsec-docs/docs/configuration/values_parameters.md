---
title: Helm's Parameters
id: values_parameters
---

# Values parameters reference

This page provides a complete, generated reference of all Helm chart
configuration values, their defaults, and their purpose.

## Parameters

### Global

| Name                | Description                                       | Value       |
| ------------------- | ------------------------------------------------- | ----------- | -------- |
| `container_runtime` | [string] for raw logs format: json or cri (docker | containerd) | `docker` |

### Image

| Name                | Description                                               | Value                    |
| ------------------- | --------------------------------------------------------- | ------------------------ |
| `image.repository`  | [string] docker image repository name                     | `crowdsecurity/crowdsec` |
| `image.pullPolicy`  | [string] Image pull policy (Always, IfNotPresent, Never)  | `IfNotPresent`           |
| `image.pullSecrets` | Image pull secrets (array of objects with a 'name' field) | `[]`                     |
| `image.tag`         | docker image tag (empty defaults to chart AppVersion)     | `""`                     |
| `podAnnotations`    | podAnnotations to be added to pods (string:string map)    | `{}`                     |
| `podLabels`         | Labels to be added to pods (string:string map)            | `{}`                     |

### Configuration

| Name                                         | Description                                                                                                                         | Value   |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `config.parsers.s00-raw`                     | First step custom parsers definitions, usually used to label logs                                                                   | `{}`    |
| `config.parsers.s01-parse`                   | Second step custom parsers definitions, usually to normalize logs into events                                                       | `{}`    |
| `config.parsers.s02-enrich`                  | Third step custom parsers definitions, usually to enrich events                                                                     | `{}`    |
| `config.scenarios`                           | Custom raw scenarios definition see https://docs.crowdsec.net/docs/next/log_processor/scenarios/intro                               | `{}`    |
| `config.postoverflows.s00-enrich`            | First step custom postoverflows definitions, usually used to enrich overflow events                                                 | `{}`    |
| `config.postoverflows.s01-whitelist`         | Second step custom postoverflows definitions, usually used to whitelist events                                                      | `{}`    |
| `config.simulation.yaml`                     | This file is usually handled by the agent.                                                                                          | `""`    |
| `config.console.yaml`                        | This file is usually handled by the agent.                                                                                          | `""`    |
| `config.capi_whitelists.yaml`                | This file is deprecated in favor of centralized allowlists see https://docs.crowdsec.net/docs/next/local_api/centralized_allowlists | `""`    |
| `config.profiles.yaml`                       | Use for defining custom profiles                                                                                                    | `""`    |
| `config.config.yaml.local`                   | main configuration file local overriden values. This is merged with main configuration file.                                        | `""`    |
| `config.notifications`                       | notification on alert configuration                                                                                                 | `{}`    |
| `config.agent_config.yaml.local`             | This configuration file is merged with agent pod main configuration file                                                            | `""`    |
| `config.appsec_config.yaml.local`            | This configuration file is merged with appsec pod main configuration file                                                           | `""`    |
| `tls.enabled`                                | Is tls enabled ?                                                                                                                    | `false` |
| `tls.caBundle`                               | pem format CA collection                                                                                                            | `true`  |
| `tls.insecureSkipVerify`                     |                                                                                                                                     | `false` |
| `tls.certManager`                            | Use of a cluster certManager configuration                                                                                          | `{}`    |
| `tls.certManager.enabled`                    | Use of a cluster cert manager                                                                                                       | `true`  |
| `tls.certManager.secretTemplate`             | secret configuration                                                                                                                | `{}`    |
| `tls.certManager.secretTemplate.annotations` | add annotation to generated secret                                                                                                  | `{}`    |
| `tls.certManager.secretTemplate.labels`      | add annotation to generated labels                                                                                                  | `{}`    |
| `tls.certManager.duration`                   | validity duration of certificate (golang duration string)                                                                           | `""`    |
| `tls.certManager.renewBefore`                | duration before a certificate’s expiry when cert-manager should start renewing it.                                                  | `""`    |
| `tls.bouncer.secret`                         | Name of the Kubernetes Secret containing TLS materials for the bouncer                                                              | `""`    |
| `tls.bouncer.reflector.namespaces`           | List of namespaces from which the bouncer will watch and sync Secrets/ConfigMaps.                                                   | `[]`    |
| `tls.agent.tlsClientAuth`                    | Enables mutual TLS authentication for the agent when connecting to LAPI.                                                            | `true`  |
| `tls.agent.secret`                           | Name of the Secret holding the agent’s TLS certificate and key.                                                                     | `""`    |
| `tls.agent.reflector.namespaces`             | Namespaces where the agent’s TLS Secret can be reflected/synced.                                                                    | `[]`    |
| `tls.appsec.tlsClientAuth`                   | Enables mutual TLS authentication for the agent when connecting to LAPI.                                                            | `true`  |
| `tls.appsec.secret`                          | Name of the Secret holding the agent’s TLS certificate and key.                                                                     | `""`    |
| `tls.appsec.reflector.namespaces`            | Namespaces where the agent’s TLS Secret can be reflected/synced.                                                                    | `[]`    |
| `tls.lapi.secret`                            | Name of the Secret holding the lapidary's’s TLS certificate and key.                                                                | `""`    |
| `tls.lapi.reflector.namespaces`              | Namespaces where the LAPI TLS Secret can be reflected/synced.                                                                       | `[]`    |

### secrets

| Name                                          | Description                                                                                                 | Value |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ----- |
| `secrets.username`                            | Agent username (default is generated randomly)                                                              | `""`  |
| `secrets.password`                            | Agent password (default is generated randomly)                                                              | `""`  |
| `secrets.externalSecret.name`                 | Name of the external secret to use (overrides lapi.secrets.csLapiSecret and lapi.secrets.registrationToken) | `""`  |
| `secrets.externalSecret.csLapiSecretKey`      | The key in the external secret that holds the csLapiSecret                                                  | `""`  |
| `secrets.externalSecret.registrationTokenKey` | The key in the external secret that holds the registrationToken                                             | `""`  |

### lapi

| Name                                            | Description                                                                            | Value               |
| ----------------------------------------------- | -------------------------------------------------------------------------------------- | ------------------- |
| `lapi.enabled`                                  | Enable LAPI deployment (enabled by default)                                            | `true`              |
| `lapi.replicas`                                 | Number of replicas for the Local API                                                   | `1`                 |
| `lapi.env`                                      | Extra environment variables passed to the crowdsecurity/crowdsec container             | `[]`                |
| `lapi.envFrom`                                  | Environment variables loaded from Kubernetes Secrets or ConfigMaps                     | `[]`                |
| `lapi.ingress.enabled`                          | Enable ingress for the LAPI service                                                    | `false`             |
| `lapi.ingress.annotations`                      | Annotations to apply to the LAPI ingress object                                        | `{}`                |
| `lapi.ingress.ingressClassName`                 | IngressClass name for the LAPI ingress                                                 | `""`                |
| `lapi.ingress.host`                             | Hostname for the LAPI ingress                                                          | `""`                |
| `lapi.priorityClassName`                        | Pod priority class name                                                                | `""`                |
| `lapi.deployAnnotations`                        | Annotations applied to the LAPI Deployment                                             | `{}`                |
| `lapi.podAnnotations`                           | Annotations applied to LAPI pods                                                       | `{}`                |
| `lapi.podLabels`                                | Labels applied to LAPI pods                                                            | `{}`                |
| `lapi.extraInitContainers`                      | Additional init containers for LAPI pods                                               | `[]`                |
| `lapi.extraVolumes`                             | Additional volumes for LAPI pods                                                       | `[]`                |
| `lapi.extraVolumeMounts`                        | Additional volumeMounts for LAPI pods                                                  | `[]`                |
| `lapi.resources`                                | Resource requests and limits for the LAPI pods                                         | `{}`                |
| `lapi.persistentVolume.data.enabled`            | Enable persistent volume for the data folder (stores bouncer API keys)                 | `true`              |
| `lapi.persistentVolume.data.accessModes`        | Access modes for the data PVC                                                          | `["ReadWriteOnce"]` |
| `lapi.persistentVolume.data.storageClassName`   | StorageClass name for the data PVC                                                     | `""`                |
| `lapi.persistentVolume.data.existingClaim`      | Existing PersistentVolumeClaim to use for the data PVC                                 | `""`                |
| `lapi.persistentVolume.data.subPath`            | subPath to use within the volume                                                       | `""`                |
| `lapi.persistentVolume.data.size`               | Requested size for the data PVC                                                        | `""`                |
| `lapi.persistentVolume.config.enabled`          | Enable persistent volume for the config folder (stores API credentials)                | `true`              |
| `lapi.persistentVolume.config.accessModes`      | Access modes for the config PVC                                                        | `["ReadWriteOnce"]` |
| `lapi.persistentVolume.config.storageClassName` | StorageClass name for the config PVC                                                   | `""`                |
| `lapi.persistentVolume.config.existingClaim`    | Existing PersistentVolumeClaim to use for the config PVC                               | `""`                |
| `lapi.persistentVolume.config.subPath`          | subPath to use within the volume                                                       | `""`                |
| `lapi.persistentVolume.config.size`             | Requested size for the config PVC                                                      | `""`                |
| `lapi.service`                                  | Configuration of kubernetes lapi service                                               | `{}`                |
| `lapi.service.type`                             | Kubernetes service type for LAPI                                                       | `""`                |
| `lapi.service.labels`                           | Extra labels to add to the LAPI service                                                | `{}`                |
| `lapi.service.annotations`                      | Extra annotations to add to the LAPI service                                           | `{}`                |
| `lapi.service.externalIPs`                      | List of external IPs for the LAPI service                                              | `[]`                |
| `lapi.service.loadBalancerIP`                   | Specific loadBalancer IP for the LAPI service                                          | `nil`               |
| `lapi.service.loadBalancerClass`                | LoadBalancer class for the LAPI service                                                | `nil`               |
| `lapi.service.externalTrafficPolicy`            | External traffic policy for the LAPI service                                           | `""`                |
| `lapi.nodeSelector`                             | Node selector for scheduling LAPI pods                                                 | `{}`                |
| `lapi.tolerations`                              | Tolerations for scheduling LAPI pods                                                   | `[]`                |
| `lapi.dnsConfig`                                | DNS configuration for LAPI pods                                                        | `{}`                |
| `lapi.affinity`                                 | Affinity rules for LAPI pods                                                           | `{}`                |
| `lapi.topologySpreadConstraints`                | Topology spread constraints for LAPI pods                                              | `[]`                |
| `lapi.metrics.enabled`                          | Enable service monitoring for Prometheus (exposes port 6060)                           | `true`              |
| `lapi.metrics.serviceMonitor.enabled`           | [object] Create a ServiceMonitor resource for Prometheus                               | `true`              |
| `lapi.metrics.serviceMonitor.additionalLabels`  | Extra labels for the ServiceMonitor                                                    | `{}`                |
| `lapi.metrics.podMonitor.enabled`               | Enables prometheus operator podMonitor                                                 | `false`             |
| `lapi.metrics.podMonitor.additionalLabels`      | additional labels for podMonitor                                                       | `{}`                |
| `lapi.strategy.type`                            | Deployment strategy for the LAPI deployment                                            | `""`                |
| `lapi.secrets.csLapiSecret`                     | Shared LAPI secret (randomly generated if not specified, must be >64 chars)            | `""`                |
| `lapi.secrets.registrationToken`                | Registration token for AppSec (randomly generated if not specified, must be >48 chars) | `""`                |
| `lapi.extraSecrets`                             | Additional secrets to inject (e.g., external DB password)                              | `{}`                |
| `lapi.lifecycle`                                | Lifecycle hooks for LAPI pods (postStart, preStop, etc.)                               | `{}`                |
| `lapi.storeCAPICredentialsInSecret`             | [object] Store Central API credentials in a Secret (required if LAPI replicas > 1)     | `false`             |

### agent

| Name                                             | Description                                                                                | Value   |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------ | ------- |
| `agent.enabled`                                  | [object] Enable CrowdSec agent (enabled by default)                                        | `true`  |
| `agent.isDeployment`                             | [object] Deploy agent as a Deployment instead of a DaemonSet                               | `false` |
| `agent.serviceAccountName`                       | Service account name for the agent pods                                                    | `""`    |
| `agent.lapiURL`                                  | URL of the LAPI for the agent to connect to (defaults to internal service URL)             | `""`    |
| `agent.lapiHost`                                 | Host of the LAPI for the agent to connect to                                               | `""`    |
| `agent.lapiPort`                                 | Port of the LAPI for the agent to connect to                                               | `8080`  |
| `agent.replicas`                                 | Number of replicas when deploying as a Deployment                                          | `1`     |
| `agent.strategy`                                 | Deployment strategy when `isDeployment` is true                                            | `{}`    |
| `agent.ports`                                    | Custom container ports to expose (default: metrics port 6060 if enabled)                   | `[]`    |
| `agent.additionalAcquisition`                    | Extra log acquisition sources (see https://docs.crowdsec.net/docs/next/data_sources/intro) | `[]`    |
| `agent.acquisition`                              | Pod log acquisition definitions (namespace, podName, program, etc.)                        | `[]`    |
| `agent.priorityClassName`                        | Priority class name for agent pods                                                         | `""`    |
| `agent.daemonsetAnnotations`                     | Annotations applied to the agent DaemonSet                                                 | `{}`    |
| `agent.deploymentAnnotations`                    | Annotations applied to the agent Deployment                                                | `{}`    |
| `agent.podAnnotations`                           | Annotations applied to agent pods                                                          | `{}`    |
| `agent.podLabels`                                | Labels applied to agent pods                                                               | `{}`    |
| `agent.extraInitContainers`                      | Extra init containers for agent pods                                                       | `[]`    |
| `agent.extraVolumes`                             | Extra volumes for agent pods                                                               | `[]`    |
| `agent.extraVolumeMounts`                        | Extra volume mounts for agent pods                                                         | `[]`    |
| `agent.resources`                                | Resource requests and limits for agent pods                                                | `{}`    |
| `agent.persistentVolume.config.enabled`          | [object] Enable persistent volume for agent config                                         | `false` |
| `agent.persistentVolume.config.accessModes`      | Access modes for the config PVC                                                            | `[]`    |
| `agent.persistentVolume.config.storageClassName` | StorageClass name for the config PVC                                                       | `""`    |
| `agent.persistentVolume.config.existingClaim`    | Existing PVC name to use for config                                                        | `""`    |
| `agent.persistentVolume.config.subPath`          | subPath to use within the volume                                                           | `""`    |
| `agent.persistentVolume.config.size`             | Requested size for the config PVC                                                          | `""`    |
| `agent.hostVarLog`                               | [object] Mount hostPath `/var/log` into the agent pod                                      | `true`  |
| `agent.env`                                      | Environment variables passed to the crowdsecurity/crowdsec container                       | `[]`    |
| `agent.nodeSelector`                             | Node selector for agent pods                                                               | `{}`    |
| `agent.tolerations`                              | Tolerations for scheduling agent pods                                                      | `[]`    |
| `agent.affinity`                                 | Affinity rules for agent pods                                                              | `{}`    |
| `agent.livenessProbe`                            | Liveness probe configuration for agent pods                                                | `{}`    |
| `agent.readinessProbe`                           | Readiness probe configuration for agent pods                                               | `{}`    |
| `agent.startupProbe`                             | Startup probe configuration for agent pods                                                 | `{}`    |
| `agent.metrics.enabled`                          | Enable service monitoring for Prometheus (exposes port 6060)                               | `true`  |
| `agent.metrics.serviceMonitor.enabled`           | Create a ServiceMonitor resource for Prometheus                                            | `false` |
| `agent.metrics.serviceMonitor.additionalLabels`  | Extra labels for the ServiceMonitor                                                        | `{}`    |
| `agent.metrics.podMonitor.enabled`               | Create a PodMonitor resource for Prometheus                                                | `false` |
| `agent.metrics.podMonitor.additionalLabels`      | Extra labels for the PodMonitor                                                            | `{}`    |
| `agent.service.type`                             | Kubernetes Service type for agent                                                          | `""`    |
| `agent.service.labels`                           | Labels applied to the agent Service                                                        | `{}`    |
| `agent.service.annotations`                      | Annotations applied to the agent Service                                                   | `{}`    |
| `agent.service.externalIPs`                      | External IPs assigned to the agent Service                                                 | `[]`    |
| `agent.service.loadBalancerIP`                   | Fixed LoadBalancer IP for the agent Service                                                | `nil`   |
| `agent.service.loadBalancerClass`                | LoadBalancer class for the agent Service                                                   | `nil`   |
| `agent.service.externalTrafficPolicy`            | External traffic policy for the agent Service                                              | `""`    |
| `agent.service.ports`                            | Custom service ports (default: metrics port 6060 if enabled)                               | `[]`    |
| `agent.wait_for_lapi.image.repository`           | Repository for the wait-for-lapi init container image                                      | `""`    |
| `agent.wait_for_lapi.image.pullPolicy`           | Image pull policy for the wait-for-lapi init container                                     | `""`    |
| `agent.wait_for_lapi.image.tag`                  | Image tag for the wait-for-lapi init container                                             | `""`    |
| `appsec.enabled`                                 | [object] Enable AppSec component (disabled by default)                                     | `false` |
| `appsec.lapiURL`                                 | URL the AppSec component uses to reach LAPI (defaults to internal service URL)             | `""`    |
| `appsec.lapiHost`                                | Hostname the AppSec component uses to reach LAPI                                           | `""`    |
| `appsec.lapiPort`                                | Port the AppSec component uses to reach LAPI                                               | `8080`  |
| `appsec.replicas`                                | Number of replicas for the AppSec Deployment                                               | `1`     |
| `appsec.strategy`                                | Deployment strategy for AppSec                                                             | `{}`    |
| `appsec.acquisitions`                            | AppSec acquisitions (datasource listeners), e.g. appsec listener on 7422                   | `[]`    |
| `appsec.configs`                                 | AppSec configs (key = filename, value = file content)                                      | `{}`    |
| `appsec.rules`                                   | AppSec rule files (key = filename, value = file content)                                   | `{}`    |
| `appsec.priorityClassName`                       | Priority class name for AppSec pods                                                        | `""`    |
| `appsec.deployAnnotations`                       | Annotations added to the AppSec Deployment                                                 | `{}`    |
| `appsec.podAnnotations`                          | Annotations added to AppSec pods                                                           | `{}`    |
| `appsec.podLabels`                               | Labels added to AppSec pods                                                                | `{}`    |
| `appsec.extraInitContainers`                     | Extra init containers for AppSec pods                                                      | `[]`    |
| `appsec.extraVolumes`                            | Extra volumes for AppSec pods                                                              | `[]`    |
| `appsec.extraVolumeMounts`                       | Extra volume mounts for AppSec pods                                                        | `[]`    |
| `appsec.resources`                               | Resource requests and limits for AppSec pods                                               | `{}`    |
| `appsec.env`                                     | Environment variables for the AppSec container (collections/configs/rules toggles, etc.)   | `[]`    |
| `appsec.nodeSelector`                            | Node selector for scheduling AppSec pods                                                   | `{}`    |
| `appsec.tolerations`                             | Tolerations for scheduling AppSec pods                                                     | `[]`    |
| `appsec.affinity`                                | Affinity rules for scheduling AppSec pods                                                  | `{}`    |
| `appsec.livenessProbe`                           | Liveness probe configuration for AppSec pods                                               | `{}`    |
| `appsec.readinessProbe`                          | Readiness probe configuration for AppSec pods                                              | `{}`    |
| `appsec.startupProbe`                            | Startup probe configuration for AppSec pods                                                | `{}`    |
| `appsec.metrics.enabled`                         | Enable service monitoring (exposes metrics on 6060; AppSec listener typically 7422)        | `true`  |
| `appsec.metrics.serviceMonitor.enabled`          | Create a ServiceMonitor for Prometheus scraping                                            | `false` |
| `appsec.metrics.serviceMonitor.additionalLabels` | Extra labels for the ServiceMonitor                                                        | `{}`    |
| `appsec.metrics.podMonitor.enabled`              | Create a PodMonitor for Prometheus scraping                                                | `false` |
| `appsec.metrics.podMonitor.additionalLabels`     | Extra labels for the PodMonitor                                                            | `{}`    |
| `appsec.service.type`                            | Kubernetes Service type for AppSec                                                         | `""`    |
| `appsec.service.labels`                          | Additional labels for the AppSec Service                                                   | `{}`    |
| `appsec.service.annotations`                     | Annotations to apply to the LAPI ingress object                                            | `{}`    |
| `appsec.service.externalIPs`                     | External IPs for the AppSec Service                                                        | `[]`    |
| `appsec.service.loadBalancerIP`                  | Fixed LoadBalancer IP for the AppSec Service                                               | `nil`   |
| `appsec.service.loadBalancerClass`               | LoadBalancer class for the AppSec Service                                                  | `nil`   |
| `appsec.service.externalTrafficPolicy`           | External traffic policy for the AppSec Service                                             | `""`    |
| `appsec.wait_for_lapi.image.repository`          | Repository for the wait-for-lapi init con                                                  | `""`    |
| `appsec.wait_for_lapi.image.pullPolicy`          | Image pull policy for the wait-for-lapi init container                                     | `""`    |
| `appsec.wait_for_lapi.image.tag`                 | Image tag for the wait-for-lapi init container                                             | `1.28`  |
