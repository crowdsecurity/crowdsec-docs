---
id: intro
title: Introduction
sidebar_position: 1
---

# Local API

The Local API (LAPI) is one of the core components of the Security Engine to :

 - Allow Log Processors to push alerts & decisions to a database
 - Allow Remediation Components to consume said alerts & decisions from database
 - Allow `cscli` to manage the database (list, delete, etc)

You can find the swagger documentation [here](https://crowdsecurity.github.io/api_doc/lapi/).

This allows you to create [multi-machines architectures](https://crowdsec.net/multi-server-setup/) around CrowdSec or leverage [orchestration technologies](https://crowdsec.net/secure-docker-compose-stacks-with-crowdsec/).

All subcategories below are related to the Local API and its functionalities. If you are utilizing a multi server architecture, you will only need to configure the functionality that you want to use on the LAPI server.

For example if you wish to receive notifications then you will only need to configure the Notification Plugins on the LAPI server and not each [log processor](log_processor/intro.mdx).

## Authentication

LAPI offers multiple different authentication methods, which has their own restrictions based on the method used.

You can find more information about the authentication methods [here](local_api/authentication.md).

## Profiles

Profiles are a set of rules processed by the LAPI to determine if an alert should trigger a decision, notification or just simply log. They are processed in order of definition and can be used to make complex decisions based on the alert.

You can find more information about profiles [here](local_api/profiles/intro.md).

## Notification Plugins

Notification plugins are used to send alerts to external services.

You can find more information about configuring the plugins [here](local_api/notification_plugins/intro.md).

## Databases

Databases documentation showcases which database the LAPI supports and how to configure the database to allow the LAPI to utilize it.

You can find more information about the databases [here](local_api/database.md).
