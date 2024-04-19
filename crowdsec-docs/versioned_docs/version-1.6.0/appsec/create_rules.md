---
id: create_rules
title: Create Rules
sidebar_position: 3
---

## Foreword

This documentation assumes you're trying to create an AppSec rules with the intent of submitting to the hub, and thus creating the associated functional testing. The creation of said functional testing will guide our process and will make it easier.

We're going to create a rule for an imaginary vulnerability: [a shell injection in the user_id parameter](https://nvd.nist.gov/vuln/detail/CVE-2022-46169) that can be triggered because [the `x-foobar-bypass` header confuses the application](https://nvd.nist.gov/vuln/detail/CVE-2023-22515).

The exploit looks like this:
`curl localhost -H "x-foobar-bypass: 1" -d "user_id=123;cat /etc/password&do=yes"`

And results in a HTTP request looking like this:

```
POST / HTTP/1.1
...
x-foobar-bypass: 1
Content-Length: 36
Content-Type: application/x-www-form-urlencoded

user_id=123;cat /etc/password&do=yes
```

## Pre-requisites

1. [Create a local test environment](https://doc.crowdsec.net/docs/contributing/contributing_test_env) or have crowdsec (>= 1.5.6) installed locally
2. Have docker installed locally to run the test web server
3. Have [nuclei installed](https://docs.projectdiscovery.io/tools/nuclei/install) (`go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest`)
4. Clone the hub

```bash
git clone https://github.com/crowdsecurity/hub.git
```

## Create our test

From the root of the hub repository:

```bash
▶ cscli hubtest create my-vuln --appsec

  Test name                   :  my-vuln
  Test path                   :  /home/bui/github/crowdsec/hub/.appsec-tests/my-vuln
  Config File                 :  /home/bui/github/crowdsec/hub/.appsec-tests/my-vuln/config.yaml
  Nuclei Template             :  /home/bui/github/crowdsec/hub/.appsec-tests/my-vuln/my-vuln.yaml

```

If you are creating a virtual-patching rule, please name your test `CVE-YYYY-XYZ` and your rule `vpatch-CVE-YYYY-XYZ`.

## Configure our test

Let's incorporate our AppSec rule into the configuration file.

> .appsec-tests/my-vuln/config.yaml

```yaml
appsec-rules:
  - ./appsec-rules/crowdsecurity/my-vuln.yaml
nuclei_template: my-vuln.yaml
```

_note:_ Since our custom AppSec rule has not been added to the hub yet, we need to define its path relative to the root of the hub directory.

The `hubtest create` command created a boilerplate nuclei template that we can edit to add our HTTP request:

> .appsec-tests/my-vuln/my-vuln.yaml

```yaml
id: my-vuln
info:
  name: my-vuln
  author: crowdsec
  severity: info
  description: my-vuln testing
  tags: appsec-testing
http:
  #this is a dummy request, edit the request(s) to match your needs
  - raw:
      - |
        POST / HTTP/1.1
        Host: {{Hostname}}
        x-foobar-bypass: 1
        Content-Length: 36
        Content-Type: application/x-www-form-urlencoded

        user_id=123;cat /etc/password&do=yes
    cookie-reuse: true
    #test will fail because we won't match http status
    matchers:
      - type: status
        status:
          - 403
```

A few notes about [the nuclei template](https://docs.projectdiscovery.io/templates/introduction):

- The template expects to get a `403` from the server. It's how `hubtest` can tell if the request was caught.
- To capture the HTTP request, running your exploit against a `nc` running locally can be useful:

`curl localhost:4245 -H "x-foobar-bypass: 1" -d "user_id=123;cat /etc/password&do=yes"`

```bash
▶ nc -lvp 4245
Listening on 0.0.0.0 4245
Connection received on localhost 50408
POST / HTTP/1.1
Host: localhost:4245
User-Agent: curl/7.68.0
Accept: */*
x-foobar-bypass: 1
Content-Length: 36
Content-Type: application/x-www-form-urlencoded

user_id=123;cat /etc/password&do=yes

```

## Rule creation

Let's now create our AppSec rule:

> appsec-rules/crowdsecurity/my-vuln.yaml

```yaml
name: crowdsecurity/my-vuln
description: "Imaginary RCE (CVE-YYYY-XYZ)"
rules:
  - and:
      - zones:
          - METHOD
        match:
          type: equals
          value: POST
      - zones:
          - HEADERS_NAMES
        transform:
          - lowercase
        match:
          type: equals
          value: x-foobar-bypass
      - zones:
          - BODY_ARGS
        variables:
          - user_id
        match:
          type: regex
          value: "[^a-zA-Z0-9_]"
labels:
  type: exploit
  service: http
  confidence: 3
  spoofable: 0
  behavior: "http:exploit"
  label: "Citrix RCE"
  classification:
    - cve.CVE-YYYY-XYZ
    - attack.T1595
    - attack.T1190
    - cwe.CWE-284
```

Let's get over the relevant parts:

- `name` is how the alert will appear to users (in `cscli` or [the console](http://app.crowdsec.net))
- `description` is how your scenario will appear in [the hub](https://hub.crowdsec.net)
- `labels` section is used both in [the hub](https://hub.crowdsec.net) and [the console](https://app.crowdsec.net). [It must follow rules described here](/scenarios/format.md#labels)
- `rules` describe what we want to match:
  - a [`METHOD`](/appsec/rules_syntax.md#target) [equal to `POST`](/appsec/rules_syntax.md#match)
  - the presence of a header ([`HEADERS_NAME`](/appsec/rules_syntax.md#target)) with a name that once transformed to `lowercase`, is `x-foobar-bypass`
  - a post parameter (`BODY_ARGS`), `user_id` that contains something else than a-z A-Z or 0-9 or `_`

:::info
You can [find detailed rules syntax here](/appsec/rules_syntax.md).
:::

## Testing

We now have the needed pieces:

- a nuclei template that simulates exploitation
- an AppSec rule to detect the vulnerability exploitation
- a test that ties both together, ensuring our rule detects our exploit

To run our test, we're going to use the provided docker-compose file. It starts an nginx server (listening on port `7822`), that will be used as a "target" for our exploitation attempt. The nginx service is configured to interact with the ephemeral crowdsec service started by `hubtest`:

> from the root of the hub repository

```bash
docker-compose -f docker/appsec/docker-compose.yaml up -d
```

Depending on how you installed `nuclei`, be sure to add it to your `$PATH`:

```bash
PATH=~/go/bin/:$PATH
```

We're now ready to go!

```bash
▶ cscli hubtest run my-vuln --appsec
INFO[2023-12-21 16:43:28] Running test 'my-vuln'
INFO[2023-12-21 16:43:30] Appsec test my-vuln succeeded
INFO[2023-12-21 16:43:30] Test 'my-vuln' passed successfully (0 assertions)
──────────────────
 Test      Result
──────────────────
 my-vuln   ✅
──────────────────

```

Congrats to you, you are now ready to make your contribution available to the crowd! Head [to our github repository, and open a PR](https://github.com/crowdsecurity/hub) (including the tests).

## Troubleshooting your tests

Things didn't work as intended?

### Startup errors

If your test doesn't work, chances are that something prevented it to run.

1. nuclei isn't in the standard PATH

You will see an error message such as: `ERRO[2023-12-21 16:43:16] Appsec test my-vuln failed:  exec: "nuclei": executable file not found in $PATH`.

2. your nuclei template isn't valid

```
WARN[2023-12-21 16:50:33] Error running nuclei: exit status 1
WARN[2023-12-21 16:50:33] Stdout saved to /.../my-vuln-1703173832_stdout.txt
WARN[2023-12-21 16:50:33] Stderr saved to /.../my-vuln-1703173832_stderr.txt
WARN[2023-12-21 16:50:33] Nuclei generated output saved to /.../my-vuln-1703173832.json
```

note that you can always run your nuclei template "manually" to debug it: `nuclei -t path/to/my-vuln.yaml -u target`

3. your AppSec rule isn't valid

You will see crowdsec fataling at startup:

```
time="2023-12-21 15:42:10" level=info msg="loading inband rule crowdsecurity/*" component=appsec_config name=appsec-test type=appsec
time="2023-12-21 15:42:10" level=error msg="unable to convert rule crowdsecurity/my-vuln : unknown zone 'BODY'" component=appsec_collection_loader name=appsec-test type=appsec
time="2023-12-21 15:42:10" level=fatal msg="crowdsec init: while loading acquisition config: while configuring datasource of type AppSec fro...
```

### Inspecting runtime logs

In case of a test failure, do not delete the `.appsec-tests/<test_name>/runtime/` folder.

Rather, inspect the files inside the `.appsec-tests/<test_name>/runtime/` folder:

- `<test_name>-<timestamp>_[stderr|stdout].txt`: These files have the output from the nuclei command. They show the response of the request, which may suggest that the request was not blocked.
- `log/crowdsec.log`: This log file is from the crowdsec that was started by `cscli hubtest`. Here, you might find errors related to CrowdSec, like problems starting or loading the AppSec Component.
