---
id: create_rules
title: Create Rules
sidebar_position: 3
---

## Hub Test

### Requirements

In order to run the hubtest for the AppSec, a Web Server with a remediation component supporting the AppSec feature must be running.
You can do this easily by starting the provided Docker:

```
docker-compose -f docker/appsec/docker-compose.yaml up -d
```

About testing the AppSec Rules, `hubtest` uses [`Nuclei`](https://github.com/projectdiscovery/nuclei) to emulate the exploit and then to validate that the AppSec has blocked the request.

So we need to [install the Nuclei tool](https://github.com/projectdiscovery/nuclei?tab=readme-ov-file#install-nuclei) in order to run `hubtest` for AppSec:

`go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest`

We are now ready to run `hubtest` for AppSec rules!

:::info

CrowdSec need to be installed on the machine where you run the tests, and your working directory must be the [`hub` repository](https://github.com/crowdsecurity/hub).

:::

### Run the tests

Create the test:

```
cscli hubtest create --appsec <TEST RULE NAME>

  Test name                   :  <TEST_NAME>
  Test path                   :  .appsec-tests/<TEST_NAME>
  Config File                 :  .appsec-tests/<TEST_NAME>/config.yaml
  Nuclei Template             :  .appsec-tests/<TEST_NAME>/<TEST_NAME>.yaml
```

This will create a new test folder in `.appsec-tests/<TEST_NAME>/`

- Edit the configuration file with the path of the appsec rule (the path of the Nuclei template will already be filled):

```yaml title=".appsec-tests/<TEST_NAME>/config.yaml"
appsec-rules:
  - ./appsec-rules/crowdsecurity/<APPSEC_RULE_FILE_NAME>
nuclei_template: <NUCLEI_FILE>
```

- Edit the Nuclei template (TODO: change this template with the CVE to use in this doc):

```yaml title=".appsec-tests/<TEST_NAME>/<TEST_NAME>.yaml"
id: <CVE_ID>
info:
  name: <CVE_ID>
  author: crowdsec
  severity: info
  description: <CVE_ID> testing
  tags: appsec-testing
http:
  #this is a dummy request, edit the request(s) to match your needs
  - raw:
      - |
        GET /wp-admin/admin-ajax.php?action=duplicator_download&file=..%2F..%2F..%2F..%2F..%2Fetc%2Fpasswd HTTP/1.1
        Host: {{Hostname}}
    cookie-reuse: true
    matchers:
      - type: status
        status:
          - 403
```

This Nuclei template will be used by `hubtest` to check that the Application Security Component has blocked the request.

Here are the minimal field to keep in the Nuclei template:

- `id`: ID of the Nuclei template
- `info` : only the `name`/`author`/`description`/`tags` are enough
- `http.raw`: Nuclei can provide multiple HTTP request for a CVE, but we are interested only with the ones that will trigger our `appsec` rule.
- `http.matchers`: This one should always be a `status` equal to `403`. Since the application security component return a `403` when an appsec rule is triggered, we can check directly by running this Nuclei template if the Application Security Component has blocked the attack or not.

We can now run our test:

```console
cscli hubtest run <TEST_NAME> --appsec

─────────────────────────
 Test             Result
─────────────────────────
 <TEST_NAME>        ✅
─────────────────────────
```

### Debug HubTest

This section provides a step-by-step guide to troubleshoot issues in failing AppSec Hubtests.

Follow these steps for effective identification and resolution of problems.

#### Inspecting target logs

To understand the failure reasons, it is important to check the logs of the remediation component. Sometimes, issues might be due to network problems between the remediation component and AppSec.

If you are using the Docker setup we provided before, you can access these logs easily with this command:

```bash
docker logs -f appsec_target_1
```

#### Inspecting runtime logs

In case of a test failure, do not delete the `.appsec-tests/<test_name>/runtime/` folder.

Rather, inspect the files inside the `.appsec-tests/<test_name>/runtime/` folder:

- `<test_name>-<timestamp>_[stderr|stdout].txt`: These files have the output from the nuclei command. They show the response of the request, which may suggest that the request was not blocked.
- `log/crowdsec.log`: This log file is from the crowdsec that was started by `cscli hubtest`. Here, you might find errors related to CrowdSec, like problems starting or loading the AppSec Component.
