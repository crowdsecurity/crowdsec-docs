---
id: create_expr
title: Expression
---

Let's whitelist a **specific** user-agent (of course, it's just an example, don't do this in production !). 

Since we are using data that is present from the parsing stage we can do this within `Parsing Whitelist` level. Please see [introduction](/whitelist/introduction.md) for your OS specific paths.

```yaml
name: crowdsecurity/whitelists
description: "Whitelist events from private ipv4 addresses"
whitelist:
  reason: "private ipv4 ranges"
  expression:
   - evt.Parsed.http_user_agent == 'MySecretUserAgent'
```

```bash title="Reload CrowdSec"
sudo systemctl reload crowdsec
```

For the record, I edited nikto's configuration to use 'MySecretUserAgent' as user-agent, and thus :

```bash
nikto -host myfqdn.com
```

```bash
tail -f /var/log/crowdsec.log
```

CrowdSec will inform you some lines have been discarded because they are whitelisted by the expression.

### How can I find which data is present from parsing stage?

You can use [cscli explain](/cscli/cscli_explain.md) to generate output from a given log line or log file.

For example:

```bash
sudo cscli explain --log '5.5.8.5 - - [04/Jan/2020:07:25:02 +0000] "GET /.well-known/acme-challenge/FMuukC2JOJ5HKmLBujjE_BkDo HTTP/1.1" 404 522 "-" "MySecretUserAgent"' --type nginx -v
```

<details>
  <summary>Output: </summary>

```bash
line: 5.5.8.5 - - [04/Jan/2020:07:25:02 +0000] "GET /.well-known/acme-challenge/FMuukC2JOJ5HKmLBujjE_BkDo HTTP/1.1" 404 522 "-" "MySecretUserAgent"
	├ s00-raw
	|	├ 🟢 crowdsecurity/non-syslog (+5 ~8)
	|		├ update evt.ExpectMode : %!s(int=0) -> 1
	|		├ update evt.Stage :  -> s01-parse
	|		├ update evt.Line.Raw :  -> 5.5.8.5 - - [04/Jan/2020:07:25:02 +0000] "GET /.well-known/acme-challenge/FMuukC2JOJ5HKmLBujjE_BkDo HTTP/1.1" 404 522 "-" "MySecretUserAgent"
	|		├ update evt.Line.Src :  -> /tmp/cscli_explain156736029/cscli_test_tmp.log
	|		├ update evt.Line.Time : 0001-01-01 00:00:00 +0000 UTC -> 2023-07-21 14:05:09.67803335 +0000 UTC
	|		├ create evt.Line.Labels.type : nginx
	|		├ update evt.Line.Process : %!s(bool=false) -> true
	|		├ update evt.Line.Module :  -> file
	|		├ create evt.Parsed.message : 5.5.8.5 - - [04/Jan/2020:07:25:02 +0000] "GET /.well-known/acme-challenge/FMuukC2JOJ5HKmLBujjE_BkDo HTTP/1.1" 404 522 "-" "MySecretUserAgent"
	|		├ create evt.Parsed.program : nginx
	|		├ update evt.Time : 0001-01-01 00:00:00 +0000 UTC -> 2023-07-21 14:05:09.678072613 +0000 UTC
	|		├ create evt.Meta.datasource_path : /tmp/cscli_explain156736029/cscli_test_tmp.log
	|		├ create evt.Meta.datasource_type : file
	├ s01-parse
	|	├ 🟢 crowdsecurity/nginx-logs (+22 ~2)
	|		├ update evt.Stage : s01-parse -> s02-enrich
	|		├ create evt.Parsed.remote_addr : 5.5.8.5
	|		├ create evt.Parsed.request_length : 
	|		├ create evt.Parsed.verb : GET
	|		├ create evt.Parsed.http_user_agent : MySecretUserAgent
	|		├ create evt.Parsed.request : /.well-known/acme-challenge/FMuukC2JOJ5HKmLBujjE_BkDo
	|		├ create evt.Parsed.body_bytes_sent : 522
	|		├ create evt.Parsed.remote_user : -
	|		├ create evt.Parsed.time_local : 04/Jan/2020:07:25:02 +0000
	|		├ create evt.Parsed.http_referer : -
	|		├ create evt.Parsed.request_time : 
	|		├ create evt.Parsed.proxy_alternative_upstream_name : 
	|		├ create evt.Parsed.proxy_upstream_name : 
	|		├ create evt.Parsed.status : 404
	|		├ create evt.Parsed.target_fqdn : 
	|		├ create evt.Parsed.http_version : 1.1
	|		├ update evt.StrTime :  -> 04/Jan/2020:07:25:02 +0000
	|		├ create evt.Meta.http_status : 404
	|		├ create evt.Meta.http_user_agent : MySecretUserAgent
	|		├ create evt.Meta.log_type : http_access-log
	|		├ create evt.Meta.service : http
	|		├ create evt.Meta.http_path : /.well-known/acme-challenge/FMuukC2JOJ5HKmLBujjE_BkDo
	|		├ create evt.Meta.http_verb : GET
	|		├ create evt.Meta.source_ip : 5.5.8.5
	├ s02-enrich
	|	├ 🟢 crowdsecurity/dateparse-enrich (+2 ~2)
	|		├ create evt.Enriched.MarshaledTime : 2020-01-04T07:25:02Z
	|		├ update evt.Time : 2023-07-21 14:05:09.678072613 +0000 UTC -> 2020-01-04 07:25:02 +0000 UTC
	|		├ update evt.MarshaledTime :  -> 2020-01-04T07:25:02Z
	|		├ create evt.Meta.timestamp : 2020-01-04T07:25:02Z
	|	├ 🟢 crowdsecurity/geoip-enrich (+13)
	|		├ create evt.Enriched.ASNumber : 6805
	|		├ create evt.Enriched.Latitude : 51.299300
	|		├ create evt.Enriched.SourceRange : 5.4.0.0/14
	|		├ create evt.Enriched.ASNOrg : Telefonica Germany
	|		├ create evt.Enriched.IsInEU : true
	|		├ create evt.Enriched.IsoCode : DE
	|		├ create evt.Enriched.Longitude : 9.491000
	|		├ create evt.Enriched.ASNNumber : 6805
	|		├ create evt.Meta.ASNOrg : Telefonica Germany
	|		├ create evt.Meta.IsInEU : true
	|		├ create evt.Meta.IsoCode : DE
	|		├ create evt.Meta.ASNNumber : 6805
	|		├ create evt.Meta.SourceRange : 5.4.0.0/14
	|	├ 🟢 crowdsecurity/http-logs (+7)
	|		├ create evt.Parsed.impact_completion : false
	|		├ create evt.Parsed.file_ext : 
	|		├ create evt.Parsed.file_frag : FMuukC2JOJ5HKmLBujjE_BkDo
	|		├ create evt.Parsed.file_name : FMuukC2JOJ5HKmLBujjE_BkDo
	|		├ create evt.Parsed.static_ressource : false
	|		├ create evt.Parsed.file_dir : /.well-known/acme-challenge/
	|		├ create evt.Meta.http_args_len : 0
	|	└ 🟢 crowdsecurity/whitelists (unchanged)
	├-------- parser success 🟢
	├ Scenarios
		├ 🟢 crowdsecurity/http-crawl-non_statics
		└ 🟢 crowdsecurity/http-probing
```
You can see what data can be used from `s01-parse` stage.
</details>

