---
id: tls_auth
title: TLS Authentication
sidebar_position: 4
---

# TLS Authentication

## Overview

In addition to the standard login/password (for agents) or API key (for bouncers), crowdsec also supports TLS client authentication for both.

This allows you to bypass the requirement of generating a login/password or API keys before adding a new agent or bouncer to your setup. This is especially useful if you are using any kind of auto-scaling and agents or bouncers can appear at any time.

## Configuration

The TLS authentication is configured in the `api.server.tls` section of the configuration for LAPI and in `/etc/crowdsec/local_api_credentials.yaml` for the agents.

Please refer to the documentation of each bouncer to see how to configure them.

## Revocation checking

Crowdsec will perform both OCSP and CRL revocation check.

#### CRL check

You can provide a path to a CRL file to crowdsec for revocation checking.

The revocation check will be skipped if the CRL file is invalid or has expired.

If no CRL file is provided, the check will also be skipped.

The result of the check is kept in cache according to the `api.server.tls.cache_expiration` configuration.

The CRL file is read each time the check is performed, so you can update it with a cronjob without needing to reload crowdsec.

#### OCSP check

If the certificate contains an OCSP URL, crowdsec will make a query to the OCSP server to check for the revocation status.

The result of the check is kept in cache according to the `api.server.tls.cache_expiration` configuration.

If the OCSP server returns a malformed response, this check will be ignored.

## Example

### PKI creation

