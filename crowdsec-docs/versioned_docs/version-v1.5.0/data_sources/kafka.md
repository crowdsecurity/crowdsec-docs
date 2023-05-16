---
id: kafka
title: Kafka
---

This module allows `CrowdSec` to acquire logs from a kafka topic.

## Configuration example

To monitor a kafka topic:
```yaml
source: kafka
topic: my-topic
brokers:
  - "localhost:9092"
timeout: 5
labels:
 type: mytype
```

To monitor a kafka topic using SSL:

```yaml
source: kafka
brokers:
  - "localhost:9093"
topic: "my-topic"
timeout: 5
tls:
  insecure_skip_verify: true
  client_cert: /path/kafkaClient.certificate.pem
  client_key: /path/kafkaClient.key
  ca_cert: /path/ca.crt
labels:
  type: nginx
```

:::info
The reader will always start from the latest offset.
:::

Look at the `configuration parameters` to view all supported options.

## Parameters


### `brokers`

The name of the kafka brockers to connect to.

Required.

### `topic`

The topic name you want to read logs from.

Required.

### `tls.insecure_skip_verify`

To disable security checks on the certificate.

Defaults to `false`

### `tls.client_cert`

The client certificate path.

Optional, when you want to enable TLS with client certificate.

### `tls.client_key`

The client key path.

Optional, when you want to enable TLS with client certificate.

### `tls.ca_cert`

The CA certificate path.

Optional, when you want to enable TLS with client certificate.


### `source`

Must be `kafka`

## DSN and command-line

This datasource does not support acquisition from the command line.

