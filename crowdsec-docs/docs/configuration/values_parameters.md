---
title: Helm's Parameters
id: values_parameters
---

# Values parameters reference

This page provides a complete, generated reference of all Helm chart
configuration values, their defaults, and their purpose.

## Parameters

### Global

| Name                | Description                                        | Value    |
| ------------------- | -------------------------------------------------- | -------- |
| `container_runtime`<a id="container_runtime"></a> | [string] for raw logs format: docker or containerd | `docker` |

### Image

| Name                | Description                                               | Value                    |
| ------------------- | --------------------------------------------------------- | ------------------------ |
| `image.repository`<a id="image-repository"></a>  | [string] docker image repository name                     | `crowdsecurity/crowdsec` |
| `image.pullPolicy`<a id="image-pullpolicy"></a>  | [string] Image pull policy (Always, IfNotPresent, Never)  | `IfNotPresent`           |
| `image.pullSecrets`<a id="image-pullsecrets"></a> | Image pull secrets (array of objects with a 'name' field) | `[]`                     |
| `image.tag`<a id="image-tag"></a>         | docker image tag (empty defaults to chart AppVersion)     | `""`                     |
| `podAnnotations`<a id="podannotations"></a>    | podAnnotations to be added to pods (string:string map)    | `{}`                     |
| `podLabels`<a id="podlabels"></a>         | Labels to be added to pods (string:string map)            | `{}`                     |

### Configuration

