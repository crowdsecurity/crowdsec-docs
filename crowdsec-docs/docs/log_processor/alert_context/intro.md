---
id: intro
title: Alert Context
---

## Introduction

As the [Log Processor](log_processor/intro.mdx) processes logs, it will detect patterns of interest known as [Scenarios](log_processor/scenarios/introduction.mdx). When a scenario is detected, an alert is generated and sent to the [Local API](local_api/intro.md) (LAPI) for evaluation.

When the alert is generated you can define additional Alert Context that can be sent along with the alert to give you context about the alert. This can be useful when you host multiple applications on the same server and you want to know which application generated the alert.

### Format

The format of Alert Context are key value pairs that are sent along with the alert. When you install some [Collections](log_processor/collections/intro.md) you will see that they come with Alert Context pre-configured.

For example if you install the `crowdsecurity/nginx` collection you will see that the `http_base` context is added:

```yaml
#this context file is intended to provide minimal and useful information about HTTP scenarios.
context:
  target_uri:
  - evt.Meta.http_path
  user_agent:
  - evt.Meta.http_user_agent
  method:
  - evt.Meta.http_verb
  status:
    - evt.Meta.http_status
```

Contexts are stored within the `contexts` directory within the root of the `config` directory, you can see the directory based on your OS [here](/u/troubleshooting/security_engine#where-is-configuration-stored).

:::info
As an example the default directory for linux is `/etc/crowdsec/` so the `contexts` directory would be `/etc/crowdsec/contexts/`
:::

Here a quick breakdown of the context file:

- `context` : This is the root key of the context file.
- `target_uri` : This is the key that will be used as the "name" of the context.
- `evt.Meta.http_path` : This is the expression that will be evaluated to get the value of the context. In this case it will be the `http_path` field from the event.

The next key value pair would be `user_agent` and so on.

## Next Steps?

We have written a full guide on Alert Context that you can find [here](/u/user_guides/alert_context). This guide will show you how to create your own Alert Context and how to use it within your scenarios.
