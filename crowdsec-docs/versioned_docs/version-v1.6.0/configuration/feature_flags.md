---
title: Feature Flags
id: feature_flags
---

# Feature Flags

In order to make it easier for users to test and experiment with new features, CrowdSec uses the concept of "feature flags".
New commands and behaviors can be improved by us, according to the user's feedback, before making them available in the default configuration.

## List of available Feature Flags

Some of the feature flags might not be documented because they are for features that are still under development and not ready for general use.

- `re2_grok_support`: Enable RE2 support for GROK patterns. [Brings a very significant performance improvement in parsing at the cost of extra memory](https://www.crowdsec.net/blog/increasing-performance-crowdsec-1-5).
- `re2_regexp_in_file_support`: Enable RE2 support for `RegexpInFile` expr helper. Similar to `re2_grok_support` but more niche as regexps used by `RegexpInFile` are usually less complex than grok patterns.
- `chunked_decisions_stream`: Enable chunked decisions stream. Useful when you have a lot of remediation pulling from the same local API, as it reduces the memory consumption related to decision fetch.

## Enabling a Feature Flag

A feature flag can be enabled in two ways:

 - By adding the feature name as a list item in the file `/etc/crowdsec/feature.yaml`. For example, to enable the `my_new_feature` feature flag, you would add the following line to the file:

```yaml title="/etc/crowdsec/feature.yaml"
  - my_new_feature
```

 - By setting the `CROWDSEC_FEATURE_<feature-name>` environment variable to true. For example, to enable the `my_new_feature` feature flag, you would set the environment variable `CROWDSEC_FEATURE_MY_NEW_FEATURE=true`. This is recommended when running CrowdSec in containers. If you really want to do this outside of containers (as we do for tests), keep in mind that the variable must be defined for both the `crowdsec` process and `cscli`.


You can see if CrowdSec is running with feature flags by calling `grep 'feature flags' /var/log/crowdsec.log | tail -1`


## Retrieving Supported Feature Flags

To retrieve a list of all the supported and enabled feature flags for a given version of CrowdSec, you can use the following command:

```console
$ cscli config feature-flags
 --- Enabled features ---

✓ cscli_setup: Enable cscli setup command (service detection)
✓ papi_client: Enable Polling API client

 --- Disabled features ---

✗ chunked_decisions_stream: Enable chunked decisions stream
✗ disable_http_retry_backoff: Disable http retry backoff

To enable a feature you can: 
  - set the environment variable CROWDSEC_FEATURE_<uppercase_feature_name> to true
  - add the line '- <feature_name>' to the file /etc/crowdsec/feature.yaml
```

## Deprecation, retirement

When a feature is made generally available, or if it's discarded completely, the corresponding feature flag can be
`deprecated` or `retired`. You can still use the feature flag (with a warning) if it has been deprecated. Using a feature flag that
has been retired will have no effect and log an error instead.

In the following example, we deprecated `cscli_setup` and retired `papi`, then we attempt to enable both. You can see the warning
and the error.

```console
$ CROWDSEC_FEATURE_PAPI_CLIENT=true CROWDSEC_FEATURE_CSCLI_SETUP=true ./tests/local/bin/cscli version
ERRO[02-03-2023 15:55:45] Ignored envvar 'CROWDSEC_FEATURE_PAPI_CLIENT': the flag is retired.  
WARN[02-03-2023 15:55:45] Envvar 'CROWDSEC_FEATURE_CSCLI_SETUP': the flag is deprecated.  
2023/03/02 15:55:45 version: v1.5.0-rc1-13-ge729bf5d-e729bf5d6103894da28818ab4626bab918fbd09d
2023/03/02 15:55:45 Codename: alphaga
2023/03/02 15:55:45 BuildDate: 2023-03-02_15:48:28
2023/03/02 15:55:45 GoVersion: 1.20.1
[...]
```

Retired flags don't appear in `cscli config feature-flags` unless you use the `--retired` option:

```console
$ CROWDSEC_FEATURE_PAPI_CLIENT=true CROWDSEC_FEATURE_CSCLI_SETUP=true ./tests/local/bin/cscli config feature-flags --retired
ERRO[02-03-2023 15:58:38] Ignored envvar 'CROWDSEC_FEATURE_PAPI_CLIENT': the flag is retired.
WARN[02-03-2023 15:58:38] Envvar 'CROWDSEC_FEATURE_CSCLI_SETUP': the flag is deprecated.
 --- Enabled features ---

✓ cscli_setup: Enable cscli setup command (service detection)
  DEPRECATED

 --- Disabled features ---

✗ chunked_decisions_stream: Enable chunked decisions stream
✗ disable_http_retry_backoff: Disable http retry backoff

To enable a feature you can:
  - set the environment variable CROWDSEC_FEATURE_<uppercase_feature_name> to true
  - add the line '- <feature_name>' to the file /home/marco/src/crowdsec/tests/local/etc/crowdsec/feature.yaml

 --- Retired features ---

✗ papi_client: Enable Polling API client
  RETIRED
```
