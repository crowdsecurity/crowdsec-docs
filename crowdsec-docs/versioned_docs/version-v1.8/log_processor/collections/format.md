---
id: format
title: Format
sidebar_position: 2
---

## Collection configuration example


```yaml title="/etc/crowdsec/collections/my-collection.yaml"
# List the Hub items included in this collection.
# Names are the same as in `cscli ... list -a` (for example: `cscli scenarios list -a`).
#
# the list of parsers it contains
parsers:
  - crowdsecurity/syslog-logs
  - crowdsecurity/geoip-enrich
  - crowdsecurity/dateparse-enrich
#the list of collections it contains
collections:
  - crowdsecurity/sshd
# the list of contexts it contains
# contexts:
#   - crowdsecurity/http_base
# the list of postoverflows it contains
# postoverflows:
#   - crowdsecurity/seo-bots-whitelist
# the list of scenarios it contains
# scenarios:
#   - crowdsecurity/http-crawl-non_statics
# the list of appsec-rules it contains (WAF rules)
# appsec-rules:
#   - crowdsecurity/crs
# the list of appsec-configs it contains (WAF configurations)
# appsec-configs:
#   - crowdsecurity/virtual-patching
description: "core linux support : syslog+geoip+ssh"
author: crowdsecurity
tags:
  - linux
```

## Collection directives


### `parsers`


```yaml
parsers: <list_of_parsers>
```

List of parsers to include in the collection.

### `collections`

```yaml
collections: <list_of_collections>
```

List of collections to include (collections can include other collections).


### `scenarios`

```yaml
scenarios: <list_of_scenarios>
```

List of scenarios to include in the collection.

### `contexts`

```yaml
contexts: <list_of_contexts>
```

List of alert context definitions to include in the collection. Contexts enrich alerts with additional key/value fields and are stored under the `contexts` directory in the CrowdSec configuration.

See [Alert Context](/log_processor/alert_context/intro.md) and the `cscli` commands used to manage Hub contexts: [`cscli contexts`](/cscli/cscli_contexts.md).

### `postoverflows`

```yaml
postoverflows: <list_of_postoverflows>
```

List of postoverflows to include in the collection.

See [Postoverflows](/log_processor/parsers/introduction.mdx#postoverflows).

### `appsec-rules`

```yaml
appsec-rules: <list_of_appsec_rules>
```

List of AppSec (WAF) rules to include in the collection.

See [AppSec](/appsec/intro.md) and [`cscli appsec-rules`](/cscli/cscli_appsec-rules.md).

### `appsec-configs`

```yaml
appsec-configs: <list_of_appsec_configs>
```

List of AppSec configuration items to include in the collection (these define which rules are evaluated and how matches are handled).

See [AppSec configuration](/appsec/configuration.md) and [`cscli appsec-configs`](/cscli/cscli_appsec-configs.md).

### `description`

```yaml
description: <short_description>
```

The `description` is mandatory.

It is a quick sentence describing what it detects.

### `author`

```yaml
author: <name_of_the_author>
```

The name of the author.


### `tags`

```yaml
tags: <list_of_tags>
```

List of tags.
