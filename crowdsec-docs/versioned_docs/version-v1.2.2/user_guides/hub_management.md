---
id: hub_mgmt
title: Hub management
sidebar_position: 1
---

Hub management, via `cscli` allows you to install, upgrade, remove and view installed collections, parsers, scenarios etc.



## Collections


### Install

A collection contains parsers and scenarios to form a coherent ensemble. Most of the time, this is the only you will need to install. 

Have nginx running ? `cscli collections install crowdsecurity/nginx` should do the trick ! 

Browse the [hub for more collections](https://hub.crowdsec.net/browse/#collections).

```bash
sudo cscli collections install <collection_name>
```

<details>
  <summary>Install <strong> crowdsecurity/whitelist-good-actors </strong> collection </summary>

```bash
sudo cscli collections install crowdsecurity/whitelist-good-actors
INFO[0000] crowdsecurity/seo-bots-whitelist : OK        
INFO[0000] downloading data 'https://raw.githubusercontent.com/crowdsecurity/sec-lists/master/whitelists/benign_bots/search_engine_crawlers/rdns_seo_bots.txt' in '/var/lib/crowdsec/data/rdns_seo_bots.txt' 
INFO[0001] downloading data 'https://raw.githubusercontent.com/crowdsecurity/sec-lists/master/whitelists/benign_bots/search_engine_crawlers/rnds_seo_bots.regex' in '/var/lib/crowdsec/data/rdns_seo_bots.regex' 
INFO[0002] downloading data 'https://raw.githubusercontent.com/crowdsecurity/sec-lists/master/whitelists/benign_bots/search_engine_crawlers/ip_seo_bots.txt' in '/var/lib/crowdsec/data/ip_seo_bots.txt' 
INFO[0002] crowdsecurity/cdn-whitelist : OK             
INFO[0002] downloading data 'https://www.cloudflare.com/ips-v4' in '/var/lib/crowdsec/data/cloudflare_ips.txt' 
INFO[0003] crowdsecurity/rdns : OK                      
INFO[0003] crowdsecurity/whitelist-good-actors : OK     
INFO[0003] /etc/crowdsec/postoverflows/s01-whitelist doesn't exist, create 
INFO[0003] Enabled postoverflows : crowdsecurity/seo-bots-whitelist 
INFO[0003] Enabled postoverflows : crowdsecurity/cdn-whitelist 
INFO[0003] /etc/crowdsec/postoverflows/s00-enrich doesn't exist, create 
INFO[0003] Enabled postoverflows : crowdsecurity/rdns   
INFO[0003] Enabled collections : crowdsecurity/whitelist-good-actors 
INFO[0003] Enabled crowdsecurity/whitelist-good-actors  
INFO[0003] Run 'systemctl reload crowdsec' for the new configuration to be effective. 
$ systemctl reload crowdsec
```
</details>


### List

```bash
sudo cscli collections list
```

<details>
  <summary>cscli collections list example</summary>

```bash
sudo cscli collections list   
-------------------------------------------------------------------------------------------------------------
 NAME                               📦 STATUS    VERSION  LOCAL PATH                                         
-------------------------------------------------------------------------------------------------------------
 crowdsecurity/nginx                ✔️  enabled  0.1      /etc/crowdsec/collections/nginx.yaml               
 crowdsecurity/base-http-scenarios  ✔️  enabled  0.1      /etc/crowdsec/collections/base-http-scenarios.yaml 
 crowdsecurity/sshd                 ✔️  enabled  0.1      /etc/crowdsec/collections/sshd.yaml                
 crowdsecurity/linux                ✔️  enabled  0.2      /etc/crowdsec/collections/linux.yaml               
-------------------------------------------------------------------------------------------------------------
```

</details>

:::tip

This will list only installed parsers.

Use `--all` to list available parsers.

:::

### Upgrade

```bash
sudo cscli hub update
sudo cscli collections upgrade <collection_name>
```

Collection upgrade allows you to upgrade an existing collection (and its items) to the latest version.


<details>
  <summary>Upgrade <strong>crowdsecurity/sshd</strong> collection</summary>

```bash
sudo cscli hub update
INFO[06-08-2021 04:18:33 PM] Wrote new 126099 bytes index to /etc/crowdsec/hub/.index.json 
sudo cscli collections upgrade crowdsecurity/sshd  
INFO[0000] crowdsecurity/sshd : up-to-date              
WARN[0000] crowdsecurity/sshd-logs : overwrite          
WARN[0000] crowdsecurity/ssh-bf : overwrite             
WARN[0000] crowdsecurity/sshd : overwrite               
INFO[0000] 📦 crowdsecurity/sshd : updated               
INFO[0000] Upgraded 1 items                             
INFO[0000] Run 'systemctl reload crowdsec' for the new configuration to be effective.
$ systemctl reload crowdsec

```

</details>

### Monitor

```bash
sudo cscli collections inspect <collection_name>
```

Collections inspect will give you detailed information about a given collection, including versioning data *and* runtime metrics (fetched from prometheus).

<details>
  <summary>cscli collections inspect example</summary>

```bash
sudo cscli collections inspect crowdsecurity/sshd       
type: collections
name: crowdsecurity/sshd
filename: sshd.yaml
description: 'sshd support : parser and brute-force detection'
author: crowdsecurity
belongs_to_collections:
- crowdsecurity/linux
- crowdsecurity/linux
remote_path: collections/crowdsecurity/sshd.yaml
version: "0.1"
local_path: /etc/crowdsec/collections/sshd.yaml
localversion: "0.1"
localhash: 21159aeb87529efcf1a5033f720413d5321a6451bab679a999f7f01a7aa972b3
installed: true
downloaded: true
uptodate: true
tainted: false
local: false
parsers:
- crowdsecurity/sshd-logs
scenarios:
- crowdsecurity/ssh-bf

Current metrics : 

 - (Scenario) crowdsecurity/ssh-bf: 
+---------------+-----------+--------------+--------+---------+
| CURRENT COUNT | OVERFLOWS | INSTANCIATED | POURED | EXPIRED |
+---------------+-----------+--------------+--------+---------+
|             0 |         1 |            2 |     10 |       1 |
+---------------+-----------+--------------+--------+---------+

```

</details>

### Reference

See more about collection [here](/collections/introduction.md).


## Parsers

### Install

```bash
sudo cscli parsers install <parser_name>
```

<details>
  <summary>Install <strong>crowdsecurity/iptables-logs</strong> parser</summary>

```bash
sudo cscli parsers install crowdsecurity/iptables-logs    
INFO[0000] crowdsecurity/iptables-logs : OK             
INFO[0000] Enabled parsers : crowdsecurity/iptables-logs 
INFO[0000] Enabled crowdsecurity/iptables-logs          
INFO[0000] Run 'systemctl reload crowdsec' for the new configuration to be effective. 
```
</details>

### List


```bash
sudo cscli parsers list
```

[Parsers](/parsers/introduction.mdx) are yaml files in `/etc/crowdsec/parsers/<STAGE>/parser.yaml`.


<details>
  <summary>List installed parsers</summary>

```bash
sudo cscli parsers list
--------------------------------------------------------------------------------------------------------------
 NAME                            📦 STATUS    VERSION  LOCAL PATH                                             
--------------------------------------------------------------------------------------------------------------
 crowdsecurity/whitelists        ✔️  enabled  0.1      /etc/crowdsec/parsers/s02-enrich/whitelists.yaml       
 crowdsecurity/dateparse-enrich  ✔️  enabled  0.1      /etc/crowdsec/parsers/s02-enrich/dateparse-enrich.yaml 
 crowdsecurity/iptables-logs     ✔️  enabled  0.1      /etc/crowdsec/parsers/s01-parse/iptables-logs.yaml     
 crowdsecurity/syslog-logs       ✔️  enabled  0.1      /etc/crowdsec/parsers/s00-raw/syslog-logs.yaml         
 crowdsecurity/sshd-logs         ✔️  enabled  0.1      /etc/crowdsec/parsers/s01-parse/sshd-logs.yaml         
 crowdsecurity/geoip-enrich      ✔️  enabled  0.2      /etc/crowdsec/parsers/s02-enrich/geoip-enrich.yaml     
 crowdsecurity/http-logs         ✔️  enabled  0.2      /etc/crowdsec/parsers/s02-enrich/http-logs.yaml        
 crowdsecurity/nginx-logs        ✔️  enabled  0.1      /etc/crowdsec/parsers/s01-parse/nginx-logs.yaml        
--------------------------------------------------------------------------------------------------------------

```

</details>


### Upgrade

```bash
sudo cscli hub update
sudo cscli parsers upgrade <parser_name>
```

Parsers upgrade allows you to upgrade an existing parser to the latest version.

<details>
  <summary>Upgrade <strong>crowdsecurity/sshd-logs</strong> parser</summary>

```bash
sudo cscli hub update
INFO[06-08-2021 04:18:33 PM] Wrote new 126099 bytes index to /etc/crowdsec/hub/.index.json 
sudo cscli parsers upgrade crowdsecurity/sshd-logs  
INFO[0000] crowdsecurity/sshd : up-to-date              
WARN[0000] crowdsecurity/sshd-logs : overwrite          
WARN[0000] crowdsecurity/ssh-bf : overwrite             
WARN[0000] crowdsecurity/sshd : overwrite               
INFO[0000] 📦 crowdsecurity/sshd : updated               
INFO[0000] Upgraded 1 items                             
INFO[0000] Run 'systemctl reload crowdsec' for the new configuration to be effective.

```

</details>

### Monitor

```bash
sudo cscli parsers inspect <parser_name>
```

Parsers inspect will give you detailed information about a given parser, including versioning data *and* runtime metrics (fetched from prometheus).

<!--TBD: refaire l'output apres avoir fix le 'parsers inspect XXXX'-->
<details>
  <summary>Inspect <strong>crowdsecurity/sshd-logs</strong> parser</summary>

```bash
sudo cscli parsers inspect crowdsecurity/sshd-logs     
type: parsers
stage: s01-parse
name: crowdsecurity/sshd-logs
filename: sshd-logs.yaml
description: Parse openSSH logs
author: crowdsecurity
belongs_to_collections:
- crowdsecurity/sshd
remote_path: parsers/s01-parse/crowdsecurity/sshd-logs.yaml
version: "0.1"
local_path: /etc/crowdsec/parsers/s01-parse/sshd-logs.yaml
localversion: "0.1"
localhash: ecd40cb8cd95e2bad398824ab67b479362cdbf0e1598b8833e2f537ae3ce2f93
installed: true
downloaded: true
uptodate: true
tainted: false
local: false

Current metrics :

 - (Parser) crowdsecurity/sshd-logs:
+-------------------+-------+--------+----------+
|      PARSERS      | HITS  | PARSED | UNPARSED |
+-------------------+-------+--------+----------+
| /var/log/auth.log | 94138 |  42404 |    51734 |
+-------------------+-------+--------+----------+

```

</details>

### Reference

See more details about parsers [here](/parsers/introduction.mdx).

## Enrichers

Enrichers are basically [parsers](/parsers/introduction.mdx) that can rely on external methods to provide extra contextual information to the event. The enrichers are usually in the `s02-enrich` stage (after most of the parsing happened).

Enrichers functions should all accept a string as a parameter, and return an associative string array, that will be automatically merged into the `Enriched` map of the [event](/expr/event.md).

:::caution

At the time of writing, enrichers plugin mechanism implementation is still ongoing (read: the list of available enrichment methods is currently hardcoded).

:::

As an example let's look into the geoip-enrich parser/enricher :

It relies on [the geolite2 data created by maxmind](https://www.maxmind.com) and the [geoip2 golang module](https://github.com/oschwald/geoip2-golang) to provide the actual data.


It exposes three methods : `GeoIpCity` `GeoIpASN` and `IpToRange` that are used by the `crowdsecurity/geoip-enrich`.
Enrichers can be installed as any other parsers with the following command:

```
sudo cscli parsers install crowdsecurity/geoip-enrich
```

Take a tour at the [Hub](https://hub.crowdsec.net/browse/#configurations) to find them !

### Reference

See more about enrichers [here](/parsers/enricher.md).


## Scenarios


### Install

```bash
sudo cscli scenarios install <scenario_name>
```

<details>
  <summary>Install <strong>crowdsecurity/http-bf-wordpress_bf</strong> scenario</summary>

```bash
sudo cscli scenarios install crowdsecurity/http-bf-wordpress_bf
INFO[0000] crowdsecurity/http-bf-wordpress_bf : OK      
INFO[0000] Enabled scenarios : crowdsecurity/http-bf-wordpress_bf 
INFO[0000] Enabled crowdsecurity/http-bf-wordpress_bf   
INFO[0000] Run 'systemctl reload crowdsec' for the new configuration to be effective. 
$ systemctl reload crowdsec
```

</details>


### List

```bash
sudo cscli scenarios list
```

:::tip

This will list only installed parsers.

Use `--all` to list available parsers.

:::

[Scenario](/scenarios/introduction.mdx) are yaml files in `/etc/crowdsec/scenarios/`.


<details>
  <summary>List installed scenarios</summary>

```bash
sudo cscli scenarios list
---------------------------------------------------------------------------------------------------------------------------
 NAME                                       📦 STATUS    VERSION  LOCAL PATH                                               
---------------------------------------------------------------------------------------------------------------------------
 crowdsecurity/ssh-bf                       ✔️  enabled  0.1      /etc/crowdsec/scenarios/ssh-bf.yaml                      
 crowdsecurity/http-bf-wordpress_bf         ✔️  enabled  0.1      /etc/crowdsec/scenarios/http-bf-wordpress_bf.yaml        
 crowdsecurity/http-crawl-non_statics       ✔️  enabled  0.2      /etc/crowdsec/scenarios/http-crawl-non_statics.yaml      
 crowdsecurity/http-probing                 ✔️  enabled  0.1      /etc/crowdsec/scenarios/http-probing.yaml                
 crowdsecurity/http-sensitive-files         ✔️  enabled  0.2      /etc/crowdsec/scenarios/http-sensitive-files.yaml        
 crowdsecurity/http-bad-user-agent          ✔️  enabled  0.2      /etc/crowdsec/scenarios/http-bad-user-agent.yaml         
 crowdsecurity/http-path-traversal-probing  ✔️  enabled  0.2      /etc/crowdsec/scenarios/http-path-traversal-probing.yaml 
 crowdsecurity/http-sqli-probing            ✔️  enabled  0.2      /etc/crowdsec/scenarios/http-sqli-probing.yaml           
 crowdsecurity/http-backdoors-attempts      ✔️  enabled  0.2      /etc/crowdsec/scenarios/http-backdoors-attempts.yaml     
 crowdsecurity/http-xss-probing             ✔️  enabled  0.2      /etc/crowdsec/scenarios/http-xss-probing.yaml            
---------------------------------------------------------------------------------------------------------------------------

```

</details>


### Upgrade

```bash
sudo cscli hub update
sudo cscli scenarios upgrade <scenario_name>
```

Scenarios upgrade allows you to upgrade an existing scenario to the latest version.

<details>
  <summary>Upgrade <strong>crowdsecurity/http-bf-wordpress_bf</strong> scenario</summary>

```bash
sudo cscli hub update
INFO[06-08-2021 04:18:33 PM] Wrote new 126099 bytes index to /etc/crowdsec/hub/.index.json 
sudo cscli scenarios upgrade crowdsecurity/ssh-bf
INFO[0000] crowdsecurity/ssh-bf : up-to-date            
WARN[0000] crowdsecurity/ssh-bf : overwrite             
INFO[0000] 📦 crowdsecurity/ssh-bf : updated             
INFO[0000] Upgraded 1 items                             
INFO[0000] Run 'systemctl reload crowdsec' for the new configuration to be effective. 
```

</details>

### Monitor

```bash
sudo cscli scenarios inspect <scenario_name>
```

Scenarios inspect will give you detailed information about a given scenario, including versioning data *and* runtime metrics (fetched from prometheus).

<details>
  <summary>Inspect <strong>crowdsecurity/http-bf-wordpress_bf</strong> scenario</summary>

```bash
sudo cscli scenarios inspect crowdsecurity/ssh-bf    
type: scenarios
name: crowdsecurity/ssh-bf
filename: ssh-bf.yaml
description: Detect ssh bruteforce
author: crowdsecurity
references:
- http://wikipedia.com/ssh-bf-is-bad
belongs_to_collections:
- crowdsecurity/sshd
remote_path: scenarios/crowdsecurity/ssh-bf.yaml
version: "0.1"
local_path: /etc/crowdsec/scenarios/ssh-bf.yaml
localversion: "0.1"
localhash: 4441dcff07020f6690d998b7101e642359ba405c2abb83565bbbdcee36de280f
installed: true
downloaded: true
uptodate: true
tainted: false
local: false

Current metrics :

 - (Scenario) crowdsecurity/ssh-bf:
+---------------+-----------+--------------+--------+---------+
| CURRENT COUNT | OVERFLOWS | INSTANCIATED | POURED | EXPIRED |
+---------------+-----------+--------------+--------+---------+
|            14 |      5700 |         7987 |  42572 |    2273 |
+---------------+-----------+--------------+--------+---------+
```

</details>

### Reference

See more about scenarios [here](/scenarios/introduction.mdx).
