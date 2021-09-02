---
id: intro
title: Introduction
---

## Goal

Crowdsec supports notification plugins, meant to be able to push alerts to third party services, for alerting or integration purposes.
At the time of writting, plugins exists for [slack](/notification_plugins/slack.md), [splunk](/notification_plugins/splunk.md), and a generic [http push](/notification_plugins/http.md) plugin (allowing to push to services such as [elasticsearch](/notification_plugins/elasticsearch.md)).

Events get dispatched to said plugins via [profile configuration](/profiles/intro.md).

## Configuration

The default plugins are shipped with crowdsec uppon installation, and can trivially be enabled without further installation.

Refer directly to each plugin's dedicated documentation and keep in mind that plugins needs to be enabled/dispatched at the [profile](/profiles/intro.md) level via the dedicated `notifications` section (defaults to `/etc/crowdsec/profiles.yaml`.md).



Plugin binaries are present in `config_paths.plugin_dir` (defaults to `/var/lib/crowdsec/plugins/`), and their individual configuration are present in `config_paths.notification_dir` (defaults to `/etc/crowdsec/notifications/`)

**Important:** CrowdSec rejects the plugins if one of the following is true :
1. plugin is not owned by the root user and root group.
2. plugin is world-writable. 

## Registering plugin to profile

After discovering the plugins, CrowdSec registers the plugins to the profiles. Here's a profile which sends alerts to plugin named `slackreport`. 

```yaml
name: default_ip_remediation
#debug: true
filters:
 - Alert.Remediation == true && Alert.GetScope() == "Ip"
decisions:
 - type: ban
   duration: 4h
on_success: break
notifications:
 - slackreport

```

**Note:** In this case CrowdSec will map the plugin `slackreport` to the plugin config which has `name=slackreport`. See next section for more details.

## Notification plugin configuration:

Following are the fields CrowdSec main process can interpret. 
```yaml
type:
name:
format:
group_wait:
group_threshold:
max_retry:
timeout:

```
### `type` : 

Required. Type of plugin, eg "slack"

### `name` : 

Required. Name of this config  eg "slackreport". This should match with registered name in profile.

### `format` :

Required. [go template](https://pkg.go.dev/text/template), which is fed a list of [Alert](https://pkg.go.dev/github.com/crowdsecurity/crowdsec@master/pkg/models#Alert) objects. The go templates provide additional directives provide by [sprig](https://masterminds.github.io/sprig/) . eg "Received {{.len}} alerts"

### `group_wait` :

Optional. duration to wait collecting alerts before sending to this plugin, eg "30s"

### `group_threshold` :

Optional. if alerts exceed this, then the plugin will be sent the message. eg "10"

### `max_retry` :

Optional. the number of tries to attempt to send message to plugins in case of error.

### `timeout` :

Optional. duration to wait for a response from the plugin before considering this attempt a failure. eg "10s"

You can define other plugin specific fields too. eg `webhook` field for a slack plugin. 

## Dispatching configuration: 

CrowdSec main process feeds the configuration files to the plugins via gRPC. It determines where to send the config via the value of `type`  field in config file.


# Architecture and technical considerations

## Architecture

Under the hood, the main CrowdSec process dispatches the plugins as gRPC services. This means that plugins can be written in any language.

Currently only `notification` plugins are supported. Whenever CrowdSec receives any alert, if this alert satisfies the owner profile then the same alert will be dispatched to such plugin.

[See](https://github.com/crowdsecurity/crowdsec/blob/plugins/pkg/protobufs/notifier.proto) the gRPC protocol for `notification` plugins.

## Plugin Discovery

Plugins are discovered from the directories specified in `/etc/crowdsec/config.yaml`. 

```yaml
#/etc/crowdsec/config.yaml
.....
config_paths:
  notification_dir: /etc/crowdsec/notifications/
  plugin_dir: /var/lib/crowdsec/plugins/
.....
```


