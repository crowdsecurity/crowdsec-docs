---
id: docker
title: Docker
---

This module allows the `Security Engine` to acquire logs from running containers, in one-shot and streaming mode.

## Configuration example

### Container

To monitor a given container name or ID:

```yaml
source: docker
container_name:
 - my_container_name
container_id:
 - 843ee92d231b
labels:
  type: log_type
```

To monitor containers name or ID matching a regex:

```yaml
source: docker
container_name_regexp:
 - my_containers_*
container_id_regexp:
 - i-*
labels:
  type: log_type
```

### Swarm

To monitor a given Swarm service name or ID:

```yaml
source: docker
service_name:
 - my_service_name
service_id:
 - abcdef123456
labels:
  type: log_type
```

To monitor Swarm services name or ID matching a regex:

```yaml
source: docker
service_name_regexp:
 - web_*
service_id_regexp:
 - svc-*
labels:
  type: log_type
```

Look at the `configuration parameters` to view all supported options.


## Parameters

:::warning
you should not mix `container` options and `swarm` options as it may lead to duplicate logs being read. if you plan to use `swarm` options solely use these options.
:::

### Container

#### `container_name`

List of containers names to monitor.

#### `container_id`

List of containers IDs to monitor.

#### `container_name_regexp`

List of regexp matching containers names to monitor.

#### `container_id_regexp`

List of regexp matching containers ID to monitor.

#### `use_container_labels`

Forces the use of container labels to get the log type. Meaning you can define a single docker datasource and let the labels of the container define the log type.

```yaml
source: docker
use_container_labels: true
```

Currently here is the list of reserved labels for the container:

`crowdsec.enable` : Enable crowdsec acquisition for this container the value must be set to `crowdsec.enable=true` for the container to be adopted.

`crowdsec.labels` : Top level key that will parse into the labels struct for the acquisition, for example `crowdsec.labels.type=nginx` will be parsed to the following:

```yaml
labels:
  type: nginx
```

Here is an example of running a nginx container with the labels:

```bash
docker run -d --label crowdsec.enable=true --label crowdsec.labels.type=nginx nginx:alpine
```

### Swarm

#### `service_name`

List of service names to monitor.

#### `service_id`

List of service IDs to monitor.

#### `service_name_regexp`

List of regexp matching service names to monitor.

#### `service_id_regexp`

List of regexp matching service ID to monitor

#### `use_service_labels`

Forces the use of service labels to get the log type. Meaning you can define a single docker datasource and let the labels of the service define the log type.

```yaml
source: docker
use_service_labels: true
```

Currently here is the list of reserved labels for the service:

`crowdsec.enable` : Enable crowdsec acquisition for this service the value must be set to `crowdsec.enable=true` for the service to be adopted.

`crowdsec.labels` : Top level key that will parse into the labels struct for the acquisition, for example `crowdsec.labels.type=nginx` will be parsed to the following:

```yaml
labels:
  type: nginx
```

Here is an example of running a service using nginx with the labels:

```bash
docker service create \
  --name test-nginx \
  --label crowdsec.enable=true \
  --label crowdsec.labels.type=nginx \
  --replicas 2 \
  nginx:latest
```

### `docker_host`

Docker host.

Default: `unix:///var/run/docker.sock`

### `until`

Read logs until timestamp (e.g. 2013-01-02T13:23:37Z) or relative (e.g. 42m for 42 minutes).

### `since`

Read logs since timestamp (e.g. 2013-01-02T13:23:37Z) or relative (e.g. 42m for 42 minutes).

### `check_interval`

Relative interval (e.g. 5s for 5 seconds) to check for new containers matching the configuration.

Default: `1s`

### `follow_stdout`

Follow `stdout` containers logs.

Default: `true`

### `follow_stderr`

Follow `stderr` container logs.

Default: `true`


## DSN and command-line

:::info
DSN does not support reading from Swarm services
:::

docker datasource implements a very approximative DSN, as follows : `docker://<docker_name_or_id>?[args]`

Supported args are :

  - `log_level` : set log level of module
  - `until` : read logs until timestamp (e.g. 2013-01-02T13:23:37Z) or relative (e.g. 42m for 42 minutes)
  - `since` : read logs since timestamp (e.g. 2013-01-02T13:23:37Z) or relative (e.g. 42m for 42 minutes)
  - `docker_host` : docker host, can be a remote docker host or a path to another container socket
  - `follow_stderr`: follow `stderr` container logs
  - `follow_stdout` : follow `stdout` container logs

A 'pseudo DSN' must be provided:

```bash
crowdsec -type nginx -dsn 'docker://my_nginx_container_name' 
```

You can specify the `log_level` parameter to change the log level for the acquisition :

```bash
crowdsec -type nginx -dsn 'docker://my_nginx_container_name?log_level=debug' 
```

## Notes

### Containers watching

This module will automatically read the logs of containers specified in the configuration, even if they have been started after crowdsec start.

### Reading podman containers


:::note

Don't forget to start podman service with `sudo systemctl start podman`.

Run your podman containers as `root`, else `CrowdSec` will not be able to read the logs.

:::


If you want to read Podman containers logs, you can set the `docker_host` to `unix:///run/podman/podman.sock` or to the path of your Podman socket.

```yaml title="Configuration file"
source: docker
container_name_regexp:
 - my_containers_*
container_id_regexp:
 - i-*
labels:
  type: log_type
docker_host: unix:///var/run/podman/podman.sock
```

```bash title="Command line"
crowdsec -type nginx -dsn 'docker://my_nginx_container_name?docker_host=unix:///run/podman/podman.sock&log_level=debug'
```