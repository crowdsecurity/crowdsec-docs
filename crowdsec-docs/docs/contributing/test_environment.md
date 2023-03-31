---
id: contributing_test_env
title: Creating a test environment
sidebar_position: 10
---

You need a test environment for several reasons:

- Creation of new parsers or scenarios
- Testing new features or in general
- Showcase a bug or a corner-case

This can be done directly with the tarball of the release :

```bash
VER=1.4.6 # Please check https://github.com/crowdsecurity/crowdsec/releases/latest for latest version
wget https://github.com/crowdsecurity/crowdsec/releases/download/v$VER/crowdsec-release.tgz
tar xvzf crowdsec-release.tgz
cd crowdsec-v$VER
./test_env.sh
```

You receive a directory structure like this:

```bash
crowdsec-v
  |- cmd
  |   |- crowdsec
  |   |- crowdsec-cli
  |- config
  |   |- patterns
  |- plugins
  |   |- notifications
  |- tests
      |- config
      |- data
      |- logs
      |- plugins
```

The test environment is available in the folder `tests` and provides a functional CrowdSec environment :

```bash
cd tests
./crowdsec -c dev.yaml
```

`cscli` should be functional as well :

```bash
cd tests
./cscli -c dev.yaml hub list
```

In the test environment the configurations are in the folder `config/`.

## Add hub repository to test environment

> You only need to add this if you want to develop parsers and scenarios

```bash
# cd tests # if you are already in tests no need to cd
git clone https://github.com/crowdsecurity/hub
cd hub
```

Great! since we cloned the hub repository we can now run `cscli` commands within here for example:

```bash
../cscli -c ../dev.yaml hubtest run --all
```

That command will now run all tests within the hub repository. Please take note about the `../` infront of `cscli` and `dev.yaml` as these are in the folder above our current working directory.

A helpful tip to save you typing the whole command everytime is to set an shell alias example:

```bash
alias csdev="$(dirname $PWD)/cscli -c $(dirname $PWD)/dev.yaml"
```
Then you can run command as

```bash
csdev hubtest run --all
```

However, this is temporary alias set within the shell so please add to `.bashrc` or your shell equivalent.
