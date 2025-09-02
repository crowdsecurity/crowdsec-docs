---
id: json_helpers
title: JSON/XML/KV Helpers
sidebar_position: 2
---

## JSON Helpers

### `UnmarshalJSON(jsonBlob string, out map[string]interface{}, targetKey string)`

`UnmarshalJSON` allows to unmarshal a full json object into the `out` map, under the `targetKey` key.

In most situation, the `evt.Unmarshaled` field will be used to store the unmarshaled json object.

```yaml
filter: |
  evt.Parsed.program == "my-program"
statics:
  - parsed: json_parsed
    expression: UnmarshalJSON(evt.Line.Raw, evt.Unmarshaled, "message")
  - meta: user
    expression: evt.Unmarshaled.message.user
```


### `JsonExtract(JsonBlob, FieldName) string`

Extract the `FieldName` from the `JsonBlob` and returns it as a string. (binding on [jsonparser](https://github.com/buger/jsonparser/))

> `JsonExtract(evt.Parsed.some_json_blob, "foo.bar[0].one_item")`

### `JsonExtractSlice(JsonBlob, FieldName) []interface{}`

Extract the JSON array in `FieldName` from `JsonBlob` and returns it as a go slice.

Returns nil if the field does not exist or is not an array.

> `JsonExtractSlice(evt.Parsed.message, "params")[0]['value']['login']`

> `any(JsonExtractSlice(evt.Parsed.message, "params"), {.key == 'user' && .value.login != ''})`

### `JsonExtractObject(JsonBlob, FieldName) map[string]interface{}`

Extract the JSON object in `FieldName` from `JsonBlob` and returns it as a go map.

Returns `nil` if the field does not exist or does is not an object.

> `JsonExtractObject(evt.Parsed.message, "params.user")["login"]`

### `ToJsonString(Obj) string`

Returns the JSON representation of `obj`

Returns an empty string if `obj` cannot be serialized to JSON.

> `ToJsonString(JsonExtractSlice(evt.Parsed.message, "params"))`


## XML Helpers


### `XMLGetAttributeValue(xmlString string, path string, attributeName string) string`

Returns the value of `attribute` in the XML node identified by the XPath query `path`.

> `XMLGetAttributeValue(evt.Line.Raw, "/Event/System[1]/Provider", "Name")`

### `XMLGetNodeValue(xmlString string, path string) string`

Returns the content of the XML node identified by the XPath query `path`.

> `XMLGetNodeValue(evt.Line.Raw, "/Event/System[1]/EventID")`


## Key-Value Helpers

### `ParseKV(kvString string, out map[string]interface{}, targetKey string)`

Parse a key-value string (such as `key=value foo=bar fu="a string"` ) into the `out` map, under the `targetKey` key.

In most situation, the `evt.Unmarshaled` field will be used to store the object.

```yaml
filter: |
  evt.Parsed.program == "my-program"
statics:
  - parsed: kv_parsed
    expression: ParseKV(evt.Line.Raw, evt.Unmarshaled, "message")
  - meta: user
    expression: evt.Unmarshaled.message.user
```
