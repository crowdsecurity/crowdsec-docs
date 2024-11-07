---
id: intro
title: Introduction
sidebar_position: 1
---

# Local API

The Local API (LAPI) is one of the core component of the Security Engine to :

 - Allow Log Processors to push alerts & decisions to a database
 - Allow Remediation Components to consume said alerts & decisions from database
 - Allow `cscli` to manage the database (list, delete, etc)

You can find the swagger documentation [here](https://crowdsecurity.github.io/api_doc/lapi/).

This allows you to create [multi-machines architectures](https://crowdsec.net/multi-server-setup/) around CrowdSec or leverage [orchestration technologies](https://crowdsec.net/secure-docker-compose-stacks-with-crowdsec/).
