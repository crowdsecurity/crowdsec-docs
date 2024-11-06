---
id: elastic
title: Elasticsearch
---

CrowdSec can forward Alerts to Elasticsearch using the HTTP plugin. This guide will show you how to configure the plugin to send alerts to your Elasticsearch instance.

## Configuring the plugin

By default the configuration for HTTP plugin is located at these default location per OS:

- **Linux** `/etc/crowdsec/notifications/http.yaml`
- **FreeBSD** `/usr/local/etc/crowdsec/notifications/http.yaml`
- **Windows** `C:\ProgramData\CrowdSec\config\notifications\http.yaml`

Then replace the `url` and the `format` of the plugin's config so that it posts the events to your Elasticsearch instance.

### Base configuration

An example configuration:

```yaml
type: http

name: http_default # this must match with the registered plugin in the profile
log_level: debug # Options include: trace, debug, info, warn, error, off

format: |-
 {{ range .}}
  {"index": { "_index": "crowdsec"} }
  {{.|toJson}}
 {{ end }}

url: http://127.0.0.1:9200/_bulk

method: POST
headers:
 Content-Type: "application/json"
```


### Authentication

If you have enabled security on your elasticsearch cluster, you will have to add a custom `Authorization` header to be able to insert the events.

Elasticsearch uses HTTP basic auth, so you can very easily generate the header value by running:
```shell
echo -n "LOGIN:PASSWORD" | base64 -w0
```

Then add it to your configuration:

```yaml
type: http

name: http_default # this must match with the registered plugin in the profile
log_level: debug # Options include: trace, debug, info, warn, error, off

format: |-
 {{ range .}}
  {"index": { "_index": "crowdsec"} }
  {{.|toJson}}
 {{ end }}

url: http://127.0.0.1:9200/_bulk

method: POST
headers:
  Content-Type: "application/json"
  Authorization: "Basic BASE64_GENERATED_PREVIOUSLY"
```


### Self-Signed certificate

If your elasticsearch cluster uses a self-signed certificate, you must set `skip_tls_verification` to `true` in your configuration:
```yaml
type: http

name: http_default # this must match with the registered plugin in the profile
log_level: debug # Options include: trace, debug, info, warn, error, off

format: |-
 {{ range .}}
  {"index": { "_index": "crowdsec"} }
  {{.|toJson}}
 {{ end }}

url: http://127.0.0.1:9200/_bulk
skip_tls_verification: true
method: POST
headers:
 Content-Type: "application/json"

```

### Potential mapping issues

If you are facing errors because mapper complains about field types inference, ie:

```
mapper [events.meta.value] cannot be changed from type [date] to [text]
```

You can create mapping in advance:

```bash
#!/usr/bin/env bash

curl -X PUT \
    --data "@index_template.json" \
    -u user:password \
    -H "Content-Type: application/json" \
    http://127.0.0.1:9200/_index_template/crowdsec
```

With a mapping such as:

