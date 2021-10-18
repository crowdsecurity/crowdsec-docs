---
id: cscli_explain
title: Understand logs processing
sidebar_position: 7
---


## cscli explain: understand what is going on

`cscli explain` allows you to understand how your logs are processed and in which scenarios they end up.


This can be done with a single line, with a given logfile, or via a full `dsn` :

```bash
cscli explain --file ./myfile.log --type nginx 
cscli explain --log "Sep 19 18:33:22 scw-d95986 sshd[24347]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=1.2.3.4" --type syslog
cscli explain --dsn "file://myfile.log" --type nginx
```

The typical output looks like this :

```bash
▶ sudo cscli explain --file ./x.log --type nginx 

line: xxx.xxx.xxx.xx - - [05/Nov/2017:07:23:41 +0100] "GET /Og9vl1%0d%2019s58%3Atest HTTP/1.1" 404 136 "-" "Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; rv:11.0) like Gecko" "-"
	├ s00-raw
	|	├ 🟢 crowdsecurity/non-syslog
	|	└ 🔴 crowdsecurity/syslog-logs
	├ s01-parse
	|	├ 🔴 crowdsecurity/apache2-logs
	|	├ 🔴 crowdsecurity/mysql-logs
	|	└ 🟢 crowdsecurity/nginx-logs
	├ s02-enrich
	|	├ 🟢 crowdsecurity/dateparse-enrich
	|	├ 🟢 crowdsecurity/geoip-enrich
	|	├ 🟢 crowdsecurity/http-logs
	|	└ 🟢 crowdsecurity/whitelists
	├-------- parser success 🟢
	├ Scenarios
		├ 🟢 crowdsecurity/http-crawl-non_statics
		└ 🟢 crowdsecurity/http-probing

```

What happens :
 1. Our log line `line: xxx.xxx.xxx.xx - - [05/Nov/2017:07:23:41 +0100] "GET ...` starts being parsed
 2. It enters the first stage `s00-raw`
   - It goes through the `syslog-logs` and `non-syslog` parsers of [`crowdsecurity/syslog-logs`](https://hub.crowdsec.net/author/crowdsecurity/configurations/syslog-logs)
     - as `syslog-logs` is successful and has `onsuccess: next_stage`, line can move to next stage
 3. It enters the stage `s01-parse`
   - It is not elligible for parsers [`crowdsecurity/apache2-logs`](https://hub.crowdsec.net/author/crowdsecurity/configurations/apache2-logs) nor [`crowdsecurity/mysql-logs`](https://hub.crowdsec.net/author/crowdsecurity/configurations/mysql-logs)
   - It is eligible and successfully parsed by [`crowdsecurity/nginx-logs`](https://hub.crowdsec.net/author/crowdsecurity/configurations/nginx-logs) and goes to the next stage thanks to `onsuccess: next_stage`
 4. It enters the stage `s02-enrich`
   - [`crowdsecurity/dateparse-enrich`](https://hub.crowdsec.net/author/crowdsecurity/configurations/dateparse-enrich) is in charge of parsing the timestamp to make the "cold logs" processable by scenarios
   - [`crowdsecurity/geoip-enrich`](https://hub.crowdsec.net/author/crowdsecurity/configurations/geoip-enrich) enriches the event with geoloc information based on the extracted IP
   - [`crowdsecurity/http-logs`](https://hub.crowdsec.net/author/crowdsecurity/configurations/http-logs) performs further parsing on generic HTTP elements, such as tagging static resources, breaking down URI in subparts etc.
   - [`crowdsecurity/whitelists`](https://hub.crowdsec.net/author/crowdsecurity/configurations/whitelists) is in charge of whitelisting events from local IPs, and won't be triggered here

 5. At this point, the log line successfully exited the parsing process and is ready to be processed by scenarios :
 - [`crowdsecurity/http-crawl-non_statics`](https://hub.crowdsec.net/author/crowdsecurity/configurations/http-crawl-non_statics) matches this event : it's a http request targeting a non static resource
 - [`crowdsecurity/http-probing`](https://hub.crowdsec.net/author/crowdsecurity/configurations/http-probing) matches as well: it's a 4XX HTTP request that doesn't target a static resource


Hopefully, this feature will help users understand behavior when debugging crowdsec or creating parsers and/or scenarios!


## How it works

Behind the scenes, `cscli explain` relies on your local crowdsec setup to launch a crowdsec instance to process the given logs, and "simply" provides a more user-friendly representation of the debug information. You thus need to have a local working crowdsec setup to be able to use this feature.




