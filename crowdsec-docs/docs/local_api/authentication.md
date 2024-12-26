---
id: authentication
title: Authentication
sidebar_position: 5
---



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

