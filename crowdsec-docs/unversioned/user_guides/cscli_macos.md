---
id: cscli_macos
title: Run cscli on MacOS
sidebar_position: 9
---

## Running cscli on macos

While it does not make much sense to run crowdsec itself on MacOS, being able to run cscli to interact with remote crowdsec instances is very useful.

We do not currently provide prebuilt binary for MacOS, but you can:
 - Build cscli yourself
 - Use our docker image

### Building cscli

In order to build cscli from source, you will need to have at least golang 1.16 installed.

You can build from the git master branch or download a source release [here](https://github.com/crowdsecurity/crowdsec/releases).

:::warning
  If you choose to install from a release, make sure to download the `Source code` asset, not the release itself !
:::

Once you have the code, you can run `make release` to build `crowdsec` and `cscli`.

The `cscli` binary will be located in `crowdsec-$VERSION/cmd/crowdsec-cli/cscli`, you can copy it anywhere in your PATH.

### Using the docker image

:::info

We do not provide ARM64 images currently, but the x86 one works fine on ARM64 Macs.

:::

You can also use our [docker image](https://hub.docker.com/r/crowdsecurity/crowdsec).

In order to simplify the usage, you can create a shell alias:
```shell
alias cscli="docker run --rm --entrypoint /usr/local/bin/cscli  -v /path/to/crowdsec/config.yaml:/etc/crowdsec/config.yaml -v /path/to/local_api_credentials.yaml:/etc/crowdsec/local_api_credentials.yaml -e DISABLE_ONLINE_API=true -e DISABLE_AGENT=true crowdsecurity/crowdsec:latest"
```


### Configuration

In order to use `cscli` with a remote `crowdsec` agent, you need to be able to access from the machine where `cscli` will run:
  - Crowdsec Local API: for most basic operations
  - Crowdsec database (this means that you *cannot* use sqlite): for administrative operations (adding new bouncers/machines, listing them, ...)

Create a local `config.yaml` (you can use the default [configuration file](https://github.com/crowdsecurity/crowdsec/blob/master/config/config.yaml) as a base).

Update the `db_config` section to put the correct `type`, `host`, `port`, `username` and `password`.

You can refer [here](/docs/next/local_api/database) for more information about the database configuration.

Optionally, if you have built `cscli` from source, you can also update the various paths in the configuration to point them to files in your home directory for simplicity.  

On the machine where LAPI is running, run `cscli machines add NAME_OF_LOCAL_MACHINE -f local_machines_creds.yaml -a` to generate new LAPI credentials to use for your local `cscli`.

:::warning
The URL in the generated file will likely be wrong, make sure to update it to the actual IP or FQDN on which your LAPI is available.
:::

Copy this file locally either to the credentials file you bind-mount in your docker container or to the file loaded by cscli (by default, `/etc/crowdsec/local_api_credentials.yaml`)

You are now able to use `cscli` from your macOS machine.