---
id: contributing_hub
title: Hub
sidebar_position: 3
---

Parsers, Scenarios, Collections allow Crowdsec to detect and block malevolent behavior, making the community stronger.

Contributing to it improves Crowdsec, by supporting new services, or by improving its detection capabilities on existing software (a good example would be [contributing to detect trending vulnerabilities in web applications](https://hub.crowdsec.net/author/crowdsecurity/collections/http-cve)).


Sharing your parsers, scenarios and collections on the hub allows other users to use it to protect themselves.

# Contributing

Anyone can open an issue about parsers/scenarios, or contribute a change with a pull request (PR) to the crowdsecuity/hub GitHub repository. You need to be comfortable with git and GitHub to work effectively.

To get involved :
 - Have a look at opened [issues](https://github.com/crowdsecurity/hub/issues) and [pull requests](https://github.com/crowdsecurity/hub/pulls) 
 - Clone the hub repository
 - Create/Modify parsers/scenarios/collections as seen [here]
 - Create/Modify tests to ensure proper coverage
 - Open a pull request

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



## Publishing Parsers, Scenarios and Collections

If you want to contribute your parser or scenario to the community and have them appear on the [Crowdsec Hub](https://hub.crowdsec.net/), you should [open a merge request](https://github.com/crowdsecurity/hub/pulls) on the hub.

All contributions are peer reviewed, so please bear with us!
