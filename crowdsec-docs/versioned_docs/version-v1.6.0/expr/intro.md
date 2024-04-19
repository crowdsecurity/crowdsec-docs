---
id: intro
title: Introduction
sidebar_position: 1
---

> [antonmedv/expr](https://github.com/antonmedv/expr) - Expression evaluation engine for Go: fast, non-Turing complete, dynamic typing, static typing

Several places of CrowdSec's configuration use [expr](https://github.com/antonmedv/expr), notably :

 - [Filters](/parsers/format.md#filter) that are used to determine events eligibility in parsers, scenarios and profiles
 - [Statics](/parsers/format.md#statics) use expr in the `expression` directive, to compute complex values
 - [Whitelists](/whitelist/introduction.md) rely on `expression` directive to allow more complex whitelists filters
 - [Profiles](/profiles/intro.md) rely on `filters` directives to find matching profiles 

To learn more about [expr](https://github.com/antonmedv/expr), [check the github page of the project](https://github.com/antonmedv/expr/blob/master/docs/Language-Definition.md).


When CrowdSec relies on `expr`, a context is provided to let the expression access relevant objects :

 - `evt.` is the representation of the current event and is the most relevant object
 - in [profiles](/profiles/intro.md), alert is accessible via the `Alert` object

If the `debug` is enabled (in the scenario or parser where expr is used), additional debug will be displayed regarding evaluated expressions.
