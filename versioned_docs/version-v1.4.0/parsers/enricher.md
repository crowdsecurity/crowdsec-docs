---
id: enricher
title: Enrichers
sidebar_position: 4
---


# Enrichers

Enrichers are [parsers](/parsers/introduction.mdx) that can rely on external methods to provide extra contextual information to the event. The enrichers are usually in the `s02-enrich`  [stage](/parsers/introduction.mdx#stages) (after most of the parsing happened).

Enrichers functions should all accept a string as a parameter, and return an associative string array, that will be automatically merged into the `Enriched` map of the [`Event`](/expr/event.md).

:::warning

At the time of writing, enrichers plugin mechanism implementation is still ongoing (read: the list of available enrichment methods is currently hardcoded).

:::

As an example let's look into the geoip-enrich parser/enricher :

It relies on [the geolite2 data created by maxmind](https://www.maxmind.com) and the [geoip2 golang module](https://github.com/oschwald/geoip2-golang) to provide the actual data.


It exposes three methods : `GeoIpCity` `GeoIpASN` and `IpToRange` that are used by the `crowdsecurity/geoip-enrich`.
Enrichers can be installed as any other parsers with the following command:

```
sudo cscli parsers install crowdsecurity/geoip-enrich
```

Take a tour at the [Hub](https://hub.crowdsec.net/) to find them !
