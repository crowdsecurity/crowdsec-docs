---
id: alert_context
title: Contextualize Alerts
sidebar_position: 10
---



# Alert Contextualization


While CrowdSec doesn't store any logs after processing it, it can be useful to get some context about why an alert has been triggered (source machine, targeted FQDN ...).

It is possible to enable this feature in your CrowdSec agent configuration. You can choose which fields from a parsed log you want to be added in the context of the alert.


## Add context to alerts

You can choose the fields that you want to add to the context of your alerts with `cscli`:

```bash
sudo cscli lapi context add --key target_fqdn --value evt.Meta.target_fqdn
sudo cscli lapi context add --key user_agent --value evt.Parsed.http_user_agent
```

It is not mandatory to specify the key. If you don't specify it, it will be guessed from the value field.
For example, running this command:

```bash
sudo cscli lapi context add --value evt.Meta.target_fqdn
```

Will add the context with the key `target_fqdn`.

## Vizualise alert context

The alert context will be display when inspecting an alert:

```bash
$ sudo cscli alerts inspect 7
################################################################################################
 - ID         : 7
 - Date       : 2022-12-12T18:46:44Z
 - Machine    : c620f52cedf9432e969f26afee12d651
 - Simulation : false
 - Reason     : crowdsecurity/http-bad-user-agent
 - Events Count : 2
 - Scope:Value: Ip:127.0.0.1
 - Country    : 
 - AS         : 
 - Begin      : 2022-12-12 18:46:43.339960525 +0000 UTC
 - End        : 2022-12-12 18:46:43.341210351 +0000 UTC
 - Active Decisions  :
╭───────┬──────────────┬────────┬────────────────────┬──────────────────────╮
│  ID   │ scope:value  │ action │     expiration     │      created_at      │
├───────┼──────────────┼────────┼────────────────────┼──────────────────────┤
│ 15006 │ Ip:127.0.0.1 │ ban    │ 3h59m50.949157024s │ 2022-12-12T18:46:44Z │
╰───────┴──────────────┴────────┴────────────────────┴──────────────────────╯
 - Context  :
╭─────────────┬──────────────────────────────────────────────────────────────╮
│     Key     │                            Value                             │
├─────────────┼──────────────────────────────────────────────────────────────┤
│ target_fqdn │ www.crowdsec-test.net                                        │
│ target_fqdn │ www.crowdsec-test-1.net                                      │
│ user_agent  │ Mozilla/5.00 (Nikto/2.1.5) (Evasions:None) (Test:Port Check) │
│ user_agent  │ Mozilla/5.00 (Nikto/2.1.5) (Evasions:None) (Test:getinfo)    │
╰─────────────┴──────────────────────────────────────────────────────────────╯
```

And we can see that the `target_fqdn` and the `user_agent` are now displayed in the context of the alert.


## Delete a context

It is possible to delete a context by its key:
```bash
sudo cscli lapi context  delete --key user_agent       
INFO[12-12-2022 07:49:01 PM] key 'user_agent' has been removed            
INFO[12-12-2022 07:49:01 PM] /etc/crowdsec/console/context.yaml file saved
```


Or it is possible to delete a context by its value:

```bash
sudo cscli lapi context delete --value evt.Meta.target_fqdn
INFO[12-12-2022 07:48:38 PM] value 'evt.Meta.target_fqdn' has been removed from key 'target_fqdn' 
INFO[12-12-2022 07:48:38 PM] /etc/crowdsec/console/context.yaml file saved 
```

## Detect possible values for context


It is possible to detect all the possible fields that a given parser can output (or all the installed parsers with `--all` flag):

```bash
$ sudo cscli lapi context detect crowdsecurity/nginx-logs
Acquisition :
  - evt.Line.Module
  - evt.Line.Raw
  - evt.Line.Src
crowdsecurity/nginx-logs :
  - evt.Meta.http_path
  - evt.Meta.http_status
  - evt.Meta.http_user_agent
  - evt.Meta.http_verb
  - evt.Meta.log_type
  - evt.Meta.service
  - evt.Meta.source_ip
  - evt.Meta.target_fqdn
  - evt.Parsed.body_bytes_sent
  - evt.Parsed.cid
  - evt.Parsed.http_referer
  - evt.Parsed.http_user_agent
  - evt.Parsed.http_version
  - evt.Parsed.loglevel
  - evt.Parsed.message
  - evt.Parsed.pid
  - evt.Parsed.proxy_alternative_upstream_name
  - evt.Parsed.proxy_upstream_name
  - evt.Parsed.remote_addr
  - evt.Parsed.remote_user
  - evt.Parsed.request
  - evt.Parsed.request_length
  - evt.Parsed.request_time
  - evt.Parsed.status
  - evt.Parsed.target_fqdn
  - evt.Parsed.tid
  - evt.Parsed.time
  - evt.Parsed.time_local
  - evt.Parsed.verb
  - evt.StrTime
```

## Send alert context to CrowdSec Console


To send the context with the alert to the CrowdSec Console, you need to enable the feature on the CrowdSec Local API server:

```bash
$ sudo cscli console enable context       
INFO[12-12-2022 08:21:29 PM] context set to true                          
INFO[12-12-2022 08:21:29 PM] [context] have been enabled                  
INFO[12-12-2022 08:21:29 PM] Run 'sudo systemctl reload crowdsec' for the new configuration to be effective. 
```