For this example, we will be creating our PKI with [cfssl](https://github.com/cloudflare/cfssl) directly on the machine where crowdsec is running. In production, you will want to use your existing PKI infrastructure for obvious security reasons.

For the sake of simplicity, we will be using the same CA for the server and client certificates (in production, you will likely use  differents CAs).

We will need some configuration files for cfssl.

First, we need to define some profiles for our cert in `profiles.json`:

```json
{
    "signing": {
      "default": {
        "expiry": "8760h"
      },
      "profiles": {
        "intermediate_ca": {
          "usages": [
              "signing",
              "digital signature",
              "key encipherment",
              "cert sign",
              "crl sign",
              "server auth",
              "client auth"
          ],
          "expiry": "8760h",
          "ca_constraint": {
              "is_ca": true,
              "max_path_len": 0, 
              "max_path_len_zero": true
          }
        },
        "server": {
          "usages": [
            "signing",
            "digital signing",
            "key encipherment",
            "server auth"
          ],
          "expiry": "8760h"
        },
        "client": {
          "usages": [
            "signing",
            "digital signature",
            "key encipherment", 
            "client auth"
          ],
          "expiry": "8760h"
        }
      }
    }
  }
```

Then, `ca.json` will define our CA:

```json
{
  "CN": "CrowdSec Test CA",
  "key": {
    "algo": "rsa",
    "size": 2048
  },
  "names": [
  {
    "C": "FR",
    "L": "Paris",
    "O": "Crowdsec",
    "OU": "Crowdsec",
    "ST": "France"
  }
 ]
}
```

Next, `intermediate.json` will define our intermediate cert:

```json
{
    "CN": "CrowdSec Test CA Intermediate",
    "key": {
      "algo": "rsa",
      "size": 2048
    },
    "names": [
    {
      "C": "FR",
      "L": "Paris",
      "O": "Crowdsec",
      "OU": "Crowdsec Intermediate",
      "ST": "France"
    }
   ],
   "ca": {
    "expiry": "42720h"
  }
  }
```

Our server side certificate is defined in `server.json`:

```json
{
    "CN": "localhost",
    "key": {
      "algo": "rsa",
      "size": 2048
    },
    "names": [
    {
      "C": "FR",
      "L": "Paris",
      "O": "Crowdsec",
      "OU": "Crowdsec Server",
      "ST": "France"
    }
    ],
    "hosts": [
      "127.0.0.1",
      "localhost"
    ]
  }
```

Lastly, we will define our bouncer certificate, `bouncer.json`:

```json
{
    "CN": "mybouncer",
    "key": {
      "algo": "rsa",
      "size": 2048
    },
    "names": [
    {
      "C": "FR",
      "L": "Paris",
      "O": "Crowdsec",
      "OU": "bouncer-ou",
      "ST": "France"
    }
    ]
  }
```

and `agent.json`:

```json
{
    "CN": "myagent",
    "key": {
      "algo": "rsa",
      "size": 2048
    },
    "names": [
    {
      "C": "FR",
      "L": "Paris",
      "O": "Crowdsec",
      "OU": "agent-ou",
      "ST": "France"
    }
    ]
  }
```

We can now create our CA and the certs:
```shell
#generate the CA
cfssl gencert --initca ./cfssl/ca.json 2>/dev/null | cfssljson --bare "/tmp/ca"
#Generate an intermediate certificate that will be used to sign the client certificates
cfssl gencert --initca ./cfssl/intermediate.json 2>/dev/null | cfssljson --bare "/tmp/inter"
cfssl sign -ca "/tmp/ca.pem" -ca-key "/tmp/ca-key.pem" -config ./cfssl/profiles.json -profile intermediate_ca "/tmp/inter.csr" 2>/dev/null | cfssljson --bare "/tmp/inter"
#Generate a server side certificate
cfssl gencert -ca "/tmp/inter.pem" -ca-key "/tmp/inter-key.pem" -config ./cfssl/profiles.json -profile=server ./cfssl/server.json 2>/dev/null | cfssljson --bare "/tmp/server"
#Generate a client certificate for the bouncer
cfssl gencert -ca "/tmp/inter.pem" -ca-key "/tmp/inter-key.pem" -config ./cfssl/profiles.json -profile=client ./cfssl/bouncer.json 2>/dev/null | cfssljson --bare "/tmp/bouncer"
#Generate a client certificate for the agent
cfssl gencert -ca "/tmp/inter.pem" -ca-key "/tmp/inter-key.pem" -config ./cfssl/profiles.json -profile=client ./cfssl/agent.json 2>/dev/null | cfssljson --bare "/tmp/agent"
```

### Configuration


We now need to update LAPI configuration to use our newly generated certificates by editing `/etc/crowdsec/config.yaml`:
```yaml
api:
 server:
   tls:
    cert_file: /tmp/server.pem #Server side cert
    key_file: /tmp/server-key.pem #Server side key
    ca_cert_path: /tmp/inter.pem #CA used to verify the client certs
    bouncers_allowed_ou: #OU allowed for bouncers
      - bouncer-ou
    agents_allowed_ou: #OU allowed for agents
      - agent-ou
```

We also need to update our agent configuration to use a certificate to login to LAPI in `/etc/crowdsec/local_api_credentials.yaml`:

```yaml
url: https://localhost:8081
ca_cert_path: /tmp/inter.pem #CA to trust the server certificate
key_path: /tmp/agent-key.pem #Client key
cert_path: /tmp/agent.pem #Client cert
```

### Using the certificates


Now when we restart crowdsec, we will see in the logs that a new agent was creating automatically:
```
INFO[26-04-2022 13:42:36] TLSAuth: no OCSP Server present in client certificate, skipping OCSP verification  component=tls-auth type=agent
WARN[26-04-2022 13:42:36] no crl_path, skipping CRL check               component=tls-auth type=agent
INFO[26-04-2022 13:42:36] client OU [agent-ou] is allowed vs required OU [agent-ou]  component=tls-auth type=agent
INFO[26-04-2022 13:42:36] machine myagent@127.0.0.1 not found, create it
INFO[26-04-2022 13:42:36] 127.0.0.1 - [Tue, 26 Apr 2022 13:42:36 CEST] "POST /v1/watchers/login HTTP/2.0 200 117.853833ms "crowdsec/v1.3.3-rc2-55-g0988e03a-darwin-0988e03ab8b77ad08874266cf623e71396a68c6c" "
INFO[26-04-2022 13:42:36] client OU [agent-ou] is allowed vs required OU [agent-ou]  component=tls-auth type=agent
INFO[26-04-2022 13:42:36] 127.0.0.1 - [Tue, 26 Apr 2022 13:42:36 CEST] "POST /v1/watchers/login HTTP/2.0 200 1.267458ms "crowdsec/v1.3.3-rc2-55-g0988e03a-darwin-0988e03ab8b77ad08874266cf623e71396a68c6c" "
```

We can see the agent with `cscli`:
```shell
$ cscli machines list
-------------------------------------------------------------------------------------------------------------------------------------------------
 NAME               IP ADDRESS  LAST UPDATE           STATUS  VERSION                                                                  AUTH TYPE
-------------------------------------------------------------------------------------------------------------------------------------------------
 myagent@127.0.0.1  127.0.0.1   2022-04-26T11:42:36Z  ✔️       v1.3.3-rc2-55-g0988e03a-darwin-0988e03ab8b77ad08874266cf623e71396a68c6c  tls
-------------------------------------------------------------------------------------------------------------------------------------------------
```

We see that the agent name was automatically derived from the certificate Common Name and agent IP address.

We can simulate a bouncer request using `curl`:

```shell
$ curl --cacert /tmp/inter.pem --cert /tmp/bouncer.pem --key /tmp/bouncer-key.pem https://localhost:8081/v1/decisions/stream?startup=true
{"deleted":[{"duration":"-18h13m35.223932s","id":38,"origin":"crowdsec","scenario":"crowdsecurity/http-cve-2021-41773","scope":"Ip","type":"ban","value":"23.94.26.138"}],"new":null}
```

Because this is the first time this "bouncer" makes a request to LAPI, a new bouncer will be automatically created in crowdsec database. As with the agent, the name of the bouncer is `CN@IP`:

```shell
$ cscli bouncers list
----------------------------------------------------------------------------------------
 NAME                 IP ADDRESS  VALID  LAST API PULL         TYPE  VERSION  AUTH TYPE
----------------------------------------------------------------------------------------
 mybouncer@127.0.0.1  127.0.0.1   ✔️      2022-04-26T11:45:25Z  curl  7.79.1   tls
----------------------------------------------------------------------------------------
```

If we try to use the agent certificate with our fake bouncer, LAPI with return an error as the OU is not allowed for the bouncers:

```shell
$ curl --cacert /tmp/inter.pem --cert /tmp/agent.pem --key /tmp/agent-key.pem https://localhost:8081/v1/decisions/stream\?startup\=true
{"message":"access forbidden"}
```

And in crowdsec logs:
```
ERRO[26-04-2022 13:47:58] invalid client certificate: client certificate OU ([agent-ou]) doesn't match expected OU ([bouncer-ou])  ip=127.0.0.1
```

Now, if we revoke the certificate used by the bouncer, crowdsec will reject any request made using this certificate:

```shell
#serials.txt contain the serial of the bouncer certificate
$ cfssl gencrl serials.txt /tmp/inter.pem /tmp/inter-key.pem | base64 -d | openssl crl -inform DER -out /tmp/crl.pem
```

Let's update crowdsec config to make use of our newly generated CRL:
```yaml
api:
 server:
  tls:
   crl_path: /tmp/crl.pem
```

Let's query the API again:
```shell
$ curl --cacert /tmp/inter.pem --cert /tmp/bouncer.pem --key /tmp/bouncer-key.pem https://localhost:8081/v1/decisions/stream\?startup\=true
{"message":"access forbidden"}
```

And we can see in crowdsec logs that the request was denied:
```
ERRO[26-04-2022 14:01:00] TLSAuth: error checking if client certificate is revoked: could not check for client certification revokation status: client certificate is revoked by CRL  component=tls-auth type=bouncer
ERRO[26-04-2022 14:01:00] invalid client certificate: could not check for client certification revokation status: could not check for client certification revokation status: client certificate is revoked by CRL  ip=127.0.0.1
```
