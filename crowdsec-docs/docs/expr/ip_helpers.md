---
id: ip_helpers
title: IP helpers
sidebar_position: 3
---

## IP Helpers


### `IpInRange(IPStr, RangeStr) bool`

Returns true if the IP `IPStr` is contained in the IP range `RangeStr` (uses `net.ParseCIDR`)

> `IpInRange("1.2.3.4", "1.2.3.0/24")`

### `IpToRange(IPStr, MaskStr) IpStr`

Returns the subnet of the IP with the request cidr size.
It is intended for scenarios taking actions against the range of an IP, not the IP itself :

```yaml
type: leaky
...
scope:
 type: Range
 expression: IpToRange(evt.Meta.source_ip, "/16")
```

> `IpToRange("192.168.0.1", "24")` returns `192.168.0.0/24`

> `IpToRange("192.168.42.1", "16")` returns `192.168.0.0/16`


### `IsIP(ip string) bool`

Returns true if it's a valid IP (v4 or v6).

> `IsIP("2001:0db8:85a3:0000:0000:8a2e:0370:7334")`

> `IsIP("1.2.3.4")`

> `IsIP(Alert.GetValue())`


### `IsIPV4(ip string) bool`

Returns true if it's a valid IPv4.

> `IsIPV4("1.2.3.4")`

> `IsIPV4(Alert.GetValue())`

### `IsIPV6(ip string) bool`

Returns true if it's a valid IPv6.

> `IsIPV6("2001:0db8:85a3:0000:0000:8a2e:0370:7334")`

> `IsIPV6(Alert.GetValue())`

### `LookupHost(host string) []string`

:::warning
* Only use this function within postoverflows as it is can be very slow
* Note if you whitelist a domain behind a CDN provider, all domains using the same CDN provider will also be whitelisted
* Do not use variables within the function as this can be untrusted user input
:::
Returns []string ip addresses that resolvable to the hostname EG: `LookupHost('mydomain.tld') => ['1.2.3.4', '5.6.7.8']`
```yaml
name: me/my_cool_whitelist
description: lets whitelist our own IP
whitelist:
  reason: dont ban my IP
  expression:
    - evt.Overflow.Alert.Source.IP in LookupHost('mydomain.tld')
# This can be useful when you have a dynamic ip and use dynamic DNS providers
```

### `GeoIPEnrich(ip string) *geoip2.City`

Performs a geo lookup for IP and returns the associated [geoip2.City](https://pkg.go.dev/github.com/oschwald/geoip2-golang#City) object.


### `GeoIPASNEnrich(ip string) *geoip2.ASN`

Performs a geo lookup for IP and returns the associated [geoip2.ASN](https://pkg.go.dev/github.com/oschwald/geoip2-golang#ASN) object.

### `GeoIPRangeEnrich(ip string) net.IPNet`

Returns the `net.IPNet` object associated to the IP if possible.
