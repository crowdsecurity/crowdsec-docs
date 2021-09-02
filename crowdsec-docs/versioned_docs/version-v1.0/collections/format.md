---
id: format
title: Format
sidebar_position: 2
---

## Scenario configuration example


```yaml title=/etc/crowdsec/collections/linux.yaml
#the list of parsers it contains
parsers:
  - crowdsecurity/syslog-logs
  - crowdsecurity/geoip-enrich
  - crowdsecurity/dateparse-enrich
#the list of collections it contains
collections:
  - crowdsecurity/sshd
# the list of postoverflows it contains
# postoverflows:
#   - crowdsecurity/seo-bots-whitelist
# the list of scenarios it contains
# scenarios:
#   - crowdsecurity/http-crawl-non_statics
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


### `scenarios`

```yaml
scenarios: <list_of_scenarios>
```

List of scenarios to include in the collection.

### `postoverflows`

```yaml
postoverflows: <list_of_postoverflows>
```

List of postoverflows to include in the collection.

The `description` is mandatory.

It is a quick sentence describing what it detects.

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

