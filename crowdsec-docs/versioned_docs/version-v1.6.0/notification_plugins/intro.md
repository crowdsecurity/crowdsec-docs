---
id: intro
title: Introduction
---

import CodeBlock from '@theme/CodeBlock';

### Goal

CrowdSec supports notification plugins, meant to be able to push alerts to third party services for alerting or integration purposes.
At the time of writing, plugins exists for [slack](/notification_plugins/slack.md), [splunk](/notification_plugins/splunk.md), and a generic [http push](/notification_plugins/http.md) plugin (allowing to push to services such as [elasticsearch](/notification_plugins/elasticsearch.md)).

Plugins are defined at LAPI level. Events get dispatched to said plugins via [profile configuration](/profiles/intro.md). 

### Configuration

The default plugins are shipped with CrowdSec upon installation, and can trivially be enabled without further installation.

Refer directly to each plugin's dedicated documentation and keep in mind that plugins needs to be enabled/dispatched at the [profile](/profiles/intro.md) level via the dedicated `notifications` section (defaults to `/etc/crowdsec/profiles.yaml`.md).



Plugin binaries are present in `config_paths.plugin_dir` (defaults to `/var/lib/crowdsec/plugins/`), and their individual configuration are present in `config_paths.notification_dir` (defaults to `/etc/crowdsec/notifications/`)


**Important:** CrowdSec rejects the plugins if one of the following is true :
1. plugin is not owned by the root user and root group.
2. plugin is world-writable. 


### Environment variables

It is possible to set configuration values based on environment variables.

For example, if you don't want to store your SMTP host password in the configuration file, you can do this:

```yaml
smtp_host: smtp.gmail.com           
smtp_username: myemail@gmail.com
smtp_password: ${SMTP_PASSWORD}
smtp_port: 587
auth_type: login    
sender_name: "CrowdSec"
sender_email: email@gmail.com
email_subject: "CrowdSec Notification"
```


### Registering plugin to profile

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

### Notification plugin configuration:

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
#### `type` : 

Required. Type of plugin, eg "slack"

#### `name` : 

Required. Name of this config  eg "slackreport". This should match with registered name in profile.

#### `format` :

