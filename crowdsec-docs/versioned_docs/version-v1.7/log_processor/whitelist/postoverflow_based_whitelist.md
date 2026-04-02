---
id: create_postoverflow
title: Postoverflow
---

## Whitelist in PostOverflows

Whitelists in PostOverflows are applied _after_ bucket overflow. See [introduction](/log_processor/whitelist/introduction.md) for OS-specific paths.

:::warning

In PostOverflows, the `evt.Parsed` object will be empty at this stage.

This means you must use the [`evt.Overflow`](/expr/event.md#event-object--overflow) object in expressions.

:::

The main advantage of postoverflow whitelists is that they run only when a bucket overflows, so potentially expensive expressions are evaluated less often.

A good example is the [crowdsecurity/whitelist-good-actors](https://hub.crowdsec.net/author/crowdsecurity/collections/whitelist-good-actors) collection.

First, install [crowdsecurity/rdns postoverflow](https://hub.crowdsec.net/author/crowdsecurity/configurations/rdns). It enriches overflows with reverse DNS data for the offending IP.

Then create `mywhitelist.yaml`. Because this is a postoverflow whitelist, use the postoverflow path (not the parser whitelist path). See [introduction](/log_processor/whitelist/introduction.md) for OS-specific paths.

```yaml
name: "my/po_whitelist" ## Must be unique
description: lets whitelist our own reverse dns
whitelist:
    reason: don't ban my ISP
    expression:
        # Reverse DNS of your IP (you can get it with a "host" lookup on your public IP)
        - evt.Enriched.reverse_dns endsWith '.asnieres.rev.numericable.fr.'
```

```bash title="Reload CrowdSec"
sudo systemctl reload crowdsec
```

```bash
nikto -host myfqdn.com
```

Tail the CrowdSec log:

```bash
tail -f /var/log/crowdsec.log
```

You should be able to see the following output (note: the IP shown will be your actual WAN IP, not the example):

```
time="07-07-2020 17:11:09" level=info msg="Ban for 192.168.1.1 whitelisted, reason [dont ban my ISP]" id=cold-sunset name=me/my_cool_whitelist stage=s01
time="07-07-2020 17:11:09" level=info msg="node warning : no remediation" bucket_id=blue-cloud event_time="2020-07-07 17:11:09.175068053 +0200 CEST m=+2308.040825320" scenario=crowdsecurity/http-probing source_ip=192.168.1.1
time="07-07-2020 17:11:09" level=info msg="Processing Overflow with no decisions 192.168.1.1 performed 'crowdsecurity/http-probing' (11 events over 313.983994ms) at 2020-07-07 17:11:09.175068053 +0200 CEST m=+2308.040825320" bucket_id=blue-cloud event_time="2020-07-07 17:11:09.175068053 +0200 CEST m=+2308.040825320" scenario=crowdsecurity/http-probing source_ip=192.168.1.1
```

You should now see logs showing that the event was discarded.

## Allow event for a specific scenario

You can allow events only for a specific scenario.

For example, to allow HTTP requests starting with `/mywebapp` only for `crowdsecurity/http-crawl-non_statics`, create this postoverflow whitelist:

```yaml
name: mywebapp_whitelist
description: Whitelist MyWebApp application for crawl non static
whitelist:
    reason: MyWebApp can trigger FP
    expression:
        - evt.Overflow.Alert.Scenario == "crowdsecurity/http-crawl-non_statics" and all(evt.Overflow.Alert.Events, {.GetMeta("http_path") startsWith "/mywebapp"})
```

The expression first checks that the triggered scenario is `crowdsecurity/http-crawl-non_statics`.

It then checks that all `http_path` values in the triggering events start with `/mywebapp`.

Since `crowdsecurity/http-crawl-non_statics` has `capacity: 40` and `cache_size: 5`, the whitelist can check only the last 5 events.

If it matches both conditions, the overflow is allowed.
