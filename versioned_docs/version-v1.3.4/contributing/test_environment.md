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
wget https://github.com/crowdsecurity/crowdsec/releases/download/v1.3.0/crowdsec-release.tgz
tar xvzf crowdsec-release.tgz
cd crowdsec-v1.3.0
./test_env.sh
```

You receive a directory structure like this:

```bash
crowdsec-v1.3.0
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
