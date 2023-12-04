---
id: hooks
title: Hooks
sidebar_position: 4
---

The Application Security Engine allows you to hook at different stages in order to change its behavior at runtime.

The three phases are:
 - `on_load`: Called just after the rules have been loaded into the engine.
 - `pre_eval`: Called after a request has been received but before the rules are evaluated.
 - `on_match`: Called after a successful match of a rules. If multiple rules, this hook will be called only once.



### `on_load`

This hook is intended to be used to disable rules at loading (eg, to temporarily disable a rule that is causing false positives).


#### Available helpers

| Helper Name | Type | Description |
| --- | --- | --- |
| `RemoveInBandRuleByName` | `func(tag str)` | Disable the named in-band rule |
| `RemoveInBandRuleByTag` | `func(tag str)` | Disable the in-band rule identified by the tag (multiple rules can have the same tag) |
| `RemoveInBandRuleByID` | `func(id int)` | Disable the in-band rule identified by the ID |
| `RemoveOutBandRuleByName` | `func(tag str)` | Disable the named out-of-band rule |
| `RemoveOutBandRuleByTag` | `func(tag str)` | Disable the out-of-band rule identified by the tag (multiple rules can have the same tag) |
| `RemoveOutBandRuleByID` | `func(id int)` | Disable the out-of-band rule identified by the ID |



### `pre_eval`

This hook is intended to be used to disable rules only for this particular request (eg, to disable a rule for a specific IP).

#### Available helpers

| Helper Name | Type | Description |
| --- | --- | --- |
| `RemoveInBandRuleByName` | `func(tag str)` | Disable the named in-band rule |
| `RemoveInBandRuleByTag` | `func(tag str)` | Disable the in-band rule identified by the tag (multiple rules can have the same tag) |
| `RemoveInBandRuleByID` | `func(id int)` | Disable the in-band rule identified by the ID |
| `RemoveOutBandRuleByName` | `func(tag str)` | Disable the named out-of-band rule |
| `RemoveOutBandRuleByTag` | `func(tag str)` | Disable the out-of-band rule identified by the tag (multiple rules can have the same tag) |
| `RemoveOutBandRuleByID` | `func(id int)` | Disable the out-of-band rule identified by the ID |
| `IsInBand` | `bool` | `true` if the request is in the in-band processing phase |
| `IsOutBand` | `bool` | `true` if the request is in the out-of-band processing phase |




### `on_match`

This hooks is intented to used to change the behavior of the engine after a match (eg, to change the remediation that will be used dynamically).

#### Available helpers

| Helper Name | Type | Description |
| --- | --- | --- |
| `SetRemediation` | `func(remediation string)` | Change the remediation that will be returned to the remediation component |
| `SetHTTPCode` | `func(code int)` | Change the HTTP code that will be returned to the remediation component |
| `CancelAlert` | `func()` | Prevent the Application Security Engine to create a crowdsec alert |
| `SendAlert` | `func()` | Force the Application Security Engine to create a crowdsec alert |
| `CancelEvent` | `func()` | Prevent the Application Security Engine to create a crowdsec event |
| `SendEvent` | `func()` | Force the Application Security Engine to create a crowdsec event |
| `IsInBand` | `bool` | `true` if the request is in the in-band processing phase |
| `IsOutBand` | `bool` | `true` if the request is in the out-of-band processing phase |