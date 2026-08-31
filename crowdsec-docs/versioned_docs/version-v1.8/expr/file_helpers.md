---
id: file_helpers
title: File helpers
sidebar_position: 3
---

:::info
File helpers do not load the file into memory, but rather use a cache on initial startup to avoid loading the same file multiple times. Please see [the data property](/log_processor/scenarios/format.md#data) on how to configure the Security Engine to load the file.
:::

### `File(FileName) []string`

Returns the content of `FileName` as an array of string, while providing cache mechanism.

> `evt.Parsed.some_field in File('some_patterns.txt')`

> `any(File('rdns_seo_bots.txt'), { evt.Enriched.reverse_dns endsWith #})`

### `RegexpInFile(StringToMatch, FileName) bool`

Returns `true` if the `StringToMatch` is matched by one of the expressions contained in `FileName` (uses RE2 regexp engine).

> `RegexpInFile( evt.Enriched.reverse_dns, 'my_legit_seo_whitelists.txt')`

## Map file helpers

Map file helpers work with JSON-lines files loaded with `type: map` in the [data property](/log_processor/scenarios/format.md#data). Each line in the file is a JSON object with three required fields:

- `pattern`: the value to match against
- `tag`: the label returned on match
- `type`: one of `equals` (exact match), `contains` (substring match), or `regex` (RE2 regular expression)

Example map file:

```json
{"pattern": "/wp-admin/", "tag": "WordPress", "type": "contains"}
{"pattern": "/specific/endpoint.php", "tag": "SpecificApp", "type": "equals"}
{"pattern": "/wp-content/plugins/[^/]+/readme\\.txt", "tag": "WordPress-Plugin", "type": "regex"}
```

Comments (lines starting with `#`) and blank lines are ignored.

### `FileMap(FileName) []map[string]string`

Returns the content of `FileName` as an array of maps. Each element is a map with the keys from the JSON object (`pattern`, `tag`, `type`).

> `FileMap('app_signatures.json')`

> `any(FileMap('app_signatures.json'), { #.tag == 'WordPress' })`

### `LookupFile(StringToMatch, FileName) string`

Searches the map file `FileName` for a match against `StringToMatch`. Returns the `tag` of the first matching entry, or an empty string if no match is found.

Matching is performed in priority order:
1. **Exact match** (`equals` entries) — O(1) hash map lookup
2. **Substring match** (`contains` entries) — using [Aho-Corasick](https://en.wikipedia.org/wiki/Aho%E2%80%93Corasick_algorithm) automaton
3. **Regex match** (`regex` entries) — RE2 regular expressions

> `LookupFile(evt.Parsed.request, 'app_signatures.json')`

> `LookupFile(evt.Parsed.request, 'app_signatures.json') != ''`