Required. [go template](https://pkg.go.dev/text/template), which is fed a list of [Alert](https://pkg.go.dev/github.com/crowdsecurity/crowdsec@master/pkg/models#Alert) objects. The go templates provide additional directives provide by [sprig](https://masterminds.github.io/sprig/) . eg "Received ``{{.len}}`` alerts"

#### `group_wait` :

Optional. duration to wait collecting alerts before sending to this plugin, eg "30s"

#### `group_threshold` :

Optional. if alerts exceed this, then the plugin will be sent the message. eg "10"

#### `max_retry` :

Optional. the number of tries to attempt to send message to plugins in case of error.

#### `timeout` :

Optional. duration to wait for a response from the plugin before considering this attempt a failure. eg "10s"

You can define other plugin specific fields too. eg `webhook` field for a slack plugin. 

### Dispatching configuration: 

CrowdSec main process feeds the configuration files to the plugins via gRPC. It determines where to send the config via the value of `type`  field in config file.


### Architecture and technical considerations

#### Architecture

Under the hood, the main CrowdSec process dispatches the plugins as gRPC services. This means that plugins can be written in any language.

Currently only `notification` plugins are supported. Whenever CrowdSec receives any alert and if this alert satisfies the owner profile, then the same alert will be dispatched to such plugin.

[See](https://github.com/crowdsecurity/crowdsec/blob/plugins/pkg/protobufs/notifier.proto) the gRPC protocol for `notification` plugins.

#### Plugin Discovery

Plugins are discovered from the directories specified in `/etc/crowdsec/config.yaml`. 

```yaml
#/etc/crowdsec/config.yaml
.....
config_paths:
  notification_dir: /etc/crowdsec/notifications/
  plugin_dir: /var/lib/crowdsec/plugins/
.....
```

#### Plugin Process Owner

Due to security reasons, plugins are ideally ran with dropped priveleges. This is done by setting owner and group of the plugin process as some unprivileged user. This can be configured via setting the desired user and group in `/etc/crowdsec/config.yaml`. 

```yaml
#/etc/crowdsec/config.yaml
.....
plugin_config:
  user: nobody
  group: nogroup
.....
```

### Alert object

You have access to the list of alerts that triggered the notification when writing the go-template in the `format` parameter.

An alert is defined as follow:

```
type Alert struct {
	Capacity *int32 `json:"capacity"`
	CreatedAt string `json:"created_at,omitempty"`
	Decisions []*Decision `json:"decisions"`
	Events []*Event `json:"events"`
	EventsCount *int32 `json:"events_count"`
	ID int64 `json:"id,omitempty"`
	Labels []string `json:"labels"`
	Leakspeed *string `json:"leakspeed"`
	MachineID string `json:"machine_id,omitempty"`
	Message *string `json:"message"`
	Meta Meta `json:"meta,omitempty"`
	Remediation bool `json:"remediation,omitempty"`
	Scenario *string `json:"scenario"`
	ScenarioHash *string `json:"scenario_hash"`
	ScenarioVersion *string `json:"scenario_version"`
	Simulated *bool `json:"simulated"`
	Source *Source `json:"source"`
	StartAt *string `json:"start_at"`
	StopAt *string `json:"stop_at"`
}
```

Here is a full example of an Alert object list available in the go-template (this example was generated by a SSH bruteforce).

Note that this was generated using the `toJson` sprig function, so field names are a bit different from the actual names in the go object.

To use them in a go-template, you can check [here](https://pkg.go.dev/github.com/crowdsecurity/crowdsec@master/pkg/models#Alert) to get the actual field names.

<details>
<summary>Show the full alert object</summary>
<CodeBlock className="language-json">
{`[
    {
        "capacity": 5,
        "decisions": [
            {
                "duration": "4h",
                "origin": "crowdsec",
                "scenario": "crowdsecurity/ssh-bf",
                "scope": "Ip",
                "type": "ban",
                "value": "35.188.49.176"
            }
        ],
        "events": [
            {
                "meta": [
                    {
                        "key": "ASNNumber",
                        "value": "15169"
                    },
                    {
                        "key": "ASNOrg",
                        "value": "Google LLC"
                    },
                    {
                        "key": "IsInEU",
                        "value": "false"
                    },
                    {
                        "key": "IsoCode",
                        "value": "US"
                    },
                    {
                        "key": "SourceRange",
                        "value": "35.184.0.0/13"
                    },
                    {
                        "key": "datasource_path",
                        "value": "ssh-bf.log"
                    },
                    {
                        "key": "datasource_type",
                        "value": "file"
                    },
                    {
                        "key": "log_type",
                        "value": "ssh_failed-auth"
                    },
                    {
                        "key": "machine",
                        "value": "sd-126005"
                    },
                    {
                        "key": "service",
                        "value": "ssh"
                    },
                    {
                        "key": "source_ip",
                        "value": "35.188.49.176"
                    },
                    {
                        "key": "target_user",
                        "value": "pascal"
                    },
                    {
                        "key": "timestamp",
                        "value": "2022-02-12T14:10:21Z"
                    }
                ],
                "timestamp": "2022-02-12T14:10:23Z"
            },
            {
                "meta": [
                    {
                        "key": "ASNNumber",
                        "value": "15169"
                    },
                    {
                        "key": "ASNOrg",
                        "value": "Google LLC"
                    },
                    {
                        "key": "IsInEU",
                        "value": "false"
                    },
                    {
                        "key": "IsoCode",
                        "value": "US"
                    },
                    {
                        "key": "SourceRange",
                        "value": "35.184.0.0/13"
                    },
                    {
                        "key": "datasource_path",
                        "value": "ssh-bf.log"
                    },
                    {
                        "key": "datasource_type",
                        "value": "file"
                    },
                    {
                        "key": "log_type",
                        "value": "ssh_failed-auth"
                    },
                    {
                        "key": "machine",
                        "value": "sd-126005"
                    },
                    {
                        "key": "service",
                        "value": "ssh"
                    },
                    {
                        "key": "source_ip",
                        "value": "35.188.49.176"
                    },
                    {
                        "key": "target_user",
                        "value": "pascal1"
                    },
                    {
                        "key": "timestamp",
                        "value": "2022-02-12T14:10:21Z"
                    }
                ],
                "timestamp": "2022-02-12T14:10:23Z"
            },
            {
                "meta": [
                    {
                        "key": "ASNNumber",
                        "value": "15169"
                    },
                    {
                        "key": "ASNOrg",
                        "value": "Google LLC"
                    },
                    {
                        "key": "IsInEU",
                        "value": "false"
                    },
                    {
                        "key": "IsoCode",
                        "value": "US"
                    },
                    {
                        "key": "SourceRange",
                        "value": "35.184.0.0/13"
                    },
                    {
                        "key": "datasource_path",
                        "value": "ssh-bf.log"
                    },
                    {
                        "key": "datasource_type",
                        "value": "file"
                    },
                    {
                        "key": "log_type",
                        "value": "ssh_failed-auth"
                    },
                    {
                        "key": "machine",
                        "value": "sd-126005"
                    },
                    {
                        "key": "service",
                        "value": "ssh"
                    },
                    {
                        "key": "source_ip",
                        "value": "35.188.49.176"
                    },
                    {
                        "key": "target_user",
                        "value": "pascal2"
                    },
                    {
                        "key": "timestamp",
                        "value": "2022-02-12T14:10:22Z"
                    }
                ],
                "timestamp": "2022-02-12T14:10:23Z"
            },
            {
                "meta": [
                    {
                        "key": "ASNNumber",
                        "value": "15169"
                    },
                    {
                        "key": "ASNOrg",
                        "value": "Google LLC"
                    },
                    {
                        "key": "IsInEU",
                        "value": "false"
                    },
                    {
                        "key": "IsoCode",
                        "value": "US"
                    },
                    {
                        "key": "SourceRange",
                        "value": "35.184.0.0/13"
                    },
                    {
                        "key": "datasource_path",
                        "value": "ssh-bf.log"
                    },
                    {
                        "key": "datasource_type",
                        "value": "file"
                    },
                    {
                        "key": "log_type",
                        "value": "ssh_failed-auth"
                    },
                    {
                        "key": "machine",
                        "value": "sd-126005"
                    },
                    {
                        "key": "service",
                        "value": "ssh"
                    },
                    {
                        "key": "source_ip",
                        "value": "35.188.49.176"
                    },
                    {
                        "key": "target_user",
                        "value": "pascal3"
                    },
                    {
                        "key": "timestamp",
                        "value": "2022-02-12T14:10:22Z"
                    }
                ],
                "timestamp": "2022-02-12T14:10:23Z"
            },
            {
                "meta": [
                    {
                        "key": "ASNNumber",
                        "value": "15169"
                    },
                    {
                        "key": "ASNOrg",
                        "value": "Google LLC"
                    },
                    {
                        "key": "IsInEU",
                        "value": "false"
                    },
                    {
                        "key": "IsoCode",
                        "value": "US"
                    },
                    {
                        "key": "SourceRange",
                        "value": "35.184.0.0/13"
                    },
                    {
                        "key": "datasource_path",
                        "value": "ssh-bf.log"
                    },
                    {
                        "key": "datasource_type",
                        "value": "file"
                    },
                    {
                        "key": "log_type",
                        "value": "ssh_failed-auth"
                    },
                    {
                        "key": "machine",
                        "value": "sd-126005"
                    },
                    {
                        "key": "service",
                        "value": "ssh"
                    },
                    {
                        "key": "source_ip",
                        "value": "35.188.49.176"
                    },
                    {
                        "key": "target_user",
                        "value": "pascal4"
                    },
                    {
                        "key": "timestamp",
                        "value": "2022-02-12T14:10:23Z"
                    }
                ],
                "timestamp": "2022-02-12T14:10:23Z"
            },
            {
                "meta": [
                    {
                        "key": "ASNNumber",
                        "value": "15169"
                    },
                    {
                        "key": "ASNOrg",
                        "value": "Google LLC"
                    },
                    {
                        "key": "IsInEU",
                        "value": "false"
                    },
                    {
                        "key": "IsoCode",
                        "value": "US"
                    },
                    {
                        "key": "SourceRange",
                        "value": "35.184.0.0/13"
                    },
                    {
                        "key": "datasource_path",
                        "value": "ssh-bf.log"
                    },
                    {
                        "key": "datasource_type",
                        "value": "file"
                    },
                    {
                        "key": "log_type",
                        "value": "ssh_failed-auth"
                    },
                    {
                        "key": "machine",
                        "value": "sd-126005"
                    },
                    {
                        "key": "service",
                        "value": "ssh"
                    },
                    {
                        "key": "source_ip",
                        "value": "35.188.49.176"
                    },
                    {
                        "key": "target_user",
                        "value": "pascal5"
                    },
                    {
                        "key": "timestamp",
                        "value": "2022-02-12T14:10:23Z"
                    }
                ],
                "timestamp": "2022-02-12T14:10:23Z"
            }
        ],
        "events_count": 6,
        "labels": null,
        "leakspeed": "10s",
        "machine_id": "4e1c7990a4af460a9c622d2c80a856334U2v5NbKX14uQKFa",
        "message": "Ip 35.188.49.176 performed 'crowdsecurity/ssh-bf' (6 events over 2s) at 2022-02-12 14:10:23 +0000 UTC",
        "remediation": true,
        "scenario": "crowdsecurity/ssh-bf",
        "scenario_hash": "4441dcff07020f6690d998b7101e642359ba405c2abb83565bbbdcee36de280f",
        "scenario_version": "0.1",
        "simulated": false,
        "source": {
            "as_name": "Google LLC",
            "as_number": "15169",
            "cn": "US",
            "ip": "35.188.49.176",
            "latitude": 37.4192,
            "longitude": -122.0574,
            "range": "35.184.0.0/13",
            "scope": "Ip",
            "value": "35.188.49.176"
        },
        "start_at": "2022-02-12T14:10:21Z",
        "stop_at": "2022-02-12T14:10:23Z"
    }
]`}
</CodeBlock>
</details>

#### Usage examples

Convert the whole list to JSON format:

```
{{ .|toJson }}
```

---

Extract all the decisions in the alerts list

```
{{ range . }}
 {{ range .Decisions }}
  {{ .Value }} has performed {{.Scenario}} and has received "{{.Type}}" for {{.Duration}}
 {{ end }}
{{ end }}
```

---

Extract the meta associated with the alerts

```
{{ range .}}
 {{.Source.Value}} has performed {{.Scenario}} (meta : {{range .Events}} {{range .Meta}} {{.Key}} : {{.Value}} | {{end}} -- {{ end }})
{{ end }}
```

---

Teams webhook

```
 {
  "$schema": "https://adaptivecards.io/schemas/adaptive-card.json",
  "type": "AdaptiveCard",
  "version": "1.0",
  "body": [
   {{range .}}
   {{ $decisions_len := len .Decisions }}
      {
        "type": "TextBlock",
        "text": "Attack start: {{.StartAt}}"
      },
      {
        "type": "TextBlock",
        "text": "Attack End: {{.StopAt}}"
      },
      {{ range $index, $element := .Decisions }}
      {
        "type": "TextBlock",
        "text": "{{$element.Value}} performed {{$element.Scenario}} and got a {{$element.Duration}} {{$element.Type}}"
      }
      {{ if lt $index (sub $decisions_len 1) }}
      ,
      {{ end }}
      {{ end }}
    {{end}}
    ]
 } 
```

### Debugging notifications plugins

cscli cli tool provide some useful command to help write notification
plugin configuration. Those are provided by the `cscli notifications`
command and its subcommands.

First `cscli notifications list` will list the active configured
notifications plugins. Then it's possible to get configuration
information for each notification plugin using its given name by
executing `cscli notifications inspect <name>`.

The last other helpful subcommand is for testing notifications plugins
directly. It takes an id and reinject the alert through the matched
profile notifications. If the alert matches a profile with no
configured notifications then no notification will be generated. This
can be useful to test both the profile configuration and the normal
operation of the notifications plugins.

