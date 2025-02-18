---
id: decisions_mgmt
title: Decisions
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
  <summary>Output</summary>

```bash
+--------+----------+------------------+------------------------------------+--------+---------+--------------------------------+--------+-----------------+----------+
|   ID   |  SOURCE  |   SCOPE:VALUE    |               REASON               | ACTION | COUNTRY |               AS               | EVENTS |   EXPIRATION    | ALERT ID |
+--------+----------+------------------+------------------------------------+--------+---------+--------------------------------+--------+-----------------+----------+
| 276009 | crowdsec | Ip:xx.93.x.xxx   | crowdsecurity/telnet-bf            | ban    | CN      |  xxxxxxxx xxxxxxx Advertising  |      7 | 2m53.949221341s |    33459 |
|        |          |                  |                                    |        |         | Co.,Ltd.                       |        |                 |          |
| 276008 | crowdsec | Ip:xxx.53.xx.xxx | crowdsecurity/smb-bf               | ban    | BR      |  xxxxxxxxxx xxxxxxxxxxxxxxxx   |      6 | 1m48.728998974s |    33458 |
|        |          |                  |                                    |        |         | LTDA                           |        |                 |          |
+--------+----------+------------------+------------------------------------+--------+---------+--------------------------------+--------+-----------------+----------+
```
 - `Decision ID` is the ID of the decision
 - `SOURCE` : the source of the decisions:
    - `crowdsec` : decision from the CrowdSec agent
    - `cscli`    : decision from `cscli` (manual decision)
    - `CAPI`     : decision from CrowdSec API
    - `cscli-import`: decision from imported file
 - `SCOPE:VALUE` is the target of the decisions :
    - "scope" : the scope of the decisions (`ip`, `range`, `user` ...)
    - "value" : the value to apply on the decisions (ip_addr, ip_range, username ...)
 - `REASON` is the scenario that was triggered (or human-supplied reason)
 - `ACTION` is the type of the decision (`ban`, `captcha` ...)
 - `COUNTRY` and `AS` are provided by GeoIP enrichment if present
 - `EVENTS` number of events that triggered this decison
 - `EXPIRATION` is the time left on remediation
 - `ALERT ID` is the ID of the corresponding alert

</details>

Check [command usage](/docs/next/cscli/cscli_decisions) for additional filtering and output control flags.

#### List active decisions from the CrowdSec Central API

```bash
sudo cscli decisions list --origin CAPI
```

#### List active decisions from an imported file

```bash
sudo cscli decisions list --origin cscli-import
```


## Add a decision

> Ban an IP address

```bash
sudo cscli decisions add -i 192.168.1.1
```

:::info

 * default `duration`: `4h`
 * default `type` : `ban`

:::

> Add a decision (ban) on the IP address `192.168.1.1` for 24 hours, with reason 'web bruteforce'

```bash
sudo cscli decisions add --ip 192.168.1.1 --duration 24h --reason "web bruteforce"
```

> Add a decision (ban) on the IP range  `1.2.3.0/24` for 4 hours (the default duration), with reason 'web bruteforce'

```bash
sudo cscli decisions add --range 1.2.3.0/24 --reason "web bruteforce"
```


> Add a decision (captcha) the on IP address `192.168.1.1` for 4 hours, with reason 'web bruteforce'

```bash
sudo cscli decisions add --ip 192.168.1.1 --reason "web bruteforce" --type captcha
```

## Delete a decision

> delete the decision on IP address `192.168.1.1`

```bash
sudo cscli decisions delete --ip 192.168.1.1
```

> delete the decision on IP range 1.2.3.0/24

```bash
sudo cscli decisions delete --range 1.2.3.0/24
```

:::caution
Please note that `cscli decisions list` shows you only the latest alert per any given IP address or scope.
However, several decisions targeting the same IP address can exist. If you want to be sure to clear all decisions for a given IP address or scope, use `cscli decisions delete -i x.x.x.x`
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
This will as well remove local and community decisions.
:::

## Import decisions

::: warning
Importing over 1000 decisions may impact the performance of the backend temporarily, `cscli` will split the import into batches to avoid this.
:::

You can import a CSV or JSON file containing decisions directly with cscli.

The `value` field is mandatory and contains the target of the decision (ip, range, username, ...).

 The following fields are optional:
  - `duration`: duration of the decision, defaults to 4h
  - `reason`: reason for the decision, defaults to `manual`
  - `origin`: source of the decision, defaults to `cscli`
  - `type`: action to apply for the decision, defaults to `ban`
  - `scope`: scope of the decision, defaults to `ip`

All the fields (except for `value`) can be overwritten by command line arguments, you can see the list in the [cscli documentation](/docs/next/cscli/cscli_decisions_import).

We use the file extension to determine the format of the file, but you can also use the `--format` flag to specify it.

### CSV File

```bash
sudo cscli decisions import -i foo.csv
```

```csv title="Example CSV file"
duration,scope,value
24h,ip,192.168.1.1
```

### JSON File

```bash
sudo cscli decisions import -i foo.json
```

```json title="Example JSON file"
[
   {
      "duration" : "4h", 
      "scope" : "ip", 
      "type" : "ban", 
      "value" : "1.2.3.5"
   }
]
```
### STDIN

:::info
In the example we command we show how to use `cat` to pipe the content of a file to `cscli`. However, you can use any command that outputs the contents to STDOUT.
:::

```bash
cat ips.txt | sudo cscli decisions import -i- --format values
```

```text title="Example of ips.txt"
10.10.10.10
10.10.10.11
10.10.10.12
```
