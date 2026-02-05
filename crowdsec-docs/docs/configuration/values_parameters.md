---
title: Helm's Parameters
id: values_parameters
---

# How to write a values parameter file

The following configuration keeps the Helm chart close to its defaults while
explicitly defining how CrowdSec discovers logs, which parsers and collections
are enabled, and how state is persisted.

The container runtime `container_runtime` is set to ensure log lines are decoded
in the correct format. The agent is scoped to only the namespaces and pods that
matter, which reduces noise and limits resource usage. Each `acquisition` entry
includes a program value that maps logs to the appropriate parser family, and
this must stay consistent with the collections loaded through environment
variables.

Debug logging is enabled here for visibility, but it should normally be disabled
in production environments.

AppSec is enabled with a local listener so in-cluster components can forward
HTTP security events. The corresponding AppSec rule collections are loaded to
provide virtual patching and generic protections. The configuration is described
after the `appsec` directive.

On the LAPI side, we strongly encourages the use of database to provide
persistence of decisions and alerts.

```yaml
# Log format emitted by the container runtime.
# Use "containerd" for CRI-formatted logs (most modern Kubernetes clusters),
# or "docker" if nodes still use the Docker runtime.
container_runtime: containerd

agent:
  # Log acquisition configuration: tells CrowdSec which pod logs to read
  # and which parser family ("program") should process them.
  acquisition:
    # Postfix mail logs from the mail-system namespace
    - namespace: mail-system # Kubernetes namespace to watch
      podName: mail-system-postfix-* # Pod name glob pattern
      program: postfix/smtpd # Parser hint so postfix logs match correctly
      poll_without_inotify: true

    # NGINX ingress controller logs
    - namespace: ingress-nginx
      podName: ingress-nginx-controller-* # Typical ingress-nginx controller pods
      program: nginx # Routes logs to nginx parsers
      poll_without_inotify: true

  # It's recommended to avoid putting passwords directly in the values.yaml file
# for security reasons. Instead, consider using Kubernetes Secrets or environment
# variables to manage sensitive information securely.
env:
  # Collections determine which parsers, scenarios, and postoverflows are installed.
  # Must match the log sources defined above.
  - name: COLLECTIONS
    value: crowdsecurity/postfix crowdsecurity/nginx

  # Enables verbose logs from the CrowdSec agent.
  # Useful for troubleshooting, but should be "false" in steady-state production.
  #- name: DEBUG
  #  value: "true"
tolerations:
  # Allows the agent pod to run on control-plane nodes.
  # Only keep this if those nodes also run workloads you want to monitor.
  - key: "node-role.kubernetes.io/control-plane"
    operator: "Exists"
    effect: "NoSchedule"
appsec:
  # Enables CrowdSec AppSec (WAF component)
  enabled: true

  acquisitions:
    # Defines how AppSec receives HTTP security events
    - appsec_config: crowdsecurity/appsec-default # Default AppSec engine configuration
      labels:
        type: appsec # Label used internally to identify AppSec events
      listen_addr: 0.0.0.0:7422 # Address/port where AppSec listens for events
      path: / # URL path to inspect
      source: appsec # Marks events as coming from AppSec

  env:
    # AppSec-specific rule sets (virtual patching + generic protections)
    - name: COLLECTIONS
      value: crowdsecurity/appsec-virtual-patching crowdsecurity/appsec-generic-rules
lapi:
  env:
    # Enrollment key used to register this CrowdSec instance with the console.
    # Should be stored in a Kubernetes Secret in production.
    - name: ENROLL_KEY
      valueFrom:
        secretKeyRef:
          name: crowdsec-keys
          key: ENROLL_KEY

    # Human-readable name for this instance in the console
    - name: ENROLL_INSTANCE_NAME
      value: "sabban"

    # Tags help group or filter instances in the console
    - name: ENROLL_TAGS
      value: "k8s"

    # API key used by a bouncer (here: ingress) to query decisions from LAPI
    # Also should be stored as a Secret rather than plaintext.
    - name: BOUNCER_KEY_ingress
      valueFrom:
        secretKeyRef:
          name: crowdsec-keys
          key: BOUNCER_KEY_ingress

    # It's recommended to avoid putting passwords directly in the values.yaml file
    # for security reasons. Instead, consider using Kubernetes Secrets or environment
    # variables to manage sensitive information securely.
    - name: DB_PASSWORD
      valueFrom:
        secretKeyRef:
          name: database-secret
          key: DB_PASSWORD

  # persistentVolume in kubernetes for CrowdSec data and configuration is now
  # discouragfe in favor of a database and direct configuration through
  # values
  persistentVolume:
    data:
      enabled: false
    config:
      enabled: false

  # The following piece configuration under config.config.yaml.local is merged
  # alongside the current conbfiguration. This mechanism allows
  # environment-specific overrides. This approach helps maintain
  # a clean and centralized configuration while enabling developers
  # to customize their local settings without modifying the primary
  # configuration files in pods with complex volumes and mount points.

config:
  config.yaml.local:
    # This is needed for agent autoregistration
    api:
      server:
        auto_registration: # Activate if not using TLS for authentication
          enabled: true
          token: "${REGISTRATION_TOKEN}" # /!\ Do not modify this variable (auto-generated and handled by the chart)
          allowed_ranges: # /!\ Make sure to adapt to the pod IP ranges used by your cluster
            - "127.0.0.1/32"
            - "192.168.0.0/16"
            - "10.0.0.0/8"
            - "172.16.0.0/12"
    # Using a database is strongly encouraged.
    db_config:
      type: postgresql
      user: crowdsec
      password: ${DB_PASSWORD}
      db_name: crowdsec
      host: <database-host>
      flush:
        bouncers_autodelete:
          api_key: 1h
        agents_autodelete:
          login_password: 1h
```

