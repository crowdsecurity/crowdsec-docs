---
id: dashboard
title: Cscli dashboard
sidebar_position: 3
---

<!--TBD: to fix when we dealt with the new cscli dashboard command -->
:::warning "MySQL & PostgreSQL"
MySQL and PostgreSQL are currently not supported by `cscli dashboard`. 

It means that you can run cscli dashboard only if you use `SQLite` (default) as storage database with your local API.
:::


The cscli command `cscli dashboard setup` will use [docker](https://docs.docker.com/get-docker/) to install [metabase docker image](https://hub.docker.com/r/metabase/metabase/) and fetch our metabase template to have a configured and ready dashboard. 

:::tip
If you use `podman` instead of `docker` and want to install the crowdsec dashboard, you need to run:

    sudo ln -s /var/run/podman/podman.sock /var/run/docker.sock

Then you can setup the dashboard with `sudo cscli dashboard setup`.
:::

## Setup
> Setup and Start crowdsec metabase dashboard

```bash
sudo cscli dashboard setup
```

Optional arguments:

 - `-l` |`--listen` : ip address to listen on for docker (default is `127.0.0.1`)
 - `-p` |`--port` : port to listen on for docker (default is `8080`)
 - `--password` : password for metabase user (default is generated randomly)
 - `-f` | `--force` : override existing setup



<details>
  <summary>cscli dashboard setup</summary>

```bash
INFO[0000] Pulling docker image metabase/metabase       
...........
INFO[0002] creating container '/crowdsec-metabase'      
INFO[0002] Waiting for metabase API to be up (can take up to a minute) 
..............
INFO[0051] Metabase is ready                            

	URL       : 'http://127.0.0.1:3000'
	username  : 'crowdsec@crowdsec.net'
	password  : '<RANDOM_PASSWORD>'

```
</details>

:::tip
The `dashboard setup` command will output generated credentials for metabase.

Those are stored in `/etc/crowdsec/metabase/metabase.yaml`
:::

Now you can connect to your dashboard, sign-in with your saved credentials then click on {{v1X.crowdsec.Name}} Dashboard to get this:


Dashboard docker image can be managed by cscli and docker cli also. Look at the cscli help command using

```bash
sudo cscli dashboard -h
```

## Remove the dashboard
> Remove crowdsec metabase dashboard

```bash
sudo cscli dashboard remove [-f]
```
Optional arguments:

- `-f` | `--force` : will force remove the dashboard

## Stop the dashboard
> Stop crowdsec metabase dashboard

```bash
sudo cscli dashboard stop
```

## Start the dashboard
> Start crowdsec metabase dashboard

```bash
sudo cscli dashboard start
```

**Note:** Please look [at this documentation]({{TBD}}) for those of you that would like to deploy metabase without using docker.


