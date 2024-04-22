---
id: database
title: Databases
sidebar_position: 2
---

By default, the CrowdSec Local API use `SQLite` as backend storage. In case you expect a lot of traffic on your Local API, you should use `MySQL`, `MariaDB` or `PostgreSQL`.

For `SQLite`, there is nothing to do to make it work with CrowdSec. For `MySQL`, `MariaDB` and `PostgreSQL` , you need to create a database and an user.

Please refer to [ent.](https://entgo.io/) [supported database](https://entgo.io/docs/dialects/). At the time of writing :

 - MySQL `5.6.35`, `5.7.26` and `8`
 - MariaDB `10.2` and latest
 - PostgreSQL `10`, `11` and `12`
 - SQLite
 - Gremlin


:::warning

When switching an existing instance of CrowdSec to a new database backend, you need to register your machine(s) (ie. `cscli machines add -a`) and bouncer(s) to the new database, as data is not migrated.

:::

## MySQL and MariaDB

Connect to your `MySQL` or `MariaDB` server and run the following commands:

```
mysql> CREATE DATABASE crowdsec;
mysql> CREATE USER 'crowdsec'@'%' IDENTIFIED BY '<password>';
mysql> GRANT ALL PRIVILEGES ON crowdsec.* TO 'crowdsec'@'%';
mysql> FLUSH PRIVILEGES;
```

Then edit `/etc/crowdsec/config.yaml` to update the [`db_config`](/configuration/crowdsec_configuration.md#db_config) part.

You can now start or restart CrowdSec.

## PostgreSQL

Connect to your `PostgreSQL` server and run the following commands:

```
postgres=# CREATE DATABASE crowdsec;
postgres=# CREATE USER crowdsec WITH PASSWORD '<password>';
postgres=# ALTER SCHEMA public owner to crowdsec;
postgres=# GRANT ALL PRIVILEGES ON DATABASE crowdsec TO crowdsec;
```

Then edit `/etc/crowdsec/config.yaml` to update the [`db_config`](/configuration/crowdsec_configuration.md#db_config) part.

You can now start or restart CrowdSec.