| Name                                         | Description                                                                                                                         | Value   |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `config.parsers.s00-raw`<a id="config-parsers-s00-raw"></a>                     | First step custom parsers definitions, usually used to label logs                                                                   | `{}`    |
| `config.parsers.s01-parse`<a id="config-parsers-s01-parse"></a>                   | Second step custom parsers definitions, usually to normalize logs into events                                                       | `{}`    |
| `config.parsers.s02-enrich`<a id="config-parsers-s02-enrich"></a>                  | Third step custom parsers definitions, usually to enrich events                                                                     | `{}`    |
| `config.scenarios`<a id="config-scenarios"></a>                           | Custom raw scenarios definition see https://docs.crowdsec.net/docs/next/log_processor/scenarios/intro                               | `{}`    |
| `config.postoverflows.s00-enrich`<a id="config-postoverflows-s00-enrich"></a>            | First step custom postoverflows definitions, usually used to enrich overflow events                                                 | `{}`    |
| `config.postoverflows.s01-whitelist`<a id="config-postoverflows-s01-whitelist"></a>         | Second step custom postoverflows definitions, usually used to whitelist events                                                      | `{}`    |
| `config.simulation.yaml`<a id="config-simulation-yaml"></a>                     | This file is usually handled by the agent.                                                                                          | `""`    |
| `config.console.yaml`<a id="config-console-yaml"></a>                        | This file is usually handled by the agent.                                                                                          | `""`    |
| `config.capi_whitelists.yaml`<a id="config-capi_whitelists-yaml"></a>                | This file is deprecated in favor of centralized allowlists see https://docs.crowdsec.net/docs/next/local_api/centralized_allowlists | `""`    |
| `config.profiles.yaml`<a id="config-profiles-yaml"></a>                       | Use for defining custom profiles                                                                                                    | `""`    |
| `config.config.yaml.local`<a id="config-config-yaml-local"></a>                   | main configuration file local overriden values. This is merged with main configuration file.                                        | `""`    |
| `config.notifications`<a id="config-notifications"></a>                       | notification on alert configuration                                                                                                 | `{}`    |
| `config.agent_config.yaml.local`<a id="config-agent_config-yaml-local"></a>             | This configuration file is merged with agent pod main configuration file                                                            | `""`    |
| `config.appsec_config.yaml.local`<a id="config-appsec_config-yaml-local"></a>            | This configuration file is merged with appsec pod main configuration file                                                           | `""`    |
| `tls.enabled`<a id="tls-enabled"></a>                                | Is tls enabled ?                                                                                                                    | `false` |
| `tls.caBundle`<a id="tls-cabundle"></a>                               | pem format CA collection                                                                                                            | `true`  |
| `tls.insecureSkipVerify`<a id="tls-insecureskipverify"></a>                     |                                                                                                                                     | `false` |
| `tls.certManager`<a id="tls-certmanager"></a>                            | Use of a cluster certManager configuration                                                                                          | `{}`    |
| `tls.certManager.enabled`<a id="tls-certmanager-enabled"></a>                    | Use of a cluster cert manager                                                                                                       | `true`  |
| `tls.certManager.secretTemplate`<a id="tls-certmanager-secrettemplate"></a>             | secret configuration                                                                                                                | `{}`    |
| `tls.certManager.secretTemplate.annotations`<a id="tls-certmanager-secrettemplate-annotations"></a> | add annotation to generated secret                                                                                                  | `{}`    |
| `tls.certManager.secretTemplate.labels`<a id="tls-certmanager-secrettemplate-labels"></a>      | add annotation to generated labels                                                                                                  | `{}`    |
| `tls.certManager.duration`<a id="tls-certmanager-duration"></a>                   | validity duration of certificate (golang duration string)                                                                           | `""`    |
| `tls.certManager.renewBefore`<a id="tls-certmanager-renewbefore"></a>                | duration before a certificate’s expiry when cert-manager should start renewing it.                                                  | `""`    |
| `tls.bouncer.secret`<a id="tls-bouncer-secret"></a>                         | Name of the Kubernetes Secret containing TLS materials for the bouncer                                                              | `""`    |
| `tls.bouncer.reflector.namespaces`<a id="tls-bouncer-reflector-namespaces"></a>           | List of namespaces from which the bouncer will watch and sync Secrets/ConfigMaps.                                                   | `[]`    |
| `tls.agent.tlsClientAuth`<a id="tls-agent-tlsclientauth"></a>                    | Enables mutual TLS authentication for the agent when connecting to LAPI.                                                            | `true`  |
| `tls.agent.secret`<a id="tls-agent-secret"></a>                           | Name of the Secret holding the agent’s TLS certificate and key.                                                                     | `""`    |
| `tls.agent.reflector.namespaces`<a id="tls-agent-reflector-namespaces"></a>             | Namespaces where the agent’s TLS Secret can be reflected/synced.                                                                    | `[]`    |
| `tls.appsec.tlsClientAuth`<a id="tls-appsec-tlsclientauth"></a>                   | Enables mutual TLS authentication for the agent when connecting to LAPI.                                                            | `true`  |
| `tls.appsec.secret`<a id="tls-appsec-secret"></a>                          | Name of the Secret holding the agent’s TLS certificate and key.                                                                     | `""`    |
| `tls.appsec.reflector.namespaces`<a id="tls-appsec-reflector-namespaces"></a>            | Namespaces where the agent’s TLS Secret can be reflected/synced.                                                                    | `[]`    |
| `tls.lapi.secret`<a id="tls-lapi-secret"></a>                            | Name of the Secret holding the lapidary's’s TLS certificate and key.                                                                | `""`    |
| `tls.lapi.reflector.namespaces`<a id="tls-lapi-reflector-namespaces"></a>              | Namespaces where the LAPI TLS Secret can be reflected/synced.                                                                       | `[]`    |

### secrets

| Name                                          | Description                                                                                                 | Value |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ----- |
| `secrets.username`<a id="secrets-username"></a>                            | Agent username (default is generated randomly)                                                              | `""`  |
| `secrets.password`<a id="secrets-password"></a>                            | Agent password (default is generated randomly)                                                              | `""`  |
| `secrets.externalSecret.name`<a id="secrets-externalsecret-name"></a>                 | Name of the external secret to use (overrides lapi.secrets.csLapiSecret and lapi.secrets.registrationToken) | `""`  |
| `secrets.externalSecret.csLapiSecretKey`<a id="secrets-externalsecret-cslapisecretkey"></a>      | The key in the external secret that holds the csLapiSecret                                                  | `""`  |
| `secrets.externalSecret.registrationTokenKey`<a id="secrets-externalsecret-registrationtokenkey"></a> | The key in the external secret that holds the registrationToken                                             | `""`  |

