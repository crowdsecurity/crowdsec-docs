---
id: contributing_hub
title: Hub
sidebar_position: 3
---

Parsers, Scenarios, Collections allow Crowdsec to detect and block malevolent behavior.

Supporting new services or improving its detection capabilities on existing software is a great way to contribute.

Sharing your parsers, scenarios and collections on the hub allows other users to use it to protect themselves.

# Contributing

Anyone can open an issue about parsers/scenarios, or contribute a change with a pull request (PR) to the crowdsecuity/hub GitHub repository. You need to be comfortable with git and GitHub to work effectively.

To get involved :
 - Have a look at opened [issues](https://github.com/crowdsecurity/hub/issues) and [pull requests](https://github.com/crowdsecurity/hub/pulls) 
 - Clone the hub repository
 - Create/Modify parsers/scenarios/collections
 - Create/Modify tests to ensure proper coverage
 - Open a pull request


# Guidelines

## Technical Documentation

The following explains how to create and test :
 - [parsers](/docs/parsers/create/)
 - [scenarios](/docs/scenarios/create/)

## Collections

It often makes sense for a new parser or scenario to be added to an existing [collection](/docs/collections/format), or create a new one.

If your parsers and/or scenarios cover a new or specific service, having a dedicated collection for this service makes sense.
In other cases, having a parser for `SpecificWebServer` access logs would justify a collection as it might as well include [all the default http related scenarios](https://hub.crowdsec.net/author/crowdsecurity/collections/base-http-scenarios).


# Preparing your contribution

Before asking for a review of your PR, please ensure you have the following :

 - tests : Tests creation are covered in the [parsers creation](/docs/parsers/create/) and [scenarios creation](/docs/scenarios/create/). Ensure that each of your parser / scenario is properly tested.
 - documentation : Please provide a `.md` file with the same name as each of your parser, scenario or collection. The markdown is rendered in the [hub](https://hub.crowdsec.net).

# Open your PR

Everything is all set, you can now open a PR, that will be reviewed and merged !
