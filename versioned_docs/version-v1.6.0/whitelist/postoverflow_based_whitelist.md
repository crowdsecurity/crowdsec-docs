---
id: create_postoverflow
title: Postoverflow
---

## Whitelist in PostOverflows 

Whitelists in PostOverflows are applied *after* the bucket overflow happens. Please see [introduction](/whitelist/introduction.md) for your OS specific paths.

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
