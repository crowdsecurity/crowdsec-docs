---
id: template_helpers
title: Templating helpers
---

In order to simplify some operation in the templates, we provide some custom helpers.

## Sprig

The [Sprig](https://masterminds.github.io/sprig/) library is available in the templates, and provides a lot of useful functions. Refer to the sprig documentation for more information.

## Crowdsec specific helpers

### `HTMLEscape`

:::info
When displaying untrusted data sources, such as metadata (for example, URIs), it is best to use this function to prevent the data from being rendered in notifications that support HTML format, such as emails.
:::

The string is processed through the [`html.EscapeString`](https://pkg.go.dev/html#EscapeString) function, which converts special characters into their HTML-encoded equivalents.

```go
{{ "I am <img src=x /> not escaped" }} // I am <img src=x /> not escaped
{{ "I am <img src=x /> escaped" | HTMLEscape }} // I am &lt;img src=x /&gt; escaped
```

:::note
This function only escapes five specific characters:

| Character | Escape Sequence |
|-----------|-----------------|
| `<`       | `&lt;`          |
| `>`       | `&gt;`          |
| `&`       | `&amp;`         |
| `'`       | `&#39;`         |
| `"`       | `&quot;`        |

It does not provide comprehensive sanitization.
:::

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
