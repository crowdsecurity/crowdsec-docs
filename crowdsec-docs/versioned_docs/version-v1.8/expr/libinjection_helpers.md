---
id: libinjection_helpers
title: LibInjection helpers
sidebar_position: 3
---

### `LibInjectionIsSQLI(str) bool`

Use [libinjection](https://github.com/libinjection/libinjection) to detect SQL injection in `str`.

> `LibInjectionIsSQLI(evt.Parsed.http_args)`

### `LibInjectionIsXSS(str) bool`

Use [libinjection](https://github.com/libinjection/libinjection) to detect XSS in `str`.

> `LibInjectionIsXSS(evt.Parsed.http_args)`