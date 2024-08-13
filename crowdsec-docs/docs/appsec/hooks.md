---
id: hooks
title: Hooks
sidebar_position: 4
---

The Application Security Component allows you to hook at different stages to change its behavior at runtime.

The three phases are:
 - `on_load`: Called just after the rules have been loaded into the engine.
 - `pre_eval`: Called after a request has been received but before the rules are evaluated.
 - `post_eval`: Called after the rules have been evaluated.
 - `on_match`: Called after a successful match of a rule. If multiple rules, this hook will be called only once.

## Using hooks

Hooks are configured in your `appsec-config` file.

`on_load` hook only supports `apply`, while other hooks support `filter` and `apply` parameters.

Both `filter` and `apply` of the same phase have access to the same helpers.

Except for `on_load`, hooks can be called twice per request: once for in-band processing and once for out-of-band processing, thus it is recommended to use the `IsInBand` and `IsOutBand` variables to filter the hook.


Hooks have the following format:

```yaml
on_match:
  - filter: IsInBand && 1 == 1
    apply:
    - valid expression
    - valid expression
```

If the filter returns `true`, each of the expressions in the `apply` section are executed.


<!-- once https://github.com/crowdsecurity/crowdsec-docs/issues/555 is fixed, document on_success-->

### `on_load`

This hook is intended to be used to disable rules at loading (eg, to temporarily disable a rule that is causing false positives).


#### Available helpers

| Helper Name               | Type                                 | Description                                                                                             |
| ------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| `RemoveInBandRuleByName`  | `func(tag str)`                      | Disable the named in-band rule                                                                          |
| `RemoveInBandRuleByTag`   | `func(tag str)`                      | Disable the in-band rule identified by the tag (multiple rules can have the same tag)                   |
| `RemoveInBandRuleByID`    | `func(id int)`                       | Disable the in-band rule identified by the ID                                                           |
| `RemoveOutBandRuleByName` | `func(tag str)`                      | Disable the named out-of-band rule                                                                      |
| `RemoveOutBandRuleByTag`  | `func(tag str)`                      | Disable the out-of-band rule identified by the tag (multiple rules can have the same tag)               |
| `RemoveOutBandRuleByID`   | `func(id int)`                       | Disable the out-of-band rule identified by the ID                                                       |
| `SetRemediationByTag`     | `func(tag str, remediation string)`  | Change the remediation of the in-band rule identified by the tag (multiple rules can have the same tag) |
| `SetRemediationByID`      | `func(id int, remediation string)`   | Change the remediation of the in-band rule identified by the ID                                         |
| `SetRemediationByName`    | `func(name str, remediation string)` | Change the remediation of the in-band rule identified by the name                                       |

##### Example

```yaml
name: crowdsecurity/my-appsec-config
default_remediation: ban
inband_rules:
 - crowdsecurity/base-config
 - crowdsecurity/vpatch-*
on_load:
 - apply:
    - RemoveInBandRuleByName("my_rule")
    - SetRemediationByTag("my_tag", "captcha")
```


### `pre_eval`

This hook is intended to be used to disable rules only for this particular request (eg, to disable a rule for a specific IP).

#### Available helpers

| Helper Name               | Type                                 | Description                                                                                             |
| ------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| `RemoveInBandRuleByName`  | `func(tag str)`                      | Disable the named in-band rule                                                                          |
| `RemoveInBandRuleByTag`   | `func(tag str)`                      | Disable the in-band rule identified by the tag (multiple rules can have the same tag)                   |
| `RemoveInBandRuleByID`    | `func(id int)`                       | Disable the in-band rule identified by the ID                                                           |
| `RemoveOutBandRuleByName` | `func(tag str)`                      | Disable the named out-of-band rule                                                                      |
| `RemoveOutBandRuleByTag`  | `func(tag str)`                      | Disable the out-of-band rule identified by the tag (multiple rules can have the same tag)               |
| `RemoveOutBandRuleByID`   | `func(id int)`                       | Disable the out-of-band rule identified by the ID                                                       |
| `IsInBand`                | `bool`                               | `true` if the request is in the in-band processing phase                                                |
| `IsOutBand`               | `bool`                               | `true` if the request is in the out-of-band processing phase                                            |
| `SetRemediationByTag`     | `func(tag str, remediation string)`  | Change the remediation of the in-band rule identified by the tag (multiple rules can have the same tag) |
| `SetRemediationByID`      | `func(id int, remediation string)`   | Change the remediation of the in-band rule identified by the ID                                         |
| `SetRemediationByName`    | `func(name str, remediation string)` | Change the remediation of the in-band rule identified by the name                                       |
| `req`                     | `http.Request`                       | Original HTTP request received by the remediation component                                             |

#### Example

```yaml
name: crowdsecurity/my-appsec-config
default_remediation: ban
inband_rules:
 - crowdsecurity/base-config
 - crowdsecurity/vpatch-*
pre_eval:
 - filter: IsInBand == true && req.RemoteAddr == "42.42.42.42"
   apply:
    - RemoveInBandRuleByName("my_rule")
```

### `post_eval`

