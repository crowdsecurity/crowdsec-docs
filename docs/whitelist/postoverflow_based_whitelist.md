---
id: create_postoverflow
title: Postoverflow
---

## Whitelist in PostOverflows

Whitelists in PostOverflows are applied _after_ the bucket overflow happens. Please see [introduction](/whitelist/introduction.md) for your OS specific paths.

:::warning

In PostOverflows, the `evt.Parsed` object will be empty at this stage.

It means that you must work with the [`evt.Overflow`](/expr/event.md#overflow-relevant-fields) object for your expression.

:::

The main advantage of postoveflow whitelists is they are only triggered once the bucket overflows meaning potentially expensive expressions are evaluated less often.

A good example is the [crowdsecurity/whitelist-good-actors](https://hub.crowdsec.net/author/crowdsecurity/collections/whitelist-good-actors) collection.

First of all, install the [crowdsecurity/rdns postoverflow](https://hub.crowdsec.net/author/crowdsecurity/configurations/rdns) : it will be in charge of enriching overflows with reverse dns information of the offending IP address.

Let's create `mywhitelist.yaml` again but remember this is a postoverflow whitelist so the paths will be different to `Parsing whitelists` please see [introduction](/whitelist/introduction.md) for your OS specific path.

```yaml
name: me/my_cool_whitelist
description: lets whitelist our own reverse dns
whitelist:
    reason: dont ban my ISP
    expression:
        #this is the reverse of my ip, you can get it by performing a "host" command on your public IP for example
        - evt.Enriched.reverse_dns endsWith '.asnieres.rev.numericable.fr.'
```

```bash title="Reload CrowdSec"
sudo systemctl reload crowdsec
```

```bash
nikto -host myfqdn.com
```

Tail the crowdsec log

```bash
tail -f /var/log/crowdsec.log
```

You should be able to see the following output:

```
time="07-07-2020 17:11:09" level=info msg="Ban for 80.x.x.x whitelisted, reason [dont ban my ISP]" id=cold-sunset name=me/my_cool_whitelist stage=s01
time="07-07-2020 17:11:09" level=info msg="node warning : no remediation" bucket_id=blue-cloud event_time="2020-07-07 17:11:09.175068053 +0200 CEST m=+2308.040825320" scenario=crowdsecurity/http-probing source_ip=80.x.x.x
time="07-07-2020 17:11:09" level=info msg="Processing Overflow with no decisions 80.x.x.x performed 'crowdsecurity/http-probing' (11 events over 313.983994ms) at 2020-07-07 17:11:09.175068053 +0200 CEST m=+2308.040825320" bucket_id=blue-cloud event_time="2020-07-07 17:11:09.175068053 +0200 CEST m=+2308.040825320" scenario=crowdsecurity/http-probing source_ip=80.x.x.x
```

This time, we can see that logs are being produced when the event is discarded.

## Allow event for a specific scenario

It is possible to allow an event for a specific scenario.

For example, if you want to allow all the HTTP requests starting with `/mywebapp` only for the scenario `crowdsecurity/http-crawl-non_statics`, you can create the following postoverflow:

```yaml
name: mywebapp_whitelist
description: Whitelist MyWebApp application for crawl non static
whitelist:
    reason: MyWebApp can trigger FP
    expression:
        - evt.Overflow.Alert.Scenario == "crowdsecurity/http-crawl-non_statics" and all(evt.Overflow.Alert.Events, {.GetMeta("http_path") startsWith "/mywebapp"})
```

The allowlist expression checks that the triggered scenario is `crowdsecurity/http-crawl-non_statics`.

It then checks that all the `http_path` of events that lead to trigger the scenario start with `/mywebapp`.

:warning: Since the `capacity` of the `crowdsecurity/http-crawl-non_statics` scenario is set to 40 and its `cache_size` to 5, the allowlist can only do this check on the last 5 events.

If it matches both conditions, the overflow is allowed.
