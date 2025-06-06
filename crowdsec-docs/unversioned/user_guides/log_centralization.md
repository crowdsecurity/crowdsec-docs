---
id: log_centralization
title: Log Centralization
sidebar_position: 10
---

## Introduction

If you expose services on the internet from multiple servers, setting up crowdsec on all of them might make the overall setup more complex.

To simplify things, you can use a central server to receive all your logs and only run a single instance of crowdsec on this server.

In this guide, our goal is to centralize two types of logs:
 - Nginx logs
 - SSH auth logs

We'll configure nginx to forward the access logs to our central rsyslog server.<br/>
We'll configure a local rsyslog for the auth logs on each web server and forward them to our central server.

On the central server, a rsyslog server will receive those logs and write them into files.<br/>
The Security Engine will analyze those logs on this same server to detect malicious behaviours.<br/>
Finally, we will have a Firewall Remediation Component running on each web server to block the malicious IPs.


Our infrastructure will look like this:

![target-infra](/img/user_guide_log_centralization.svg)

Before diving into the setup, a few key points:
 - If you have a firewall, you will need to allow communication on 514/UDP (Syslog) and 8080/TCP (crowdsec LAPI) from the web servers to the central server
 - By default, rsyslog is a clear-text protocol. If all the machines interact over LAN, this is probably not an issue, but if they communicate over the internet, you will probably want to set up TLS on the syslog server.

## Rsyslog Server Setup

Let's start by setting up our central rsyslog.

If rsyslog is not installed, you can install it with `apt install rsyslog` (assuming a debian-like distribution).

The first step is to configure rsyslog with a UDP listener and a template to write the received logs to disk.

Create the file `/etc/rsyslog.d/10_remote.conf` with the following content:
```
# Load the UDP receiver
module(load="imudp")
input(type="imudp" port="514")

# Create a template for the logs
template(name="NginxLogs" type="string" string="/var/log/remote-logs/nginx/%HOSTNAME%.log")
template(name="AuthLogs" type="string" string="/var/log/remote-logs/auth/%HOSTNAME%.log")

# Rsyslog will write both access logs and error logs to the same file
# You can split them by using a custom program name on the nginx side
if ($inputname == 'imudp' and $programname == 'nginx') then ?NginxLogs
& stop

# Write SSH logs to auth.log
if ($inputname == 'imudp' and $programname == 'sshd') then ?AuthLogs
& stop

# Drop everything else; we are not interested in them
if ($inputname == 'imudp') then stop
```

Then, we need to create the `/var/log/remote-logs/` to store logs:
```bash
$ sudo mkdir /var/log/remote-logs/ && sudo chown syslog:syslog /var/log/remote-logs/
```

You will also need to edit `/etc/rsyslog.conf` to make sure `$RepeatedMsgReduction` is set to `off` (some distributions set it to `on` by default, but this is rarely recommended, especially when consuming potentially a high volume of logs)

Finally, restart rsyslog to use the new configuration:
```bash
systemctl restart rsyslog
```

We will also set up Logrotate to avoid filling our disk with the logs. Create a file `/etc/logrotate.d/remote-logs` with the following content:
```
/var/log/remote-logs/*/*.log {
    daily
    rotate 7
    compress
    missingok
    notifempty
    create 0640 syslog adm
    sharedscripts
    postrotate
        /bin/systemctl reload rsyslog.service > /dev/null 2>&1 || true
    endscript
}
```

This configuration will keep 7 days of compressed logs. 

## Rsyslog Client Setup

### Nginx logs

Update your nginx configuration to send the access and error logs over syslog to our central server:
```
access_log syslog:server=<central-server-ip>;
error_log syslog:server=<central-server-ip>;
```

As nginx supports multiple `access_log` and `error_log` directives, you can keep the existing directives to keep a local copy of the logs. 

### Auth logs

Create a file `/etc/rsyslog.d/99-auth-forward.conf` with the following content:
```
auth,authpriv.* @<central-server-ip>:514
```

Restart the rsyslog client:
```bash
$ systemctl restart rsyslog
```

## CrowdSec Setup

### Central Server

Back on the central server, let's install crowdsec.

First, we need to add the crowdsec repository:
```bash
$ curl https://install.crowdsec.net | sudo bash
```

Next, we install crowdsec:
```bash
$ sudo apt install crowdsec
```

CrowdSec will automatically detect we are running on a Linux server and install the base Linux collection.

But because our logs are not in a standard location, we need to configure the acquisition to tell crowdsec where our logs are.

Create a file in `/etc/crowdsec/acquis.d/nginx.yaml` with the following content:
```
filenames:
 - /var/log/remote-logs/nginx/*.log
labels:
 type: syslog
```

Repeat for auth logs, create a file `/etc/crowdsec/acquis.d/ssh.yaml` with the following content:
```
filenames:
 - /var/log/remote-logs/auth/*.log
labels:
 type: syslog
```

Note that we are setting the type label to `syslog`, instructing crowdsec to use the `syslog` parser to extract the actual type from the log itself.

