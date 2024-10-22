---
id: intro
title: Introduction
sidebar_position: 1
---

# Local API

The Local API (LAPI) is a core component of CrowdSec to :

 - Allow CrowdSec machines to push alerts & decisions to a database
 - Allow bouncers to consume said alerts & decisions from database
 - Allow `cscli` to view add or delete decisions

You can find the swagger documentation [here](https://crowdsecurity.github.io/api_doc/lapi/).

This allows you to create [multi-machines architectures](https://crowdsec.net/multi-server-setup/) around CrowdSec or leverage [orchestration technologies](https://crowdsec.net/secure-docker-compose-stacks-with-crowdsec/).

## Authentication

There are three kinds of authentication to the Local API :

 - Bouncers: they authenticate with a simple API key and can only read decisions

 - Machines: they authenticate with a login and password and can not only read decisions, but create new ones too

 - TLS client certificates: it allows you to connect new bouncers or machines to the local API without registring them first 


### Bouncers

To register a bouncer to your API, you need to run the following command on the server where the API is installed:

```bash
sudo cscli bouncers add testBouncer
```

and keep the generated API token to use it in your bouncers configuration file.

See [here](/local_api/tls_auth.md) for the documentation about TLS authentication.

### Machines

To allow a machine to communicate with the Local API, the machine needs to be validated by an administrator of the Local API.

There are two ways to register a CrowdSec to a Local API.

* You can create a machine directly on the API server that will be automatically validated by running the following command on the server where the API is installed:

```bash
sudo cscli machines add testMachine
```

If your CrowdSec runs on the same server as the Local API, then your credentials file will be generated automatically, otherwise you will have to copy/paste them in your remote CrowdSec credentials file (`/etc/crowdsec/local_api_credentials.yaml`)

* You can use `cscli` to register to the API server:

```bash
sudo cscli lapi register -u <api_url>
```

And validate it with `cscli` on the server where the API is installed:

```bash
sudo cscli machines validate <machineName>
```

:::info
You can use `cscli machines list` to list all the machines registered to the API and view the ones that are not validated yet.
:::

See [here](/local_api/tls_auth.md) for the documentation about TLS authentication.

## Configuration

### Client

By default, `crowdsec` and `cscli` use `127.0.0.1:8080` as the default Local API. However you might want to use a remote API and configure a different endpoint for your api client.

#### Register to a Remote API server

* On the remote CrowdSec server, run:

```bash
sudo cscli lapi register -u http://<remote_api>:<port>
```

* On the Local API server, validate the machine by running the command:


```bash
sudo cscli machines list # to get the name of the new registered machine
```

```bash
sudo cscli machines validate <machineName>
```


### Server

#### Configure listen URL

If you would like your Local API to be used by a remote CrowdSec installation, you will need to modify the URL it listens on.
Modify the [`listen_uri` option](/configuration/crowdsec_configuration.md#listen_uri) in the main configuration file.
Then see [how to configure your crowdsec to use a remote API](/u/user_guides/machines_mgmt).


#### Enable SSL

The most common use case of the Local API is to listen on 127.0.0.1. In that case there's no need for
configuring any ssl layer. In some cases, the local API will listen for other CrowdSec installations that
will report their triggered scenarios. In that case the endpoint may be configured with ssl.
You can see how to configure SSL on your Local API [here](/configuration/crowdsec_configuration.md#tls).

You can also refer [here](/local_api/tls_auth.md) for the documentation about TLS authentication.


See the [Local API public documentation](https://crowdsecurity.github.io/api_doc/lapi/).


