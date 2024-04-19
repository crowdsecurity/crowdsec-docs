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


It exposes a few methods : `GeoIpCity` `GeoIpASN` and `IpToRange` that are used by the postoverflow `crowdsecurity/rdns` and  the parsers `crowdsecurity/geoip-enrich` and `crowdsecurity/dateparse-enrich`.
Enrichers can be installed as any other parsers with the following command:

```
sudo cscli parsers install crowdsecurity/geoip-enrich
```

#### GeoIpCity

This method uses an Ip as an input, and tries to give information on
this IP on return. It requires the maxmind database to be installed,
which is done at the parser `crowdsecurity/geoip-enrich` installation.
It will fill the fields `Enriched.Isocode` with county ISO code and
`Enriched.IsInEU` with the string `true` of `false`. It fills also
`Enriched.Latitude` and `Enriched.Longitude` with the latitude and
longitude.

#### GeoIpASN

This method uses an Ip as an input, and tries to give information on
this IP on return. It requires the maxmind database to be installed,
which is done at the parser `crowdsecurity/geoip-enrich` installation.
This method fill the fields `Enriched.ASNNUMBER` and
`Enriched.ASNumber` with the AS Number and `Enriched.ASNOrg` with the
AS organiszation name

#### IpToRange

This method uses an Ip as an input, and tries to corresponding
registered range on return. It requires the maxmind database to be
installed, which is done at the parser `crowdsecurity/geoip-enrich`
installation. The field `Enriched.SourceRange` is filled with the
source range information.

#### reverse_dns

This methode uses an Ip as an input, and give the result of the
reverse dns lookup. It fills the field `Enriched.reverse_dns` with the
reverse dns information.

#### ParseDate

This method uses a date string as an input and tries to understand the
date. This is used by the `crowdsecurity/dateparse-enrich` enricher to
make crowdsec understand when the event took place. In case the date
is not understood by crowdsec, the timestamp used is the time when the
parsing is taking place.
