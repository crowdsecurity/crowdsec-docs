---
id: create
title: Creating parsers
sidebar_position: 4
---

import AcademyPromo from '@site/src/components/AcademyPromo';

## Foreword

This documentation assumes you're trying to create a parser for crowdsec with the intent of submitting to the hub, and thus create the associated functional testing.
The creation of said functional testing will guide our process and will make it easier.

We're going to create a parser for the imaginary service "myservice" that produce three types of logs via syslog :

```
Dec  8 06:28:43 mymachine myservice[2806]: bad password for user 'toto' from '1.2.3.4'
Dec  8 06:28:43 mymachine myservice[2806]: unknown user 'toto' from '1.2.3.4'
Dec  8 06:28:43 mymachine myservice[2806]: accepted connection for user 'toto' from '1.2.3.4'
```

As we are going to parse those logs to further detect bruteforce and user-enumeration attacks, we're simply going to "discard" the last type of logs.

There's a [yaml schema
available](https://github.com/crowdsecurity/crowdsec-yaml-schemas/blob/main/parser_schema.yaml)
for the parser and linked at
[SchemaStore](https://github.com/SchemaStore/schemastore/blob/master/src/api/json/catalog.json)
for general public availability inside most common editors. You will
be able see if the parser comply to the schema directly in your
editor, and you will have some kind of syntax highlighting and
suggestions. The only requirement for this is to write your parser
using the directory structure of the hub to make the editor detects
that the file has to comply to the yaml schema. This means that you
will have to write the parser in one subdirectory of the
`parsers/s00-raw`, `parsers/s01-parse`, `parsers/s02-enrich`,
`postoverflows/s00-enrich`, `postoverflows/s01-whitelist`. This
subdirectory is named after your name, or your organization name. As
an example `parsers/s01-parse/crowdsecurity/sshd-logs.yaml` matches
this directory structure. Note that extension of the parser has to
`.yaml`.

There're also mouseover description available

![Possible integration](/img/parser_creation/mouseover.png)

Error detection when the file is not schema compliant

![Possible integration](/img/parser_creation/typo.png)

The error message can be useful when one wants to understand why the parser file isn't schema compliant

![Possible integration](/img/parser_creation/error_message.png)


## Pre-requisites


1. [Create a local test environment](https://doc.crowdsec.net/docs/contributing/contributing_test_env)

2. Clone the hub

```bash
git clone https://github.com/crowdsecurity/hub.git
```


## Create our test

From the root of the hub repository :

```bash
▶ cscli hubtest create myservice-logs --type syslog

  Test name                   :  myservice-logs
  Test path                   :  /home/dev/github/hub/.tests/myservice-logs
  Log file                    :  /home/dev/github/hub/.tests/myservice-logs/myservice-logs.log (please fill it with logs)
  Parser assertion file       :  /home/dev/github/hub/.tests/myservice-logs/parser.assert (please fill it with assertion)
  Scenario assertion file     :  /home/dev/github/hub/.tests/myservice-logs/scenario.assert (please fill it with assertion)
  Configuration File          :  /home/dev/github/hub/.tests/myservice-logs/config.yaml (please fill it with parsers, scenarios...)
```

## Configure our test


Let's add our parser to the test configuration (`.tests/myservice-logs/config.yaml`). He specify that we need syslog-logs parser (because myservice logs are shipped via syslog), and then our custom parser.

```yaml
parsers:
- crowdsecurity/syslog-logs
- ./parsers/s01-parse/crowdsecurity/myservice-logs.yaml
scenarios:
postoverflows:
log_file: myservice-logs.log
log_type: syslog
ignore_parsers: false

```

__note: as our custom parser isn't yet part of the hub, we specify its path relative to the root of the hub directory__


## Parser creation : skeleton

For the sake of the tutorial, let's create a very simple parser :

```yaml
filter: 1 == 1
debug: true
onsuccess: next_stage
name: crowdsecurity/myservice-logs
description: "Parse myservice logs"
grok:
#our grok pattern : capture .*
  pattern: ^%{DATA:some_data}$
#the field to which we apply the grok pattern : the log message itself
  apply_on: message
statics:
  - parsed: is_my_service
    value: yes
```

 - a [filter](/parsers/format.md#filter) : if the expression is `true`, the event will enter the parser, otherwise, it won't
 - a [onsuccess](/parsers/format.md#onsuccess) : defines what happens when the event was successfully parsed : shall we continue ? shall we move to next stage ? etc.
 - a `name` & a `description`
 - some [statics](/parsers/format.md#statics) that will modify the event
 - a `debug` flag that allows to enable local debugging information
 - a `grok` pattern to capture some data in logs


We can then "test" our parser like this :

```bash
▶ cscli hubtest run myservice-logs
INFO[01-10-2021 12:41:21 PM] Running test 'myservice-logs'                
WARN[01-10-2021 12:41:24 PM] Assert file '/home/dev/github/hub/.tests/myservice-logs/parser.assert' is empty, generating assertion: 

len(results) == 2
len(results["s00-raw"]["crowdsecurity/syslog-logs"]) == 3
results["s00-raw"]["crowdsecurity/syslog-logs"][0].Success == true
...
len(results["s01-parse"]["crowdsecurity/myservice-logs"]) == 3
results["s01-parse"]["crowdsecurity/myservice-logs"][0].Success == true
results["s01-parse"]["crowdsecurity/myservice-logs"][0].Evt.Parsed["program"] == "myservice"
results["s01-parse"]["crowdsecurity/myservice-logs"][0].Evt.Parsed["timestamp"] == "Dec  8 06:28:43"
results["s01-parse"]["crowdsecurity/myservice-logs"][0].Evt.Parsed["is_my_service"] == "yes"
results["s01-parse"]["crowdsecurity/myservice-logs"][0].Evt.Parsed["logsource"] == "syslog"
results["s01-parse"]["crowdsecurity/myservice-logs"][0].Evt.Parsed["message"] == "bad password for user 'toto' from '1.2.3.4'"
results["s01-parse"]["crowdsecurity/myservice-logs"][0].Evt.Parsed["some_data"] == "bad password for user 'toto' from '1.2.3.4'"
...


Please fill your assert file(s) for test 'myservice-logs', exiting

```

What happened here ? 
 - Our logs have been processed by syslog-logs parser and our custom parser
 - As we have no existing assertion(s), `cscli hubtest` kindly generated some for us

This mostly allows us to ensure that our logs have been processed by our parser, even if it's useless in its current state.
Further inspection can be seen with `cscli hubtest explain` :

```bash
▶ cscli hubtest explain myservice-logs
line: Dec  8 06:28:43 mymachine myservice[2806]: bad password for user 'toto' from '1.2.3.4'
	├ s00-raw
	|	└ 🟢 crowdsecurity/syslog-logs
	└ s01-parse
		└ 🟢 crowdsecurity/myservice-logs

line: Dec  8 06:28:43 mymachine myservice[2806]: unknown user 'toto' from '1.2.3.4'
	├ s00-raw
	|	└ 🟢 crowdsecurity/syslog-logs
	└ s01-parse
		└ 🟢 crowdsecurity/myservice-logs

line: Dec  8 06:28:43 mymachine myservice[2806]: accepted connection for user 'toto' from '1.2.3.4'
	├ s00-raw
	|	└ 🟢 crowdsecurity/syslog-logs
	└ s01-parse
		└ 🟢 crowdsecurity/myservice-logs

```

We can see that our log lines were successfully parsed by both syslog-logs and myservice-logs parsers.


## Parser creation : actual parser


Let's modify our parser, `./parsers/s01-parse/crowdsecurity/myservice-logs.yaml` :

```yaml
onsuccess: next_stage
filter: "evt.Parsed.program == 'myservice'"
name: crowdsecurity/myservice-logs
description: "Parse myservice logs"
#for clarity, we create our pattern syntax beforehand
pattern_syntax:
  MYSERVICE_BADPASSWORD: bad password for user '%{USERNAME:user}' from '%{IP:source_ip}' #[1]
  MYSERVICE_BADUSER: unknown user '%{USERNAME:user}' from '%{IP:source_ip}' #[1]
nodes:
#and we use them to parse our two type of logs
  - grok:
      name: "MYSERVICE_BADPASSWORD" #[2]
      apply_on: message
      statics:
        - meta: log_type #[3]
          value: myservice_failed_auth
        - meta: log_subtype
          value: myservice_bad_password
  - grok:
      name: "MYSERVICE_BADUSER" #[2]
      apply_on: message
      statics:
        - meta: log_type #[3]
          value: myservice_failed_auth
        - meta: log_subtype
          value: myservice_bad_user
statics:
    - meta: service #[3]
      value: myservice
    - meta: username
      expression: evt.Parsed.user
    - meta: source_ip #[1]
      expression: "evt.Parsed.source_ip"
```

Various changes have been made here :
 - We created to patterns to capture the two relevant type of log lines, Using an [online grok debugger](https://grokdebug.herokuapp.com/) or an [online regex debugger](https://www.debuggex.com/) [2]
)
 - We keep track of the username and the source_ip (Please note that setting the source_ip in `evt.Meta.source_ip` and `evt.Parsed.source_ip` is important [1])
 - We setup various [statics](/parsers/format.md#statics) information to classify the log type [3]



Let's run out tests again :

```bash {13-20}
▶ cscli hubtest run myservice-logs                    
INFO[01-10-2021 12:49:56 PM] Running test 'myservice-logs'                
WARN[01-10-2021 12:49:59 PM] Assert file '/home/dev/github/hub/.tests/myservice-logs/parser.assert' is empty, generating assertion: 

len(results) == 2
len(results["s00-raw"]["crowdsecurity/syslog-logs"]) == 3
results["s00-raw"]["crowdsecurity/syslog-logs"][0].Success == true
...
len(results["s01-parse"]["crowdsecurity/myservice-logs"]) == 3
results["s01-parse"]["crowdsecurity/myservice-logs"][0].Success == true
...
results["s01-parse"]["crowdsecurity/myservice-logs"][0].Evt.Parsed["timestamp"] == "Dec  8 06:28:43"
results["s01-parse"]["crowdsecurity/myservice-logs"][0].Evt.Parsed["program"] == "myservice"
results["s01-parse"]["crowdsecurity/myservice-logs"][0].Evt.Parsed["source_ip"] == "1.2.3.4"
results["s01-parse"]["crowdsecurity/myservice-logs"][0].Evt.Parsed["user"] == "toto"
results["s01-parse"]["crowdsecurity/myservice-logs"][0].Evt.Meta["log_subtype"] == "myservice_bad_password"
results["s01-parse"]["crowdsecurity/myservice-logs"][0].Evt.Meta["log_type"] == "myservice_failed_auth"
results["s01-parse"]["crowdsecurity/myservice-logs"][0].Evt.Meta["service"] == "myservice"
results["s01-parse"]["crowdsecurity/myservice-logs"][0].Evt.Meta["source_ip"] == "1.2.3.4"
results["s01-parse"]["crowdsecurity/myservice-logs"][0].Evt.Meta["username"] == "toto"
...
results["s01-parse"]["crowdsecurity/myservice-logs"][1].Evt.Meta["log_subtype"] == "myservice_bad_user"
results["s01-parse"]["crowdsecurity/myservice-logs"][2].Success == false


Please fill your assert file(s) for test 'myservice-logs', exiting

```

We can see that our parser captured all the relevant information, and it should be enough to create scenarios further down the line.

Again, further inspection with `cscli hubtest explain` will show us more about what happened :

```bash
▶ cscli hubtest explain myservice-logs
line: Dec  8 06:28:43 mymachine myservice[2806]: bad password for user 'toto' from '1.2.3.4'
	├ s00-raw
	|	└ 🟢 crowdsecurity/syslog-logs
	└ s01-parse
		└ 🟢 crowdsecurity/myservice-logs

line: Dec  8 06:28:43 mymachine myservice[2806]: unknown user 'toto' from '1.2.3.4'
	├ s00-raw
	|	└ 🟢 crowdsecurity/syslog-logs
	└ s01-parse
		└ 🟢 crowdsecurity/myservice-logs

line: Dec  8 06:28:43 mymachine myservice[2806]: accepted connection for user 'toto' from '1.2.3.4'
	├ s00-raw
	|	└ 🟢 crowdsecurity/syslog-logs
	└ s01-parse
		└ 🔴 crowdsecurity/myservice-logs
```

__note: we can see that our log line `accepted connection for user 'toto' from '1.2.3.4'` wasn't parsed by `crowdsecurity/myservice-logs` as we have no pattern for it__


## Closing word

We have now a fully functional parser for myservice logs !
We can either deploy it to our production systems to do stuff, or even better, contribute to the hub !

If you want to know more about directives and possibilities, take a look at [the parser reference documentation](/parsers/format.md) !

See as well [this blog article](https://crowdsec.net/blog/how-to-write-crowdsec-parsers-and-scenarios) on the topic.

<AcademyPromo
  image="parsers_and_scenarios.svg"
  description="Watch a short series of videos on how to create Parsers, as well as Scenarios"
  title="More ways to learn"
  course="writing-parsers-and-scenarios"
  utm="?utm_source=docs&utm_medium=banner&utm_campaign=parser-page&utm_id=academydocs"
/>