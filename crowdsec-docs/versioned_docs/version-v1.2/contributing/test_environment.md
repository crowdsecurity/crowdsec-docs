---
id: contributing_test_env
title: Creating a test environment 
sidebar_position: 10
---


It is possible to deploy a minimalist test environment, which is useful to:
 - create new parsers or scenarios
 - test new features
 - showcase a bug or a corner-case


This can be done directly with the tarball of the release:


```bash
https://github.com/crowdsecurity/crowdsec/releases/download/v1.1.1/crowdsec-release.tgz
tar xvzf crowdsec-release.tgz
cd crowdsec-v1.1.1
./test_env.sh
```

The test environment is then available in the `tests` directory and should provide a functional CrowdSec environment:

```bash
cd tests
./crowdsec -c dev.yaml
```

`cscli` should be functional as well :

```bash
cd tests
./cscli -c dev.yaml hub list
```

In this test environement, configurations are under the `config/` dir.