### lapi

| Name                                            | Description                                                                                                               | Value               |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `lapi.enabled`<a id="lapi-enabled"></a>                                  | Enable LAPI deployment (enabled by default)                                                                               | `true`              |
| `lapi.replicas`<a id="lapi-replicas"></a>                                 | Number of replicas for the Local API                                                                                      | `1`                 |
| `lapi.env`<a id="lapi-env"></a>                                      | Extra environment variables passed to the crowdsecurity/crowdsec container                                                | `[]`                |
| `lapi.envFrom`<a id="lapi-envfrom"></a>                                  | Environment variables loaded from Kubernetes Secrets or ConfigMaps                                                        | `[]`                |
| `lapi.ingress.enabled`<a id="lapi-ingress-enabled"></a>                          | Enable ingress for the LAPI service                                                                                       | `false`             |
| `lapi.ingress.annotations`<a id="lapi-ingress-annotations"></a>                      | Annotations to apply to the LAPI ingress object                                                                           | `{}`                |
| `lapi.ingress.ingressClassName`<a id="lapi-ingress-ingressclassname"></a>                 | IngressClass name for the LAPI ingress                                                                                    | `""`                |
| `lapi.ingress.host`<a id="lapi-ingress-host"></a>                             | Hostname for the LAPI ingress                                                                                             | `""`                |
| `lapi.priorityClassName`<a id="lapi-priorityclassname"></a>                        | Pod priority class name                                                                                                   | `""`                |
| `lapi.deployAnnotations`<a id="lapi-deployannotations"></a>                        | Annotations applied to the LAPI Deployment                                                                                | `{}`                |
| `lapi.podAnnotations`<a id="lapi-podannotations"></a>                           | Annotations applied to LAPI pods                                                                                          | `{}`                |
| `lapi.podLabels`<a id="lapi-podlabels"></a>                                | Labels applied to LAPI pods                                                                                               | `{}`                |
| `lapi.extraInitContainers`<a id="lapi-extrainitcontainers"></a>                      | Additional init containers for LAPI pods                                                                                  | `[]`                |
| `lapi.extraVolumes`<a id="lapi-extravolumes"></a>                             | Additional volumes for LAPI pods                                                                                          | `[]`                |
| `lapi.extraVolumeMounts`<a id="lapi-extravolumemounts"></a>                        | Additional volumeMounts for LAPI pods                                                                                     | `[]`                |
| `lapi.resources`<a id="lapi-resources"></a>                                | Resource requests and limits for the LAPI pods                                                                            | `{}`                |
| `lapi.persistentVolume.data.enabled`<a id="lapi-persistentvolume-data-enabled"></a>            | Enable persistent volume for the data folder (stores bouncer API keys)                                                    | `true`              |
| `lapi.persistentVolume.data.accessModes`<a id="lapi-persistentvolume-data-accessmodes"></a>        | Access modes for the data PVC                                                                                             | `["ReadWriteOnce"]` |
| `lapi.persistentVolume.data.storageClassName`<a id="lapi-persistentvolume-data-storageclassname"></a>   | StorageClass name for the data PVC                                                                                        | `""`                |
| `lapi.persistentVolume.data.existingClaim`<a id="lapi-persistentvolume-data-existingclaim"></a>      | Existing PersistentVolumeClaim to use for the data PVC                                                                    | `""`                |
| `lapi.persistentVolume.data.subPath`<a id="lapi-persistentvolume-data-subpath"></a>            | subPath to use within the volume                                                                                          | `""`                |
| `lapi.persistentVolume.data.size`<a id="lapi-persistentvolume-data-size"></a>               | Requested size for the data PVC                                                                                           | `""`                |
| `lapi.persistentVolume.config.enabled`<a id="lapi-persistentvolume-config-enabled"></a>          | Enable persistent volume for the config folder (stores API credentials)                                                   | `true`              |
| `lapi.persistentVolume.config.accessModes`<a id="lapi-persistentvolume-config-accessmodes"></a>      | Access modes for the config PVC                                                                                           | `["ReadWriteOnce"]` |
| `lapi.persistentVolume.config.storageClassName`<a id="lapi-persistentvolume-config-storageclassname"></a> | StorageClass name for the config PVC                                                                                      | `""`                |
| `lapi.persistentVolume.config.existingClaim`<a id="lapi-persistentvolume-config-existingclaim"></a>    | Existing PersistentVolumeClaim to use for the config PVC                                                                  | `""`                |
| `lapi.persistentVolume.config.subPath`<a id="lapi-persistentvolume-config-subpath"></a>          | subPath to use within the volume                                                                                          | `""`                |
| `lapi.persistentVolume.config.size`<a id="lapi-persistentvolume-config-size"></a>             | Requested size for the config PVC                                                                                         | `""`                |
| `lapi.service`<a id="lapi-service"></a>                                  | Configuration of kubernetes lapi service                                                                                  | `{}`                |
| `lapi.service.type`<a id="lapi-service-type"></a>                             | Kubernetes service type for LAPI                                                                                          | `""`                |
| `lapi.service.labels`<a id="lapi-service-labels"></a>                           | Extra labels to add to the LAPI service                                                                                   | `{}`                |
| `lapi.service.annotations`<a id="lapi-service-annotations"></a>                      | Extra annotations to add to the LAPI service                                                                              | `{}`                |
| `lapi.service.externalIPs`<a id="lapi-service-externalips"></a>                      | List of external IPs for the LAPI service                                                                                 | `[]`                |
| `lapi.service.loadBalancerIP`<a id="lapi-service-loadbalancerip"></a>                   | Specific loadBalancer IP for the LAPI service                                                                             | `nil`               |
| `lapi.service.loadBalancerClass`<a id="lapi-service-loadbalancerclass"></a>                | LoadBalancer class for the LAPI service                                                                                   | `nil`               |
| `lapi.service.externalTrafficPolicy`<a id="lapi-service-externaltrafficpolicy"></a>            | External traffic policy for the LAPI service                                                                              | `""`                |
| `lapi.nodeSelector`<a id="lapi-nodeselector"></a>                             | Node selector for scheduling LAPI pods                                                                                    | `{}`                |
| `lapi.tolerations`<a id="lapi-tolerations"></a>                              | Tolerations for scheduling LAPI pods                                                                                      | `[]`                |
| `lapi.dnsConfig`<a id="lapi-dnsconfig"></a>                                | DNS configuration for LAPI pods                                                                                           | `{}`                |
| `lapi.affinity`<a id="lapi-affinity"></a>                                 | Affinity rules for LAPI pods                                                                                              | `{}`                |
| `lapi.topologySpreadConstraints`<a id="lapi-topologyspreadconstraints"></a>                | Topology spread constraints for LAPI pods                                                                                 | `[]`                |
| `lapi.metrics.enabled`<a id="lapi-metrics-enabled"></a>                          | Enable service monitoring for Prometheus (exposes port 6060)                                                              | `true`              |
| `lapi.metrics.serviceMonitor.enabled`<a id="lapi-metrics-servicemonitor-enabled"></a>           | [object] Create a ServiceMonitor resource for Prometheus                                                                  | `true`              |
| `lapi.metrics.serviceMonitor.additionalLabels`<a id="lapi-metrics-servicemonitor-additionallabels"></a>  | Extra labels for the ServiceMonitor                                                                                       | `{}`                |
| `lapi.metrics.podMonitor.enabled`<a id="lapi-metrics-podmonitor-enabled"></a>               | Enables prometheus operator podMonitor                                                                                    | `false`             |
| `lapi.metrics.podMonitor.additionalLabels`<a id="lapi-metrics-podmonitor-additionallabels"></a>      | additional labels for podMonitor                                                                                          | `{}`                |
| `lapi.strategy.type`<a id="lapi-strategy-type"></a>                            | Deployment strategy for the LAPI deployment                                                                               | `""`                |
| `lapi.secrets.csLapiSecret`<a id="lapi-secrets-cslapisecret"></a>                     | Shared LAPI secret (randomly generated if not specified, must be >64 chars)                                               | `""`                |
| `lapi.secrets.registrationToken`<a id="lapi-secrets-registrationtoken"></a>                | Registration token for AppSec (randomly generated if not specified, must be >48 chars)                                    | `""`                |
| `lapi.extraSecrets`<a id="lapi-extrasecrets"></a>                             | Additional secrets to inject (e.g., external DB password)                                                                 | `{}`                |
| `lapi.lifecycle`<a id="lapi-lifecycle"></a>                                | Lifecycle hooks for LAPI pods (postStart, preStop, etc.)                                                                  | `{}`                |
| `lapi.storeCAPICredentialsInSecret`<a id="lapi-storecapicredentialsinsecret"></a>             | [object] Store Central API credentials in a Secret (required if LAPI replicas > 1)                                        | `false`             |
| `lapi.storeLAPICscliCredentialsInSecret`<a id="lapi-storelapicsclicredentialsinsecret"></a>        | [object] Store LAPI cscli credentials in a Secret. Useful if LAPI replicas > 1 or to setup LAPI with a persistent volume. | `false`             |

