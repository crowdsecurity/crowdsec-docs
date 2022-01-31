---
id: contributing_hub
title: Hub
sidebar_position: 2
---

# Contribute to the Hub

## Parsers and Scenarios Creation

Refer to the dedicated documentation to create [parsers](/docs/parsers/create/) and [scenarios](/docs/scenarios/create/).
Before submitting your contribution, a few things should be checked :

1. Collection(s)

It often makes sense for a new parser or scenario to be added to an existing [collection](/docs/next/collections/format), or create a new one.

If your parsers and/or scenarios cover a new or specific service, having a dedicated collection for this service makes sense.
In other cases, having a parser for `SpecificWebServer` access logs would justify a collection as it might as well include [all the default http related scenarios](https://hub.crowdsec.net/author/crowdsecurity/collections/base-http-scenarios).


2. Tests

Tests creation are covered in the [parsers creation](/docs/parsers/create/) and [scenarios creation](/docs/scenarios/create/).

Please include tests for your parsers and scenarios. If you have any trouble with their creation, feel free to ask for help :)

3. Documentation

The [hub](https://hub.crowdsec.net) displays the documentation of given parsers and scenarios. It will check for a `.md` file with the same name as a parser, scenario or collection. Providing those ensures optimal user's experience !

### Why ?

Sharing your parsers, scenarios and collections on the hub allows other users to find it and use it. While increasing your code's visibility, it ensures a benevolent look from the community and the team over it.

## Publishing Parsers, Scenarios and Collections

If you want to contribute your parser or scenario to the community and have them appear on the [Crowdsec Hub](https://hub.crowdsec.net/), you should [open a merge request](https://github.com/crowdsecurity/hub/pulls) on the hub.

All contributions are peer reviewed, so please bear with us!