```json
{
    "version": 1,
    "index_patterns": ["crowdsec*"],
    "priority": 500,
    "_meta": {
        "description": "Crowdsec notification index template"
    },
    "template": {
        "settings": {
            "number_of_shards": 1
        },
        "mappings": {
            "properties": {
                "capacity": {
                    "type": "integer"
                },
                "decisions": {
                    "properties": {
                        "duration": {
                            "type": "text",
                            "fields": {
                                "keyword": {
                                    "type": "keyword",
                                    "ignore_above": 256
                                }
                            }
                        },
                        "origin": {
                            "type": "text",
                            "fields": {
                                "keyword": {
                                    "type": "keyword",
                                    "ignore_above": 256
                                }
                            }
                        },
                        "scenario": {
                            "type": "text",
                            "fields": {
                                "keyword": {
                                    "type": "keyword",
                                    "ignore_above": 256
                                }
                            }
                        },
                        "scope": {
                            "type": "text",
                            "fields": {
                                "keyword": {
                                    "type": "keyword",
                                    "ignore_above": 256
                                }
                            }
                        },
                        "type": {
                            "type": "text",
                            "fields": {
                                "keyword": {
                                    "type": "keyword",
                                    "ignore_above": 256
                                }
                            }
                        },
                        "value": {
                            "type": "text",
                            "fields": {
                                "keyword": {
                                    "type": "keyword",
                                    "ignore_above": 256
                                }
                            }
                        }
                    }
                },
                "events": {
                    "properties": {
                        "meta": {
                            "properties": {
                                "key": {
                                    "type": "text",
                                    "fields": {
                                        "keyword": {
                                            "type": "keyword",
                                            "ignore_above": 256
                                        }
                                    }
                                },
                                "value": {
                                    "type": "text",
                                    "fields": {
                                        "keyword": {
                                            "type": "keyword",
                                            "ignore_above": 256
                                        }
                                    }
                                }
                            }
                        },
                        "timestamp": {
                            "type": "date"
                        }
                    }
                },
                "events_count": {
                    "type": "integer"
                },
                "leakspeed": {
                    "type": "text",
                    "fields": {
                        "keyword": {
                            "type": "keyword",
                            "ignore_above": 256
                        }
                    }
                },
                "machine_id": {
                    "type": "text",
                    "fields": {
                        "keyword": {
                            "type": "keyword",
                            "ignore_above": 256
                        }
                    }
                },
                "message": {
                    "type": "text",
                    "fields": {
                        "keyword": {
                            "type": "keyword",
                            "ignore_above": 256
                        }
                    }
                },
                "remediation": {
                    "type": "boolean"
                },
                "scenario": {
                    "type": "text",
                    "fields": {
                        "keyword": {
                            "type": "keyword",
                            "ignore_above": 256
                        }
                    }
                },
                "scenario_hash": {
                    "type": "text",
                    "fields": {
                        "keyword": {
                            "type": "keyword",
                            "ignore_above": 256
                        }
                    }
                },
                "scenario_version": {
                    "type": "text",
                    "fields": {
                        "keyword": {
                            "type": "keyword",
                            "ignore_above": 256
                        }
                    }
                },
                "simulated": {
                    "type": "boolean"
                },
                "source": {
                    "properties": {
                        "as_number": {
                            "type": "text",
                            "fields": {
                                "keyword": {
                                    "type": "keyword",
                                    "ignore_above": 256
                                }
                            }
                        },
                        "cn": {
                            "type": "text",
                            "fields": {
                                "keyword": {
                                    "type": "keyword",
                                    "ignore_above": 256
                                }
                            }
                        },
                        "ip": {
                            "type": "ip"
                        },
                        "latitude": {
                            "type": "float"
                        },
                        "longitude": {
                            "type": "float"
                        },
                        "scope": {
                            "type": "text",
                            "fields": {
                                "keyword": {
                                    "type": "keyword",
                                    "ignore_above": 256
                                }
                            }
                        },
                        "value": {
                            "type": "text",
                            "fields": {
                                "keyword": {
                                    "type": "keyword",
                                    "ignore_above": 256
                                }
                            }
                        }
                    }
                },
                "start_at": {
                    "type": "date"
                },
                "stop_at": {
                    "type": "date"
                }
            }
        }
    }
}
```

And then use for example a daily index:

```yaml
type: http

name: elasticsearch
log_level: debug # Options include: trace, debug, info, warn, error, off

format: |-
 {{ range .}}
  {"index": { "_index": "crowdsec-{{ substr 0 10 .StartAt }}"} }
  {{.|toJson}}
 {{ end }}
url: http://127.0.0.1:9200/_bulk

method: POST
headers:
  Content-Type: "application/json"
  Authorization: "Basic [redacted]"
```

## Testing the plugin

Before enabling the plugin it is best to test the configuration so the configuration is validated and you can see the output of the plugin. 

```bash
cscli notifications test http_default
```

:::note
If you have changed the `name` property in the configuration file, you should replace `http_default` with the new name.
:::

## Enabling the plugin

In your profiles you will need to uncomment the `notifications` key and the `http_default` plugin list item.

```
#notifications:
# - http_default 
```

:::note
If you have changed the `name` property in the configuration file, you should replace `http_default` with the new name.
:::

:::warning
Ensure your YAML is properly formatted the `notifications` key should be at the top level of the profile.
:::

<details>

<summary>Example profile with http plugin enabled</summary>

```yaml
name: default_ip_remediation
#debug: true
filters:
 - Alert.Remediation == true && Alert.GetScope() == "Ip"
decisions:
 - type: ban
   duration: 4h
#duration_expr: Sprintf('%dh', (GetDecisionsCount(Alert.GetValue()) + 1) * 4)
#highlight-next-line
notifications:
#highlight-next-line
  - http_default
on_success: break
```

</details>

## Final Steps:

Let's restart crowdsec

```bash
sudo systemctl restart crowdsec
```

You can verify whether the plugin is properly working by triggering scenarios using tools like wapiti, nikto  and then checking whether they reeach Elasticsearch.