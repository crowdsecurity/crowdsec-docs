---
id: elastic
title: Elasticsearch
---

Elasticsearch can be integrated with CrowdSec by using the HTTP plugin. Enable it by following these [instructions](/notification_plugins/http.md) . 

Then replace the `url` and the `format` of the plugin's config so that it posts the events to your Elasticsearch instance.

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


## Final Steps:

Let's restart crowdsec

```bash
sudo systemctl restart crowdsec
```

You can verify whether the plugin is properly working by triggering scenarios using tools like wapiti, nikto  and then checking whether they reeach Elasticsearch.