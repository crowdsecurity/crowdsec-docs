---
id: contributing_crowdsec
title: CrowdSec
sidebar_position: 1
---

# Contributing to CrowdSec

- If you want to report a bug, you can use [the github bugtracker](https://github.com/crowdsecurity/crowdsec/issues)
- If you want to suggest an improvement you can use either [the github bugtracker](https://github.com/crowdsecurity/crowdsec/issues) or the [CrowdSecurity discourse](http://discourse.crowdsec.net)

## Testing

There are three types of tests on the main crowdsec repository. You can run
them anytime on your environment, and they are also run within the GitHub CI.

### Go tests

They include unit and integration tests written in the `*_test.go` files.

You will need Docker in order to use [localstack](https://github.com/localstack/localstack) to emulate AWS and also for testing the log collector for Docker.

If you have installed docker-compose and have access to Docker via `/var/run/docker.sock`, open a shell and run `make localstack`. In a second shell, run `make test`.

### Bats tests

These are documented in [tests/README.md](https://github.com/crowdsecurity/crowdsec/blob/master/tests/README.md).
They are easier to write than the Go tests, but can only test
each binary's external behavior. Run with `make bats-all`.

### Hub tests

These are testing the parsers, scenarios, etc. They are run from the bats tests
for convenience but actually defined in [the Hub
repository](https://github.com/crowdsecurity/hub/tree/master/.tests).
Run with `make bats-build bats-fixture` once, then `make bats-test-hub`.

## Git workflow / branch management

We receive contributions on the _master_ branch (or _main_, in recent repositories). To contribute, fork the repository, commit the code in a dedicated branch and ask for a Pull Request. By default it will target the master branch on the upstream repository, so in most cases you don't have to change anything. It will be reviewed by the core team and merged when ready, possibly after some changes. It is recommended to open [an Issue linked to the PR](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue) in order to discuss it and track its progression.

You may also receive feedback from the CI scripts (directory [.github/workflows](https://github.com/crowdsecurity/hub/tree/master/.github/workflows)) that run a series of linters and tests. You are encouraged to run these on your environment as well, before committing (see the "Testing" section above, and "Style guide" below).

## Release branches

When we decide to start working on a major or minor release (for example 1.5) we create a 1.5.x branch from master. New contributions are always on the master, but from time to time the master is merged to the release branch. The upcoming release branch does not receive code from anywhere than the master branch.

As work progresses on the release branch, we eventually create pre-release tags (ex. 1.5.0-rc1) and finally a release tag (1.5.0). At this point, we create the Release (source tar, zip, binary and static), and push the button on the Goldberg Machine to publish the binary packages.

This is where we create the 1.6.x branch and we put the 1.5.x in maintenance mode. A maintenance branch is divorced from master, and can receive code from branches other than master, to allow for backporting features and fixes. These lead eventually to _patch versions_ (1.5.1, 1.5.2) which correspond to git tags but don't have dedicated branches.

