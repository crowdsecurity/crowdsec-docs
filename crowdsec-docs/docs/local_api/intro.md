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

## Authentication

There are three kinds of authentication to the Local API :

1. API Keys: they are used to authenticate Remediation Components (bouncers) and can only read decisions
2. Login/Password: they are used to authenticate Log Processors (machines) and can read, create and delete decisions
3. TLS client certificates:
    - they are used to authenticate Remediation Components (bouncers) and Log Processors (machines)
    - based on the OU field of the certificate, the Local API will determine what permissions the client has as per the restrictions above (log processor or remediation components)
    - this allows the Local API to authenticate clients without generating the clients before hand if you have a dynamic environment

For TLS authentication please see our [dedicated documentation](/local_api/tls_auth.md).

### Remediation Components (Bouncers)

To register a Remediation Component to your API, you need to run the following command on the server where the API is installed:

```bash
sudo cscli bouncers add testBouncer
```

and keep the generated API token to use it in your Remediation Component configuration file.

### Log Processors (machines)

To allow a log processor to communicate with the Local API, each instance will need it own set of credentials which is validated by an admin of the Local API.

There are two ways to register a CrowdSec to a Local API.

1. You can generate credentials directly on the Local API server:

```bash
sudo cscli machines add testMachine
```

:::warning
if you are running this command on the local API server, most likely it will already have it own credentials file. If you are generating credentials for a remote machine you must pass the `-f` flag to generate the credentials to another file.

```bash
sudo cscli machines add testMachine -f /path/to/credentials.yaml
```
or
```bash
sudo cscli machines add testMachine -f- > /path/to/credentials.yaml
```
:::

Upon installation of CrowdSec it will generate it own set of credentials to operate the log processor and local API server.

If you are installing these credentials on a remote machine, you must replace the `local_api_credentials.yaml` file within the configuration directory, you can find the location of this directory [here](/u/troubleshooting/security_engine#where-is-configuration-stored) based on your operating system.

2. You can use `cscli` to send a registration request to the Local API server:

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

## Configuration

### Client

By default, `crowdsec` and `cscli` use `127.0.0.1:8080` as the default Local API. However you might want to use a remote API and configure a different endpoint for your api client.

#### Register to a Remote API server

* On the machine you want to connect to a Local API server, run the following command:

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

* Restart the CrowdSec service on the machine you registered once validated:

```bash
sudo systemctl restart crowdsec
```

#### Disable the registered machine Local API

On the machine you ran `cscli lapi register`, it optimal to disable the Local API component to save on resources since it is now forwarding all alerts/decisions to the Local API server.

Within the `config.yaml` file, set `enable` under `api.server` to `false`:

```yaml
api:
  server:
    enable: false
```

See where the `config.yaml` file is located on your operating system [here](/u/troubleshooting/security_engine#where-is-configuration-stored)

### Server

#### Configure listen URL

If you would like your Local API to be used by a remote CrowdSec installation, you will need to modify the URL it listens on as by default it will listen on the loopback interface.

Modify the [`listen_uri`](/configuration/crowdsec_configuration.md#listen_uri) option in the `config.yaml`.

#### Enable SSL

If your Local API is exposed to the internet, it is recommended to enable SSL or at least use a reverse proxy with SSL termination to secure the communication between the Log Processors / Remediation Components and the Local API.

If your Log Processors and Remediation Components are apart of the same LAN or VPN, then this is not necessary step.

##### Local API SSL

You can configure the Local API to use SSL by setting the `tls` option under `api.server` in the `config.yaml` file.

```yaml
api:
  server:
    tls:
      cert_path: "/path/to/cert.pem"
      key_path: "/path/to/key.pem"
```

:::info
If you are using a self signed certificate on connecting Log Processors and Remediation Components you must enable `insecure_skip_verify` options.
:::

- Log Processors (machines)

```yaml
api:
  client:
      insecure_skip_verify: true
```

- Remediation Components (bouncers)

This can differ based on the configuration please refer to the documentation of the component you are using.

If you would like to read the full configuration options for TLS on the Local API please [see here](/configuration/crowdsec_configuration.md#tls).

You can also refer [here](/local_api/tls_auth.md) for the documentation about TLS authentication.

##### Reverse Proxy

We cannot cover all the reverse proxies available, please refer to the documentation of the reverse proxy you are using. However, the reverse proxy must send the connecting IP address as the `X-Forwarded-For` header to the Local API.

However, when the Local API is behind a reverse proxy you will need to configure the `trusted_proxies` and `use_forwarded_for_headers` options under `api.server` within the `config.yaml` file to be able to get the correct IP address within the database.

```yaml
api:
  server:
    use_forwarded_for_headers: true
    trusted_proxies:
      - "127.0.0.1" ## Change this to the proxy IP this is presuming the proxy is on the same machine
```

See where the `config.yaml` file is located on your operating system [here](/u/troubleshooting/security_engine#where-is-configuration-stored)

See the [Local API public documentation](https://crowdsecurity.github.io/api_doc/lapi/).


