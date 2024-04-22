---
id: template_helpers
title: Templating helpers
---

In order to simplify some operation in the templates, we provide some custom helpers.

## Sprig

The [Sprig](https://masterminds.github.io/sprig/) library is available in the templates, and provides a lot of useful functions. Refer to the sprig documentation for more information.

## Crowdsec specific helpers

### `Hostname`

Returns the hostname of the machine running crowdsec.

### `GetMeta(alert, key)`

Return the list of meta values for the given key in the specified alert.

```go
{{ range . }}
{{ $alert := .}}
{{ GetMeta $alert "username"}}
{{ end }}
```

### `CrowdsecCTI`

Queries the crowdsec CTI API to get information about an IP based on the smoke database.

Documentation on the available fields and methods is [here](https://pkg.go.dev/github.com/crowdsecurity/crowdsec/pkg/cticlient#SmokeItem).

```go
  {{range . -}}
  {{$alert := . -}}
  :flag-{{$alert.Source.Cn}}: <https://app.crowdsec.net/cti/{{$alert.Source.IP}}|{{$alert.Source.IP}}> triggered *{{$alert.Scenario}}* ({{$alert.Source.AsName}}) : Maliciousness Score is 
  {{- $cti := $alert.Source.IP | CrowdsecCTI  -}}
  {{" "}}{{mulf $cti.GetMaliciousnessScore 100 | floor}} %
  {{- end }}
```