### agent

| Name                                             | Description                                                                                | Value   |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------ | ------- |
| `agent.enabled`<a id="agent-enabled"></a>                                  | [object] Enable CrowdSec agent (enabled by default)                                        | `true`  |
| `agent.isDeployment`<a id="agent-isdeployment"></a>                             | [object] Deploy agent as a Deployment instead of a DaemonSet                               | `false` |
| `agent.serviceAccountName`<a id="agent-serviceaccountname"></a>                       | Service account name for the agent pods                                                    | `""`    |
| `agent.lapiURL`<a id="agent-lapiurl"></a>                                  | URL of the LAPI for the agent to connect to (defaults to internal service URL)             | `""`    |
| `agent.lapiHost`<a id="agent-lapihost"></a>                                 | Host of the LAPI for the agent to connect to                                               | `""`    |
| `agent.lapiPort`<a id="agent-lapiport"></a>                                 | Port of the LAPI for the agent to connect to                                               | `8080`  |
| `agent.replicas`<a id="agent-replicas"></a>                                 | Number of replicas when deploying as a Deployment                                          | `1`     |
| `agent.strategy`<a id="agent-strategy"></a>                                 | Deployment strategy when `isDeployment` is true                                            | `{}`    |
| `agent.ports`<a id="agent-ports"></a>                                    | Custom container ports to expose (default: metrics port 6060 if enabled)                   | `[]`    |
| `agent.additionalAcquisition`<a id="agent-additionalacquisition"></a>                    | Extra log acquisition sources (see https://docs.crowdsec.net/docs/next/data_sources/intro) | `[]`    |
| `agent.acquisition`<a id="agent-acquisition"></a>                              | Pod log acquisition definitions (namespace, podName, program, etc.)                        | `[]`    |
| `agent.priorityClassName`<a id="agent-priorityclassname"></a>                        | Priority class name for agent pods                                                         | `""`    |
| `agent.daemonsetAnnotations`<a id="agent-daemonsetannotations"></a>                     | Annotations applied to the agent DaemonSet                                                 | `{}`    |
| `agent.deploymentAnnotations`<a id="agent-deploymentannotations"></a>                    | Annotations applied to the agent Deployment                                                | `{}`    |
| `agent.podAnnotations`<a id="agent-podannotations"></a>                           | Annotations applied to agent pods                                                          | `{}`    |
| `agent.podLabels`<a id="agent-podlabels"></a>                                | Labels applied to agent pods                                                               | `{}`    |
| `agent.extraInitContainers`<a id="agent-extrainitcontainers"></a>                      | Extra init containers for agent pods                                                       | `[]`    |
| `agent.extraVolumes`<a id="agent-extravolumes"></a>                             | Extra volumes for agent pods                                                               | `[]`    |
| `agent.extraVolumeMounts`<a id="agent-extravolumemounts"></a>                        | Extra volume mounts for agent pods                                                         | `[]`    |
| `agent.resources`<a id="agent-resources"></a>                                | Resource requests and limits for agent pods                                                | `{}`    |
| `agent.persistentVolume.config.enabled`<a id="agent-persistentvolume-config-enabled"></a>          | [object] Enable persistent volume for agent config                                         | `false` |
| `agent.persistentVolume.config.accessModes`<a id="agent-persistentvolume-config-accessmodes"></a>      | Access modes for the config PVC                                                            | `[]`    |
| `agent.persistentVolume.config.storageClassName`<a id="agent-persistentvolume-config-storageclassname"></a> | StorageClass name for the config PVC                                                       | `""`    |
| `agent.persistentVolume.config.existingClaim`<a id="agent-persistentvolume-config-existingclaim"></a>    | Existing PVC name to use for config                                                        | `""`    |
| `agent.persistentVolume.config.subPath`<a id="agent-persistentvolume-config-subpath"></a>          | subPath to use within the volume                                                           | `""`    |
| `agent.persistentVolume.config.size`<a id="agent-persistentvolume-config-size"></a>             | Requested size for the config PVC                                                          | `""`    |
| `agent.hostVarLog`<a id="agent-hostvarlog"></a>                               | [object] Mount hostPath `/var/log` into the agent pod                                      | `true`  |
| `agent.env`<a id="agent-env"></a>                                      | Environment variables passed to the crowdsecurity/crowdsec container                       | `[]`    |
| `agent.nodeSelector`<a id="agent-nodeselector"></a>                             | Node selector for agent pods                                                               | `{}`    |
| `agent.tolerations`<a id="agent-tolerations"></a>                              | Tolerations for scheduling agent pods                                                      | `[]`    |
| `agent.affinity`<a id="agent-affinity"></a>                                 | Affinity rules for agent pods                                                              | `{}`    |
| `agent.livenessProbe`<a id="agent-livenessprobe"></a>                            | Liveness probe configuration for agent pods                                                | `{}`    |
| `agent.readinessProbe`<a id="agent-readinessprobe"></a>                           | Readiness probe configuration for agent pods                                               | `{}`    |
| `agent.startupProbe`<a id="agent-startupprobe"></a>                             | Startup probe configuration for agent pods                                                 | `{}`    |
| `agent.metrics.enabled`<a id="agent-metrics-enabled"></a>                          | Enable service monitoring for Prometheus (exposes port 6060)                               | `true`  |
| `agent.metrics.serviceMonitor.enabled`<a id="agent-metrics-servicemonitor-enabled"></a>           | Create a ServiceMonitor resource for Prometheus                                            | `false` |
| `agent.metrics.serviceMonitor.additionalLabels`<a id="agent-metrics-servicemonitor-additionallabels"></a>  | Extra labels for the ServiceMonitor                                                        | `{}`    |
| `agent.metrics.podMonitor.enabled`<a id="agent-metrics-podmonitor-enabled"></a>               | Create a PodMonitor resource for Prometheus                                                | `false` |
| `agent.metrics.podMonitor.additionalLabels`<a id="agent-metrics-podmonitor-additionallabels"></a>      | Extra labels for the PodMonitor                                                            | `{}`    |
| `agent.service.type`<a id="agent-service-type"></a>                             | Kubernetes Service type for agent                                                          | `""`    |
| `agent.service.labels`<a id="agent-service-labels"></a>                           | Labels applied to the agent Service                                                        | `{}`    |
| `agent.service.annotations`<a id="agent-service-annotations"></a>                      | Annotations applied to the agent Service                                                   | `{}`    |
| `agent.service.externalIPs`<a id="agent-service-externalips"></a>                      | External IPs assigned to the agent Service                                                 | `[]`    |
| `agent.service.loadBalancerIP`<a id="agent-service-loadbalancerip"></a>                   | Fixed LoadBalancer IP for the agent Service                                                | `nil`   |
| `agent.service.loadBalancerClass`<a id="agent-service-loadbalancerclass"></a>                | LoadBalancer class for the agent Service                                                   | `nil`   |
| `agent.service.externalTrafficPolicy`<a id="agent-service-externaltrafficpolicy"></a>            | External traffic policy for the agent Service                                              | `""`    |
| `agent.service.ports`<a id="agent-service-ports"></a>                            | Custom service ports (default: metrics port 6060 if enabled)                               | `[]`    |
| `agent.wait_for_lapi.image.repository`<a id="agent-wait_for_lapi-image-repository"></a>           | Repository for the wait-for-lapi init container image                                      | `""`    |
| `agent.wait_for_lapi.image.pullPolicy`<a id="agent-wait_for_lapi-image-pullpolicy"></a>           | Image pull policy for the wait-for-lapi init container                                     | `""`    |
| `agent.wait_for_lapi.image.tag`<a id="agent-wait_for_lapi-image-tag"></a>                  | Image tag for the wait-for-lapi init container                                             | `""`    |
| `appsec.enabled`<a id="appsec-enabled"></a>                                 | [object] Enable AppSec component (disabled by default)                                     | `false` |
| `appsec.lapiURL`<a id="appsec-lapiurl"></a>                                 | URL the AppSec component uses to reach LAPI (defaults to internal service URL)             | `""`    |
| `appsec.lapiHost`<a id="appsec-lapihost"></a>                                | Hostname the AppSec component uses to reach LAPI                                           | `""`    |
| `appsec.lapiPort`<a id="appsec-lapiport"></a>                                | Port the AppSec component uses to reach LAPI                                               | `8080`  |
| `appsec.replicas`<a id="appsec-replicas"></a>                                | Number of replicas for the AppSec Deployment                                               | `1`     |
| `appsec.strategy`<a id="appsec-strategy"></a>                                | Deployment strategy for AppSec                                                             | `{}`    |
| `appsec.acquisitions`<a id="appsec-acquisitions"></a>                            | AppSec acquisitions (datasource listeners), e.g. appsec listener on 7422                   | `[]`    |
| `appsec.configs`<a id="appsec-configs"></a>                                 | AppSec configs (key = filename, value = file content)                                      | `{}`    |
| `appsec.rules`<a id="appsec-rules"></a>                                   | AppSec rule files (key = filename, value = file content)                                   | `{}`    |
| `appsec.priorityClassName`<a id="appsec-priorityclassname"></a>                       | Priority class name for AppSec pods                                                        | `""`    |
| `appsec.deployAnnotations`<a id="appsec-deployannotations"></a>                       | Annotations added to the AppSec Deployment                                                 | `{}`    |
| `appsec.podAnnotations`<a id="appsec-podannotations"></a>                          | Annotations added to AppSec pods                                                           | `{}`    |
| `appsec.podLabels`<a id="appsec-podlabels"></a>                               | Labels added to AppSec pods                                                                | `{}`    |
| `appsec.extraInitContainers`<a id="appsec-extrainitcontainers"></a>                     | Extra init containers for AppSec pods                                                      | `[]`    |
| `appsec.extraVolumes`<a id="appsec-extravolumes"></a>                            | Extra volumes for AppSec pods                                                              | `[]`    |
| `appsec.extraVolumeMounts`<a id="appsec-extravolumemounts"></a>                       | Extra volume mounts for AppSec pods                                                        | `[]`    |
| `appsec.resources`<a id="appsec-resources"></a>                               | Resource requests and limits for AppSec pods                                               | `{}`    |
| `appsec.env`<a id="appsec-env"></a>                                     | Environment variables for the AppSec container (collections/configs/rules toggles, etc.)   | `[]`    |
| `appsec.nodeSelector`<a id="appsec-nodeselector"></a>                            | Node selector for scheduling AppSec pods                                                   | `{}`    |
| `appsec.tolerations`<a id="appsec-tolerations"></a>                             | Tolerations for scheduling AppSec pods                                                     | `[]`    |
| `appsec.affinity`<a id="appsec-affinity"></a>                                | Affinity rules for scheduling AppSec pods                                                  | `{}`    |
| `appsec.livenessProbe`<a id="appsec-livenessprobe"></a>                           | Liveness probe configuration for AppSec pods                                               | `{}`    |
| `appsec.readinessProbe`<a id="appsec-readinessprobe"></a>                          | Readiness probe configuration for AppSec pods                                              | `{}`    |
| `appsec.startupProbe`<a id="appsec-startupprobe"></a>                            | Startup probe configuration for AppSec pods                                                | `{}`    |
| `appsec.metrics.enabled`<a id="appsec-metrics-enabled"></a>                         | Enable service monitoring (exposes metrics on 6060; AppSec listener typically 7422)        | `true`  |
| `appsec.metrics.serviceMonitor.enabled`<a id="appsec-metrics-servicemonitor-enabled"></a>          | Create a ServiceMonitor for Prometheus scraping                                            | `false` |
| `appsec.metrics.serviceMonitor.additionalLabels`<a id="appsec-metrics-servicemonitor-additionallabels"></a> | Extra labels for the ServiceMonitor                                                        | `{}`    |
| `appsec.metrics.podMonitor.enabled`<a id="appsec-metrics-podmonitor-enabled"></a>              | Create a PodMonitor for Prometheus scraping                                                | `false` |
| `appsec.metrics.podMonitor.additionalLabels`<a id="appsec-metrics-podmonitor-additionallabels"></a>     | Extra labels for the PodMonitor                                                            | `{}`    |
| `appsec.service.type`<a id="appsec-service-type"></a>                            | Kubernetes Service type for AppSec                                                         | `""`    |
| `appsec.service.labels`<a id="appsec-service-labels"></a>                          | Additional labels for the AppSec Service                                                   | `{}`    |
| `appsec.service.annotations`<a id="appsec-service-annotations"></a>                     | Annotations to apply to the LAPI ingress object                                            | `{}`    |
| `appsec.service.externalIPs`<a id="appsec-service-externalips"></a>                     | External IPs for the AppSec Service                                                        | `[]`    |
| `appsec.service.loadBalancerIP`<a id="appsec-service-loadbalancerip"></a>                  | Fixed LoadBalancer IP for the AppSec Service                                               | `nil`   |
| `appsec.service.loadBalancerClass`<a id="appsec-service-loadbalancerclass"></a>               | LoadBalancer class for the AppSec Service                                                  | `nil`   |
| `appsec.service.externalTrafficPolicy`<a id="appsec-service-externaltrafficpolicy"></a>           | External traffic policy for the AppSec Service                                             | `""`    |
| `appsec.wait_for_lapi.image.repository`<a id="appsec-wait_for_lapi-image-repository"></a>          | Repository for the wait-for-lapi init con                                                  | `""`    |
| `appsec.wait_for_lapi.image.pullPolicy`<a id="appsec-wait_for_lapi-image-pullpolicy"></a>          | Image pull policy for the wait-for-lapi init container                                     | `""`    |
| `appsec.wait_for_lapi.image.tag`<a id="appsec-wait_for_lapi-image-tag"></a>                 | Image tag for the wait-for-lapi init container                                             | `1.28`  |