Then, we need to install the nginx collection for crowdsec to be able to detect attacks:
```bash
$ sudo cscli collections install crowdsecurity/nginx
```

Lastly, we will also need to make crowdsec on all interfaces to make sure our web servers can contact LAPI.<br/>
Edit the file `/etc/crowdsec/config.yaml`, and set `api.server.listen_uri` to `0.0.0.0:8080`:
```yaml
api:
  server:
    listen_uri: 0.0.0.0:8080
```

Finally, restart crowdsec:
```bash
$ sudo systemctl restart crowdsec
```

### Remediation components setup

CrowdSec, by itself, will only detect bad behaviors and make decisions about IPs; it will not block them.

To block an IP, you need to install a [remediation component](/unversioned/bouncers/intro.md).

For this guide, we'll be using the [firewall remediation component](/unversioned/bouncers/firewall.mdx) that will add local firewall rules to block malicious IPs.

On your web servers, add the crowdsec repository:
```bash
$  curl https://install.crowdsec.net/ | bash
```

Then, install the firewall remediation component:
```bash
$ sudo apt install crowdsec-firewall-bouncer-nftables
```

We now need to create API keys for both our remediation components.
On the central server, run the commands:
```bash
$ sudo cscli bouncers add fw-bouncer-web-1
API key for 'fw-bouncer-web-1':

   v3G2V//B4IAEFUkON3zWq5yz331UGZDQlQercn3n5T8

Please keep this key since you will not be able to retrieve it!
$ sudo cscli bouncers add fw-bouncer-web-2
API key for 'fw-bouncer-web-2':

   Nda9MreJsUBt/EEmz3TI0Jr6p1a9U2XSx5CEeVfkNRw

Please keep this key since you will not be able to retrieve it!
```

Now, on each web server, edit the file `/etc/crowdsec/bouncers/crowdsec-firewall-bouncer.yaml` and update the `api_url` options with the IP on the central server, and paste the API key in `api_key`:

```yaml
api_url: http://<central-server-ip>:8080/
api_key: <API_KEY>
```

Finally, restart the remediation component:
```bash
$ sudo systemctl restart crowdsec-firewall-bouncer
```

## Test

Now that everything is setup, it's time to test !

We'll scan one of our web servers, and because both of them are querying the same crowdsec instance if one detects the attack, the other server will also block the attacker.

```bash
$ nikto -h 52.50.157.217
```

After the scan is done, try to access the two servers with curl:

```bash
$ curl --connect-timeout 2 52.50.157.217
curl: (28) Connection timed out after 2002 milliseconds
$ curl --connect-timeout 2 3.254.76.247
curl: (28) Connection timed out after 2002 milliseconds
```

You can also check on the central server that everything is working correctly:

```bash
$ sudo cscli metrics
───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ Acquisition Metrics                                                                                                                           │
├─────────────────────────────────────────────────────┬────────────┬──────────────┬────────────────┬────────────────────────┬───────────────────┤
│ Source                                              │ Lines read │ Lines parsed │ Lines unparsed │ Lines poured to bucket │ Lines whitelisted │
├─────────────────────────────────────────────────────┼────────────┼──────────────┼────────────────┼────────────────────────┼───────────────────┤
│ file:/var/log/remote-logs/ip-172-31-11-52/auth.log  │ 5          │ -            │ 5              │ -                      │ -                 │
│ file:/var/log/remote-logs/ip-172-31-11-52/nginx.log │ 1          │ 1            │ -              │ 1                      │ -                 │
│ file:/var/log/remote-logs/ip-172-31-3-141/auth.log  │ 3          │ -            │ 3              │ -                      │ -                 │
│ file:/var/log/remote-logs/ip-172-31-3-141/nginx.log │ 99         │ 99           │ -              │ 195                    │ -                 │
│ file:/var/log/syslog                                │ 3          │ -            │ 3              │ -                      │ -                 │
╰─────────────────────────────────────────────────────┴────────────┴──────────────┴────────────────┴────────────────────────┴───────────────────╯
```

And view the current decisions:

```bash
$ sudo cscli decisions list
╭───────┬──────────┬──────────────────┬──────────────────────────────────────┬────────┬─────────┬────────────────┬────────┬────────────┬──────────╮
│   ID  │  Source  │    Scope:Value   │                Reason                │ Action │ Country │       AS       │ Events │ expiration │ Alert ID │
├───────┼──────────┼──────────────────┼──────────────────────────────────────┼────────┼─────────┼────────────────┼────────┼────────────┼──────────┤
│ 30011 │ crowdsec │ Ip:X.X.X.X │ crowdsecurity/http-crawl-non_statics │ ban    │ FR      │ 12322 Free SAS │ 43     │ 3h57m29s   │ 14       │
╰───────┴──────────┴──────────────────┴──────────────────────────────────────┴────────┴─────────┴────────────────┴────────┴────────────┴──────────╯
```

You can delete the decision with `cscli decision delete` to regain access to the web servers.