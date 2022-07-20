---
id: intro
title: Introduction
sidebar_position: 1
---

## Objective

Welcome to the documentation section dedicated to Crowdsec's CTI API.
The data you access via this API is fed chiefly by Crowdsec instances worldwide.

## Datasets

Crowdsec's CTI API presents two primary datasets :
 - **fire** dataset reflects the content of the community blocklist with more context.
 - **smoke** dataset reflects most of the IPs reported by Crowdsec users

> note: The ratio of fire to smoke is around 1% at the time of writting

## CTI Information

When querying the CTI API about a given IP, you will get to know more about:
 - What it does: observed behaviors, targetted protocols, exploited vulnerabilities, etc.
 - To what categories does it belong: proxy/VPN, CDN exit node, Legit security scanner, etc.
 - What it targets: Countries, services, etc.
 - Existing cross-references: Existing lists, etc.
 - How virulent it is
 - For how long it has been reported by users
 - The confidence level of the information
 - And so on

## How to access it

See the [getting started](/docs/next/cti_api/getting_started) section to see how to get your API key and start exploring data.
The [console](https://app.crowdsec.net) can also show a lighter version of the CTI API data.


