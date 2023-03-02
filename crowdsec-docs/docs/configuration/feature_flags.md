---
title: Feature Flags
id: feature_flags
---

# Feature Flags

In order to make it easier for users to test and experiment with new features, CrowdSec introduces the concept of "feature flags".
New commands and behaviors can be improved by us, according to the user's feedback, before making them available in the default configuration.

## Enabling a Feature Flag

A feature flag can be enabled in two ways:

 - By adding the feature name as a list item in the file `/etc/crowdsec/feature.yaml`. For example, to enable the `my_new_feature` feature flag, you would add the following line to the file:

```yaml title="/etc/crowdsec/feature.yaml"
  - my_new_feature
```

 - By setting the `CROWDSEC_FEATURE_<feature-name>` environment variable to true. For example, to enable the `my_new_feature` feature flag, you would set the environment variable `CROWDSEC_FEATURE_MY_NEW_FEATURE=true`. This is recommended when running CrowdSec in containers. If you really want to do this outside of containers (we do for tests), keep in mind that the variable must be defined for both the `crowdsec` process and `cscsli`.


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
