---
id: create
title: Create Rules
sidebar_position: 6
---

## Hub Test

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
