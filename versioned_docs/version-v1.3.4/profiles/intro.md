---
id: intro
title: Introduction
sidebar_position: 1
---

The profiles configuration allows user to configure which kind of remediation should be applied when a scenario is triggered. The profile can be used to :
 - increase or decrease decisions `duration` (default: `4h`)
 - decide the type of remediation that should be applied (default: `ban`)
 - decide of the scope of the remediation (default: `ip`)
 - enable/disable debug for a specific profile


The profiles configuration is located in `/etc/crowdsec/profiles.yaml`.