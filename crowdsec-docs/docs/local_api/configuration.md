---
id: configuration
title: Configuration
sidebar_position: 6
---


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
      cert_file: "/path/to/cert.pem"
      key_file: "/path/to/key.pem"
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