This hook is mostly intended for debugging or threat-hunting purposes.

#### Available helpers
| Helper Name   | Type           | Description                                                  |
| ------------- | -------------- | ------------------------------------------------------------ |
| `IsInBand`    | `bool`         | `true` if the request is in the in-band processing phase     |
| `IsOutBand`   | `bool`         | `true` if the request is in the out-of-band processing phase |
| `DumpRequest` | `func()`       | Dump the request to a file                                   |
| `req`         | `http.Request` | Original HTTP request received by the remediation component  |

#### DumpRequest

In order to make `DumpRequest` write your request to a file, you have to call `DumpRequest().ToJSON()`, which will create a file in the OS temporary directory (eg, `/tmp` on Linux) with the following format: `crowdsec_req_dump_<RANDOM_PART>.json`.

You can configure what is dumped with the following options:
 - `DumpRequest().NoFilters()`: Clear any previous filters (ie. dump everything)
 - `DumpRequest().WithEmptyHeadersFilters()`: Clear the headers filters, ie. dump all the headers
 - `DumpRequest().WithHeadersContentFilter(regexp string)`: Add a filter on the content of the headers, ie. dump only the headers that *do not* match the provided regular expression
 - `DumpRequest().WithHeadersNameFilter(regexp string)`: Add a filter on the name of the headers, ie. dump only the headers that *do not* match the provided regular expression
 - `DumpRequest().WithNoHeaders()`: Do not dump the request headers
 - `DumpRequest().WithHeaders()`: Dump all the request headers (override any previous filter)
 - `DumpRequest().WithBody()`: Dump the request body
 - `DumpRequest().WithNoBody()`: Do not dump the request body
 - `DumpRequest().WithEmptyArgsFilters()`: Clear the query parameters filters, ie. dump all the query parameters
 - `DumpRequest().WithArgsContentFilter(regexp string)`: Add a filter on the content of the query parameters, ie. dump only the query parameters that *do not* match the provided regular expression
 - `DumpRequest().WithArgsNameFilter(regexp string)`: Add a filter on the name of the query parameters, ie. dump only the query parameters that *do not* match the provided regular expression

By default, everything is dumped.
All regexps are case-insensitive.

You can chain the options, for example: 
```
DumpRequest().WithNoBody().WithArgsNameFilter("var1").WithArgsNameFilter("var2").ToJSON()
```
This will discard the body of the request, remove the query parameters `var1` and `var2` from the dump, and dump everything else.

#### Example

```yaml
name: crowdsecurity/my-appsec-config
default_remediation: ban
inband_rules:
 - crowdsecurity/base-config
 - crowdsecurity/vpatch-*
post_eval:
 - filter: IsInBand == true
   apply:
    - DumpRequest().NoFilters().WithBody().ToJSON()
```

### `on_match`

This hook is intended to be used to change the behavior of the engine after a match (eg, to change the remediation that will be used dynamically).

#### Available helpers

| Helper Name      | Type                       | Description                                                               |
| ---------------- | -------------------------- | ------------------------------------------------------------------------- |
| `SetRemediation` | `func(remediation string)` | Change the remediation that will be returned to the remediation component |
| `SetReturnCode`  | `func(code int)`           | Change the HTTP code that will be returned to the remediation component   |
| `CancelAlert`    | `func()`                   | Prevent the Application Security Component to create a crowdsec alert     |
| `SendAlert`      | `func()`                   | Force the Application Security Component to create a crowdsec alert       |
| `CancelEvent`    | `func()`                   | Prevent the Application Security Component to create a crowdsec event     |
| `SendEvent`      | `func()`                   | Force the Application Security Component to create a crowdsec event       |
| `DumpRequest`    | `func()`                   | Dump the request to a file (see previous section for detailed usage)      |
| `IsInBand`       | `bool`                     | `true` if the request is in the in-band processing phase                  |
| `IsOutBand`      | `bool`                     | `true` if the request is in the out-of-band processing phase              |
| `evt`            | `types.Event`              | [The event that has been generated](/docs/expr/event.md#appsec-helpers) by the Application Security Component   |
| `req`            | `http.Request`             | Original HTTP request received by the remediation component               |

#### Example

```yaml
name: crowdsecurity/my-appsec-config
default_remediation: ban
inband_rules:
 - crowdsecurity/base-config
 - crowdsecurity/vpatch-*
post_eval:
 - filter: IsInBand == true && req.RemoteAddr == "42.42.42.42"
   apply:
    - CancelAlert()
    - CancelEvent()
  - filter: |
      any( evt.Appsec.MatchedRules, #.name == "crowdsecurity/vpatch-env-access") and
      req.RemoteAddr = "42.42.42.42"
    apply:
    - SetRemediation("allow")
  - filter: evt.Appsec.MatchedRules.GetURI() contains "/foobar/"
    apply:
     - SetRemediation("allow")
```

## Detailed Helpers Information

### `SetRemediation*`

When using `SetRemediation*` helpers, the only special value is `allow`: the remediation component won't block the request.
Any other values (including `ban` and `captcha`) are transmitted as-is to the remediation component.




