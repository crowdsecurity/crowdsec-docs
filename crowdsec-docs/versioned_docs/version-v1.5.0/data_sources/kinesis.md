---
id: kinesis
title: AWS Kinesis Stream
---

This module allows the `Security Engine` to acquire logs from a Kinesis stream.

## Configuration example

To monitor a stream:
```yaml
source: kinesis
stream_name: my-stream
labels:
 type: mytype
```

To monitor a stream using the [enhanced fan-out](https://docs.aws.amazon.com/streams/latest/dev/enhanced-consumers.html) API:

```yaml
source: kinesis
stream_arn: "arn:aws:kinesis:region:000000000000:stream/my-stream"
use_enhanced_fanout: true
consumer_name: crowdsec-agent
labels:
 type: mytype
```

:::info
If your stream is written to by a [Cloudwatch subscription filter](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/SubscriptionFilters.html), you will need to pass the `from_subscription` parameter, or the Security Engine won't be able to parse the content of the message.
:::

Look at the `configuration parameters` to view all supported options.

## Parameters


### `stream_name`

The name of the kinesis stream you want to read logs from.

Required when `use_enhanced_fanout` is `false`.

### `stream_arn`

The ARN of the kinesis stream you want to read logs from.

Required when `use_enhanced_fanout` is `true`

### `use_enhanced_fanout`

Whether to use enhanced fan-out (dedicated throughput for a consumer) or not.

This option will incur additional AWS costs.

Defaults to `false`

### `consumer_name`

Name of the consumer.

Required when `enhanced_fan_out` is true.

### `from_subscription`

Whether the logs are coming from a Cloudwatch subscription filter or not.

When Cloudwatch writes logs to a kinesis stream, they are base64-encoded and gzipped, and the actual log message is part of a JSON object.

Defaults to `false`.

### `aws_profile`

The AWS profile to use, relies on your `~/.aws/config/`.

Optional, the data source will automatically the standard AWS env vars if present.

### `aws_config_dir`

The path to your `~/.aws/`, defaults to `/root/.aws`.

Optional, the data source will automatically the standard AWS env vars if present.


### `aws_region`

The AWS region.

Optional, the data source will automatically the standard AWS env vars if present.


### `source`

Must be `kinesis`

## DSN and command-line

This datasource does not support acquisition from the command line.

