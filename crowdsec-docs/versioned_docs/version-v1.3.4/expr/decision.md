---
id: decision
title: Decision
sidebar_position: 2
---

A `Decision` is the runtime representation of a bucket overflow consequence : an action being taken against an IP, a Range, a User etc.

The representation of the object can be found here : 

[Decision object documentation](https://pkg.go.dev/github.com/crowdsecurity/crowdsec/pkg/models#Decision)

Those objects are not meant to be manipulated directly by parsers and such, but rather be consumed by the bouncers via the Local API.

