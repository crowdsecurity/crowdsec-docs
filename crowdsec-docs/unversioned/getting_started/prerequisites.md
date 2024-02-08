---
id: pre_requisites
title: Prerequisites
sidebar_position: 1
---

# Prerequisites

We recommend that you understands the following prerequisites before installing CrowdSec:

## Hardware

CrowdSec is a lightweight software that can run on most modern hardware.


However, the recommendation is at least:

* platform:
    * amd64
    * arm64
    * armhf
* 1 CPU core
* 100mb of free RAM
* 1GB of free disk space

:::info
We recommend 1gb of free disk space due to the amount of data that can be stored in the database.
:::

## Operating System

We support the following operating systems:

* [Linux](/getting_started/installation/linux.mdx)
* [FreeBSD](/getting_started/installation/freebsd.mdx)
* [Windows](/getting_started/installation/windows.mdx)
* [MacOS](/getting_started/installation/macos.mdx) (through Docker)

[See version matrix for detailed breakdown](/docs/next/getting_started/versions_matrix)

## Ports

CrowdSec Security Engine uses the following default ports these can be altered after installation:

* 6060/tcp: Prometheus metrics port
* 8080/tcp: API port