# Values parameters reference

This page provides a complete, generated reference of all Helm chart
configuration values, their defaults, and their purpose.

## Parameters

### Global

| Name                | Description                                        | Value    |
| ------------------- | -------------------------------------------------- | -------- |
| `container_runtime` | [string] for raw logs format: docker or containerd | `docker` |

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

| Name                                            | Description                                                                                                               | Value               |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `lapi.enabled`                                  | Enable LAPI deployment (enabled by default)                                                                               | `true`              |
| `lapi.replicas`                                 | Number of replicas for the Local API                                                                                      | `1`                 |
| `lapi.env`                                      | Extra environment variables passed to the crowdsecurity/crowdsec container                                                | `[]`                |
| `lapi.envFrom`                                  | Environment variables loaded from Kubernetes Secrets or ConfigMaps                                                        | `[]`                |
| `lapi.ingress.enabled`                          | Enable ingress for the LAPI service                                                                                       | `false`             |
| `lapi.ingress.annotations`                      | Annotations to apply to the LAPI ingress object                                                                           | `{}`                |
| `lapi.ingress.ingressClassName`                 | IngressClass name for the LAPI ingress                                                                                    | `""`                |
| `lapi.ingress.host`                             | Hostname for the LAPI ingress                                                                                             | `""`                |
| `lapi.priorityClassName`                        | Pod priority class name                                                                                                   | `""`                |
| `lapi.deployAnnotations`                        | Annotations applied to the LAPI Deployment                                                                                | `{}`                |
| `lapi.podAnnotations`                           | Annotations applied to LAPI pods                                                                                          | `{}`                |
| `lapi.podLabels`                                | Labels applied to LAPI pods                                                                                               | `{}`                |
| `lapi.extraInitContainers`                      | Additional init containers for LAPI pods                                                                                  | `[]`                |
| `lapi.extraVolumes`                             | Additional volumes for LAPI pods                                                                                          | `[]`                |
| `lapi.extraVolumeMounts`                        | Additional volumeMounts for LAPI pods                                                                                     | `[]`                |
| `lapi.resources`                                | Resource requests and limits for the LAPI pods                                                                            | `{}`                |
| `lapi.persistentVolume.data.enabled`            | Enable persistent volume for the data folder (stores bouncer API keys)                                                    | `true`              |
| `lapi.persistentVolume.data.accessModes`        | Access modes for the data PVC                                                                                             | `["ReadWriteOnce"]` |
| `lapi.persistentVolume.data.storageClassName`   | StorageClass name for the data PVC                                                                                        | `""`                |
| `lapi.persistentVolume.data.existingClaim`      | Existing PersistentVolumeClaim to use for the data PVC                                                                    | `""`                |
| `lapi.persistentVolume.data.subPath`            | subPath to use within the volume                                                                                          | `""`                |
| `lapi.persistentVolume.data.size`               | Requested size for the data PVC                                                                                           | `""`                |
| `lapi.persistentVolume.config.enabled`          | Enable persistent volume for the config folder (stores API credentials)                                                   | `true`              |
| `lapi.persistentVolume.config.accessModes`      | Access modes for the config PVC                                                                                           | `["ReadWriteOnce"]` |
| `lapi.persistentVolume.config.storageClassName` | StorageClass name for the config PVC                                                                                      | `""`                |
| `lapi.persistentVolume.config.existingClaim`    | Existing PersistentVolumeClaim to use for the config PVC                                                                  | `""`                |
| `lapi.persistentVolume.config.subPath`          | subPath to use within the volume                                                                                          | `""`                |
| `lapi.persistentVolume.config.size`             | Requested size for the config PVC                                                                                         | `""`                |
| `lapi.service`                                  | Configuration of kubernetes lapi service                                                                                  | `{}`                |
| `lapi.service.type`                             | Kubernetes service type for LAPI                                                                                          | `""`                |
| `lapi.service.labels`                           | Extra labels to add to the LAPI service                                                                                   | `{}`                |
| `lapi.service.annotations`                      | Extra annotations to add to the LAPI service                                                                              | `{}`                |
| `lapi.service.externalIPs`                      | List of external IPs for the LAPI service                                                                                 | `[]`                |
| `lapi.service.loadBalancerIP`                   | Specific loadBalancer IP for the LAPI service                                                                             | `nil`               |
| `lapi.service.loadBalancerClass`                | LoadBalancer class for the LAPI service                                                                                   | `nil`               |
| `lapi.service.externalTrafficPolicy`            | External traffic policy for the LAPI service                                                                              | `""`                |
| `lapi.nodeSelector`                             | Node selector for scheduling LAPI pods                                                                                    | `{}`                |
| `lapi.tolerations`                              | Tolerations for scheduling LAPI pods                                                                                      | `[]`                |
| `lapi.dnsConfig`                                | DNS configuration for LAPI pods                                                                                           | `{}`                |
| `lapi.affinity`                                 | Affinity rules for LAPI pods                                                                                              | `{}`                |
| `lapi.topologySpreadConstraints`                | Topology spread constraints for LAPI pods                                                                                 | `[]`                |
| `lapi.metrics.enabled`                          | Enable service monitoring for Prometheus (exposes port 6060)                                                              | `true`              |
| `lapi.metrics.serviceMonitor.enabled`           | [object] Create a ServiceMonitor resource for Prometheus                                                                  | `true`              |
| `lapi.metrics.serviceMonitor.additionalLabels`  | Extra labels for the ServiceMonitor                                                                                       | `{}`                |
| `lapi.metrics.podMonitor.enabled`               | Enables prometheus operator podMonitor                                                                                    | `false`             |
| `lapi.metrics.podMonitor.additionalLabels`      | additional labels for podMonitor                                                                                          | `{}`                |
| `lapi.strategy.type`                            | Deployment strategy for the LAPI deployment                                                                               | `""`                |
| `lapi.secrets.csLapiSecret`                     | Shared LAPI secret (randomly generated if not specified, must be >64 chars)                                               | `""`                |
| `lapi.secrets.registrationToken`                | Registration token for AppSec (randomly generated if not specified, must be >48 chars)                                    | `""`                |
| `lapi.extraSecrets`                             | Additional secrets to inject (e.g., external DB password)                                                                 | `{}`                |
| `lapi.lifecycle`                                | Lifecycle hooks for LAPI pods (postStart, preStop, etc.)                                                                  | `{}`                |
| `lapi.storeCAPICredentialsInSecret`             | [object] Store Central API credentials in a Secret (required if LAPI replicas > 1)                                        | `false`             |
| `lapi.storeLAPICscliCredentialsInSecret`        | [object] Store LAPI cscli credentials in a Secret. Useful if LAPI replicas > 1 or to setup LAPI with a persistent volume. | `false`             |

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
