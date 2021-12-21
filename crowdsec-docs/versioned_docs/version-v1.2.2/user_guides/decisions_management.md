---
id: decisions_mgmt
title: Decisions management
sidebar_position: 1
---


:::info 

Please see your local `sudo cscli help decisions` for up-to-date documentation.

:::

## List active decisions

```bash
sudo cscli decisions list
```

<details>
  <summary>Example</summary>

```bash
sudo cscli decisions list
+--------+----------+------------------+------------------------------------+--------+---------+--------------------------------+--------+-----------------+----------+
|   ID   |  SOURCE  |   SCOPE:VALUE    |               REASON               | ACTION | COUNTRY |               AS               | EVENTS |   EXPIRATION    | ALERT ID |
+--------+----------+------------------+------------------------------------+--------+---------+--------------------------------+--------+-----------------+----------+
| 276009 | crowdsec | Ip:xx.93.x.xxx   | crowdsecurity/telnet-bf            | ban    | CN      |  xxxxxxxx xxxxxxx Advertising  |      7 | 2m53.949221341s |    33459 |
|        |          |                  |                                    |        |         | Co.,Ltd.                       |        |                 |          |
| 276008 | crowdsec | Ip:xxx.53.xx.xxx | crowdsecurity/smb-bf               | ban    | BR      |  xxxxxxxxxx xxxxxxxxxxxxxxxx   |      6 | 1m48.728998974s |    33458 |
|        |          |                  |                                    |        |         | LTDA                           |        |                 |          |
+--------+----------+------------------+------------------------------------+--------+---------+--------------------------------+--------+-----------------+----------+
```

</details>

 - `SOURCE` : the source of the decisions:
    - `crowdsec` : decision from crowdsec agent
    - `cscli`    : decision from `cscli` (manual decision)
    - `CAPI`     : decision from crowdsec API
 - `SCOPE:VALUE` is the target of the decisions :
    - "scope" : the scope of the decisions (`ip`, `range`, `user` ...)
    - "value" : the value to apply on the decisions (ip_addr, ip_range, username ...)
 - `REASON` is the scenario that was triggered (or human-supplied reason)
 - `ACTION` is the type of the decision (`ban`, `captcha` ...)
 - `COUNTRY` and `AS` are provided by GeoIP enrichment if present
 - `EVENTS` number of event that triggered this decison
 - `EXPIRATION` is the time left on remediation
 - `ALERT ID` is the ID of the corresponding alert


Check [command usage](/cscli/cscli_decisions.md) for additional filtering and output control flags.


## Add a decision

> Ban an IP

```bash
sudo cscli decisions add -i 1.2.3.4
```

:::info

 * default `duration`: `4h`
 * default `type` : `ban`

:::

> Add a decision (ban) on IP  `1.2.3.4` for 24 hours, with reason 'web bruteforce'

```bash
sudo cscli decisions add --ip 1.2.3.4 --duration 24h --reason "web bruteforce"
```

> Add a decision (ban) on range  `1.2.3.0/24` for 4 hours, with reason 'web bruteforce'

```bash
sudo cscli decisions add --range 1.2.3.0/24 --reason "web bruteforce"
```


> Add a decision (captcha) on ip `1.2.3.4` for 4hours (default duration), with reason 'web bruteforce'

```bash
sudo cscli decisions add --ip 1.2.3.4 --reason "web bruteforce" --type captcha
```

## Delete a decision

> delete the decision on IP `1.2.3.4`

```bash
sudo cscli decisions delete --ip 1.2.3.4
```

> delete the decision on range 1.2.3.0/24

```bash
sudo cscli decisions delete --range 1.2.3.0/24
```

:::caution
Please note that `cscli decisions list` will show you only the latest alert per given ip/scope.
However, several decisions targeting the same IP can exist. If you want to be sure to clear all decisions for a given ip/scope, use `cscli decisions delete -i x.x.x.x`
:::

> delete a decision by ID

```bash
sudo cscli  decisions delete --id 74
```



## Delete all existing bans

> Flush all the existing bans

```bash
sudo cscli decisions delete --all
```

:::caution

This will as well remove any existing ban

:::

## Import decisions

```bash
sudo cscli decisions import -i foo.csv
```

You can import a CSV or JSON file containing decisions directly with cscli.

The `value` field is mandatory and contains the target of the decision (ip, range, username, ...).

 The following fields are optional:
  - `duration`: duration of the decisions, defaults to 4h
  - `reason`: reason for the decisions, defaults to `manual`
  - `origin`: source of the decisions, defaults to `cscli`
  - `type`: action to apply for the decision, defaults to `ban`
  - `scope`: scope of the decision, default to `ip`

All fields (except for `value`) can be overwritten by command-line arguments, you can see the list in the [cli documentation](/cscli/cscli_decisions_import.md).

Example JSON file:

```json
[
   {
      "duration" : "4h", 
      "scope" : "ip", 
      "type" : "ban", 
      "value" : "1.2.3.5"
   }
]
```

Example CSV file :

```csv
duration,scope,value
24h,ip,1.2.3.4
```



:::caution
  If you use the sqlite database backend, performance can be negatively impacted if you import a lot of decisions (> 10000 decisions).
:::

