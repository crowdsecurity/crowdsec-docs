---
id: file_helpers
title: File helpers
sidebar_position: 3
---

:::info
File helpers do not load the file into memory, but rather use a cache on initial startup to avoid loading the same file multiple times. Please see [the data property](/scenarios/format.md#data) on how to configure the Security Engine to load the file.
:::

### `File(FileName) []string`

Returns the content of `FileName` as an array of string, while providing cache mechanism.

> `evt.Parsed.some_field in File('some_patterns.txt')`

> `any(File('rdns_seo_bots.txt'), { evt.Enriched.reverse_dns endsWith #})`

### `RegexpInFile(StringToMatch, FileName) bool`

Returns `true` if the `StringToMatch` is matched by one of the expressions contained in `FileName` (uses RE2 regexp engine).

> `RegexpInFile( evt.Enriched.reverse_dns, 'my_legit_seo_whitelists.txt')`