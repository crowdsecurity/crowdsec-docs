---
id: install_crowdsec_opnsense
title: OPNsense
sidebar_position: 1
---

# OPNsense plugin

The CrowdSec plugin for OPNsense is installed from the official repositories.
It includes a Log Processor, LAPI service, and Remediation Component. This allows you
to:

 - block attacking traffic from entering the network (protect machines that don't have CrowdSec)
 - deploy a log processor on OPNsense and scan its logs for attacks
 - use the OPNsense server as LAPI for other log processors and remediation components
 - list the hub plugins (parsers, scenarios..) and decisions on the OPNsense admin interface

## Plugin installation

Click `System > Firmware > Plugins` menu. Select os-crowdsec. It will deploy three packages:

 - `os-crowdsec`, the plugin itself
 - `crowdsec`
 - `crowdsec-firewall-bouncer`

Do not enable/start the services from the terminal like you would on a standard freebsd system, because the plugin takes care of that.

Refresh the page and go to `Services > CrowdSec > Overview` to verify the running services and installed configurations.

Great, you now have CrowdSec installed on your system. Have a look at the [post installation steps](/getting_started/next_steps.md) to see how to to configure and optimize it,
these recommendations are valid for any system.


## Plugin Configuration

You will find some options under `Services > CrowdSec > Settings`. You will see the first three are enabled by default: Log Processor (previously known as IDS), LAPI and Remediation Component (previously known as IPS).
You can disable them for testing or if you have special requirements.

The parsers, scenarios and all objects from the [CrowdSec Hub](https://hub.crowdsec.net/) are periodically upgraded. The [crowdsecurity/freebsd](https://hub.crowdsec.net/author/crowdsecurity/collections/freebsd) and [crowdsecurity/opnsense](https://hub.crowdsec.net/author/crowdsecurity/collections/opnsense) collections are installed by default.

Since crowdsec 1.6.3, private IP networks are whitelisted by default as well. This means for example an IP from a LAN or WAN which is on 192.168.x.y won't get blocked by a local decision
(community blocklists don't contain private IPs).

If you want to revert to the previous behavior, to block private IPs as well, you can remove the related parser.

```console
[root@OPNsense ~]# cscli parsers remove crowdsecurity/whitelists
```

If on the other hand you upgrade from a version before 1.6.3, you need to install the lists yourself.

## Testing the remediation component

A quick way to test that everything is working correctly is to execute the following command. Your ssh session should freeze and you should be kicked out from the firewall. You will not be able to connect to it (from the same IP address) for two minutes. It might be a good idea to have a secondary IP from which you can connect, should anything go wrong.

```console
[root@OPNsense ~]# cscli decisions add -t ban -d 2m -i <your_ip_address> # replace with your connecting IP address
```

This is a more secure way to test than attempting to brute-force yourself: the default ban period is 4 hours, and crowdsec reads the logs from the beginning, so it could ban you even if you failed ssh login 10 times in 30 seconds two hours before installing it.

You can find a list of all available flags with `cscli decisions add --help`.

### How do I find my connecting IP address to test?

We have provided some examples below to help you find your connecting IP address. Depending on your shell / environment, you may need to use a different command. 

```console
[root@OPNsense ~]# echo $SSH_CLIENT | awk '{print $1}'
[root@OPNsense ~]# w -h | awk '{print $3}' | sort -u
```

## Remote LAPI setup (optional)

If you don't want to run the LAPI service on the OPNsense machine (because it's small/slow or you already have LAPI somewhere) then you'll have to manually tweak the configuration (thanks [Jarno Rankinen](https://github.com/0ranki)).

Be aware: the list of machines and bouncers shown in the Overview tab will be incorrect. In the current version, the crowdsec instance on OPNsense has no way (and no permission) to retrieve the list of machines and bouncers from the LAPI if it resides on another server, so it displays the local (and outdated) information.

The following steps assume you already have set up a central LAPI server that is reachable by the OPNsense instance. You will also need SSH access with root permissions to both OPNsense and LAPI server.

 - On the LAPI server, edit `config.yaml` (`/usr/local/etc/crowdsec/` on FreeBSD, `/etc/crowdsec/` on Linux).

   If `api.server.listen_uri` is localhost, you need to change it to something reachable by OPNsense, for example `192.168.122.214:8080`. Update `local_api_credentials.yaml` too, but with the http:// this time: `http://192.168.122.214:8080`.
   Restart CrowdSec.

 - In the Settings tab, unselect `Enable LAPI` and select `Manual LAPI configuration`. Ignore the other two LAPI options (they are the url and port to use when listening, not where to connect). Click Apply.

 - Register the opnsense machine to the LAPI server:

   ```console
   [root@OPNsense ~]# cscli lapi register -u http://192.168.122.214:8080
   ```

   On the LAPI server, run

   ```console
   [root@lapi-server ~]# cscli machines list
   ---------------------------------------------------------------------------------------------------...
   NAME                                              IP ADDRESS       LAST UPDATE           STATUS   ...
   ---------------------------------------------------------------------------------------------------...
   be689d27c623aa393d1c8604eda5d1b47a62526b2e2e0201  192.168.122.214  2022-07-05T14:15:36Z  ✔️        v1.3.4...
   97f403614b44aa27d60c1ff8adb93d6fae8f9d9697e1a98c  192.168.122.246  2022-07-05T14:21:43Z  🚫       ...
   ---------------------------------------------------------------------------------------------------...
   [root@lapi-server ~]# cscli machines validate 97f403614b44aa27d60c1ff8adb93d6fae8f9d9697e1a98c
   INFO[05-07-2022 04:34:54 PM] machine 'edb8a102b4d54bdba9d5c70e5b4e766dqJvFTxnYsk8gyMsG' validated successfully
   ```

 - Add the bouncer:

   ```console
   [root@lapi-server ~]# cscli bouncers add opnsense
   Api key for 'opnsense':

           a8605055a065fd06b86ecac84e9e9ae4

   Please keep this key since you will not be able to retrieve it!
   ```

   You can use any other name instead of opnsense.

 - On the OPNsense machine, edit `/usr/local/etc/crowdsec/bouncers/crowdsec-firewall-bouncer.yaml`.
   Fill the `api_key` and `api_url` fields. Then restart both services, either with `service oscrowdsec restart`
   or by clicking `Apply` again in the Settings tab.

For more information on the topic:

 - How to set up a CrowdSec multi-server installation ([tutorial on crowdsec.net](https://www.crowdsec.net/blog/multi-server-setup) or [Linux Journal](https://www.linuxjournal.com/content/how-set-crowdsec-multi-server-installation))

 - [Improve The CrowdSec Multi-Server Installation With HTTPS Between Agents](https://www.linuxjournal.com/content/improve-crowdsec-multi-server-installation-https-between-agents) (Linux Journal)

