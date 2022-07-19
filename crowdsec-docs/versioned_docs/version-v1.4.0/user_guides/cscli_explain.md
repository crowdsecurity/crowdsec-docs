---
id: cscli_explain
title: Understand logs processing
sidebar_position: 7
---

:::info
`cscli explain` relies on your local setup, parsers, scenario to display its data. It requires a working local crowdsec setup.
:::


## cscli explain: understand what is going on

`cscli explain` allows you to understand how your logs are processed and in which scenarios they end up.


This can be done with a single line, with a given logfile, or via a full `dsn` :

```bash
cscli explain --file ./myfile.log --type nginx 
cscli explain --log "Sep 19 18:33:22 scw-d95986 sshd[24347]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=1.2.3.4" --type syslog
cscli explain --dsn "file://myfile.log" --type nginx
```

Hint: if your are creating/collecting data on the fly (over a network, for example) and want to avoid temporary files, you can use `cscli explain --file /dev/fd/0` or `cscli explain -dsn "file://dev/fd/0"` to refer to standard input.

The typical output looks like this :

```bash
▶ sudo cscli explain --file ./x.log --type nginx 

line: xx.xx.xx.xx - - [05/Nov/2017:07:23:41 +0100] "GET /Og9vl1%0d%2019s58%3Atest HTTP/1.1" 404 136 "-" "Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; rv:11.0) like Gecko" "-"
	├ s00-raw
	|	├ 🟢 crowdsecurity/non-syslog (first_parser)
	|	└ 🔴 crowdsecurity/syslog-logs
	├ s01-parse
	|	└ 🟢 crowdsecurity/nginx-logs (+22 ~2)
	├ s02-enrich
	|	├ 🟢 crowdsecurity/dateparse-enrich (+1 ~1)
	|	├ 🟢 crowdsecurity/geoip-enrich (+12)
	|	├ 🟢 crowdsecurity/http-logs (+7)
	|	└ 🟢 crowdsecurity/whitelists (unchanged)
	├-------- parser success 🟢
	├ Scenarios
		├ 🟢 crowdsecurity/http-crawl-non_statics
		└ 🟢 crowdsecurity/http-probing
```

Lines represent if and how a parser interacted with the line: how many fields were added (`+`), modified (`~`), or deleted (`-`).
Other visual clues include: `unchanged` a parser didn't modify an event (meaning it is not relevant) or `[whitelisted]` if a whitelist matched the event.

What happens :
 1. Our log line `line: xxx.xxx.xxx.xx - - [05/Nov/2017:07:23:41 +0100] "GET ...` starts being parsed
 2. It enters the first stage `s00-raw`
   - It goes through the `syslog-logs` and `non-syslog` parsers of [`crowdsecurity/syslog-logs`](https://hub.crowdsec.net/author/crowdsecurity/configurations/syslog-logs)
     - as `syslog-logs` is successful and has `onsuccess: next_stage`, line can move to next stage
 3. It enters the stage `s01-parse`
   - It is not eligible for parsers [`crowdsecurity/apache2-logs`](https://hub.crowdsec.net/author/crowdsecurity/configurations/apache2-logs) nor [`crowdsecurity/mysql-logs`](https://hub.crowdsec.net/author/crowdsecurity/configurations/mysql-logs)
   - It is eligible and successfully parsed by [`crowdsecurity/nginx-logs`](https://hub.crowdsec.net/author/crowdsecurity/configurations/nginx-logs) and goes to the next stage thanks to `onsuccess: next_stage`.
 4. It enters the stage `s02-enrich`
   - [`crowdsecurity/dateparse-enrich`](https://hub.crowdsec.net/author/crowdsecurity/configurations/dateparse-enrich) is in charge of parsing the timestamp to make the "cold logs" processable by scenarios
   - [`crowdsecurity/geoip-enrich`](https://hub.crowdsec.net/author/crowdsecurity/configurations/geoip-enrich) enriches the event with geoloc information based on the extracted IP
   - [`crowdsecurity/http-logs`](https://hub.crowdsec.net/author/crowdsecurity/configurations/http-logs) performs further parsing on generic HTTP elements, such as tagging static resources, breaking down URI in subparts etc.
   - [`crowdsecurity/whitelists`](https://hub.crowdsec.net/author/crowdsecurity/configurations/whitelists) is in charge of whitelisting events from local IPs, and won't be triggered here

 5. At this point, the log line successfully exited the parsing process and is ready to be processed by scenarios :
 - [`crowdsecurity/http-crawl-non_statics`](https://hub.crowdsec.net/author/crowdsecurity/configurations/http-crawl-non_statics) matches this event : it's a http request targeting a non static resource
 - [`crowdsecurity/http-probing`](https://hub.crowdsec.net/author/crowdsecurity/configurations/http-probing) matches as well: it's a 4XX HTTP request that doesn't target a static resource

 6. Please note that this feature does not track overflows themselves, it only points out if the event was able to *enter* the scenario

Hopefully, this feature will help users understand the behavior when debugging crowdsec or creating parsers and/or scenarios.


## Verbose mode

When troubleshooting parsers, the `--verbose/-v` option offers extra information. Every change made to the event is displayed along below the associated parser.

```bash
▶ ./cscli -c dev.yaml explain --file /tmp/xx --type nginx --verbose
line: 10.42.42.42 - - [23/Oct/2017:10:46:06 +0200] "GET /admin/2019p1mnsa8q1ktU HTTP/1.1" 404 136 "-" "Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; rv:11.0) like Gecko (Wallarm DirBuster)" "-"
	├ s00-raw
	|	├ 🟢 crowdsecurity/non-syslog (first_parser)
	|	└ 🔴 crowdsecurity/syslog-logs
	├ s01-parse
	|	└ 🟢 crowdsecurity/nginx-logs (+22 ~2)
	|		└ update Stage : s01-parse -> s02-enrich
	|		└ create Parsed.body_bytes_sent : 136
	|		└ create Parsed.http_referer : -
	|		└ create Parsed.http_user_agent : Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; rv:11.0) like Gecko (Wallarm DirBuster)
	|		└ create Parsed.status : 404
	|		└ create Parsed.target_fqdn : 
	|		└ create Parsed.proxy_alternative_upstream_name : 
	|		└ create Parsed.request_time : 
	|		└ create Parsed.time_local : 23/Oct/2017:10:46:06 +0200
	|		└ create Parsed.proxy_upstream_name : 
	|		└ create Parsed.remote_user : -
	|		└ create Parsed.request : /admin/2019p1mnsa8q1ktU
	|		└ create Parsed.http_version : 1.1
	|		└ create Parsed.remote_addr : 10.42.42.42
	|		└ create Parsed.request_length : 
	|		└ create Parsed.verb : GET
	|		└ update StrTime :  -> 23/Oct/2017:10:46:06 +0200
	|		└ create Meta.http_user_agent : Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; rv:11.0) like Gecko (Wallarm DirBuster)
	|		└ create Meta.service : http
	|		└ create Meta.source_ip : 10.42.42.42
	|		└ create Meta.http_verb : GET
	|		└ create Meta.log_type : http_access-log
	|		└ create Meta.http_path : /admin/2019p1mnsa8q1ktU
	|		└ create Meta.http_status : 404
	├ s02-enrich
	|	├ 🟢 crowdsecurity/dateparse-enrich (+1 ~1)
	|		├ create Enriched.MarshaledTime : 2017-10-23T10:46:06+02:00

```

## How it works

Behind the scene, `cscli explain` relies on your local crowdsec setup to launch a crowdsec instance to process the given logs, and "simply" provides a more user-friendly representation of the debug information.





