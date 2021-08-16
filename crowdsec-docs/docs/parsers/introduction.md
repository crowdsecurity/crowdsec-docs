---
id: intro
title: Introduction
sidebar_position: 1
---

A parser is a YAML configuration file that describes how a string is being parsed. Said string can be a log line, or a field extracted from a previous parser. 

While a lot of parsers rely on the **GROK** approach (a.k.a regular expression named capture groups), parsers can as well reference enrichment modules to allow specific data processing, or use specific [expr](../expr) feature to perform parsing on specific data, such as JSON.

Parsers are organized into stages to allow pipelines and branching in parsing.

See the [Hub](https://hub.crowdsec.net/browse/#configurations) to explore parsers, or see below some examples :

 - [apache2 access/error log parser](https://github.com/crowdsecurity/hub/blob/master/parsers/s01-parse/crowdsecurity/apache2-logs.yaml)
 - [iptables logs parser](https://github.com/crowdsecurity/hub/blob/master/parsers/s01-parse/crowdsecurity/iptables-logs.yaml)
 - [http logs post-processing](https://github.com/crowdsecurity/hub/blob/master/parsers/s02-enrich/crowdsecurity/http-logs.yaml)

The parsers usually reside in `/etc/crowdsec/parsers/<STAGE>/`.
