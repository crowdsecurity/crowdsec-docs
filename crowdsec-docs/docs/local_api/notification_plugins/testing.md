---
id: testing
title: Testing notification plugins
---

This guide walks through practical ways to validate a notification plugin, from config checks to end-to-end delivery.

```info
Template updates are picked up by the `cscli notifications` commands while testing. Restart CrowdSec only after you are satisfied with the changes.
```

## When to use test vs reinject

- `cscli notifications test` sends a generic alert directly to a plugin. The plugin does not need to be active in any profile for this to work.
- `cscli notifications reinject` replays a real alert through the profiles pipeline, so filters and profile settings apply. It can also include additional meta fields present in real alerts, which are not part of the generic test alert.

## Pre-flight checklist

1. Confirm the plugin binary and config file exist in the directories defined by `config_paths.plugin_dir` and `config_paths.notification_dir`. By default, standard packages already ship these; this check is mainly for custom installations.
2. If you plan to test via profiles (using `reinject`), make sure the plugin config `name` matches the name used in your profile `notifications` list.
3. If the plugin uses environment variables, export them before testing (see [Introduction](/local_api/notification_plugins/intro.md)).

Example profile snippet:

```yaml
notifications:
  - slackreport
```

## Check plugin status and config

List plugins and ensure yours is enabled:

```bash
cscli notifications list
```

Inspect a specific plugin to confirm the resolved configuration:

```bash
cscli notifications inspect slackreport
```

## Send a direct test notification

Send a generic alert directly to the plugin:

```bash
cscli notifications test slackreport
```

Override fields in the generic alert to match your formatting or routing logic:

```bash
cscli notifications test slackreport -a '{"scenario":"notification/test","remediation":true}'
```

If your plugin relies on secrets from environment variables, pass them inline or export them in your shell:

```bash
SMTP_PASSWORD=your_password cscli notifications test email_default
```

## Reinject a real alert through profiles

Find an alert ID to replay using the default table output:

```bash
cscli alerts list
```

Example output:

```
cscli alerts list
╭──────┬───────────────────┬────────────────────────────────────────────┬─────────┬──────────────────────┬───────────┬──────────────────────╮
│  ID  │       value       │                   reason                   │ country │          as          │ decisions │      created_at      │
├──────┼───────────────────┼────────────────────────────────────────────┼─────────┼──────────────────────┼───────────┼──────────────────────┤
│ 2843 │ Ip:10.0.12.10     │ crowdsecurity/http-probing                 │ GB      │ 64500 ExampleNet     │ ban:1     │ 2026-01-13T09:13:25Z │
│ 2837 │ Ip:10.0.21.71     │ crowdsecurity/http-backdoors-attempts      │ GB      │ 64501 ExampleCloud   │ ban:1     │ 2026-01-13T07:50:53Z │
│ 2836 │ Ip:10.0.33.50     │ crowdsecurity/http-crawl-non_statics       │ GB      │ 64502 ExampleHosting │ ban:1     │ 2026-01-13T06:12:26Z │
╰──────┴───────────────────┴────────────────────────────────────────────┴─────────┴──────────────────────┴───────────┴──────────────────────╯
```

Grab the ID from the `ID` column and use it with `cscli notifications reinject`.

Reinject the alert through the profiles pipeline:

```bash
cscli notifications reinject <alert_id>
```

Override fields if needed to match your profile filter:

```bash
cscli notifications reinject <alert_id> -a '{"remediation": true}'
```

If nothing is sent, confirm the profile filter matches the alert fields you are setting (for example, `Alert.Remediation == true`).

## Expected outcomes

What "success" looks like depends on the plugin:

- **HTTP/Teams/Telegram/Slack**: a delivered message or a 2xx response from the endpoint.
- **File**: a new line appended to the configured file.
- **Email**: a delivered message or an entry in the SMTP logs.
- **Splunk/Elastic/Sentinel**: a new event ingested in the target index or workspace.

If you get a response but no visible output, double-check the plugin-specific filters and templates.

## Make reinject match your profiles

If your profile filters depend on fields like `scenario`, `remediation`, or the source IP, override them in the reinjected alert:

```bash
cscli notifications reinject <alert_id> -a '{"scenario":"notification/test","remediation":true,"source":{"value":"10.0.12.10"}}'
```

This is useful when your profile uses conditions such as `Alert.Remediation == true` or specific scenarios.

## Troubleshooting signals

- Use `--debug` with `cscli` to surface plugin errors or config parsing issues.
- Check the CrowdSec service logs for plugin startup or gRPC errors.
- For file or HTTP-based plugins, verify that the target file or endpoint is being written to.
