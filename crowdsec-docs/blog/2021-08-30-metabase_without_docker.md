---
slug: metabase_without_docker
title: How to configure metabase dasbhoard without docker
author: Crowdsec Team
author_url: https://github.com/crowdsecurity
tags: [dashboard, metabase]
---

<!--truncate-->


`cscli dashboard` rely on [`docker`](https://docs.docker.com/) to launch the `metabase` image. If `docker` is not installed on your machine, here are the step to follow to get crowdsec dashboards without docker:

- Download Metabase `jar` file. See [metabase documentation](https://www.metabase.com/docs/latest/operations-guide/running-the-metabase-jar-file.html).
- Download the `metabase.db` folder from Crowdsec [here](https://crowdsec-statics-assets.s3-eu-west-1.amazonaws.com/metabase_sqlite.zip).
- Unzip the `zip` file: 

```bash
unzip metabase_sqlite.zip
```

- Make crowdsec database reachable from metabase :

```bash
sudo mkdir /metabase-data/
sudo ln -s /var/lib/crowdsec/data/crowdsec.db /metabase-data/crowdsec.db
```

- Launch Metabase: 

```bash
sudo MB_DB_TYPE=h2 MB_DB_FILE=<absolute-path>/metabase.db/metabase.db java -jar metabase.jar
```

:::caution

The default username is `crowdsec@crowdsec.net` and the default password is `!!Cr0wdS3c_M3t4b4s3??`. Please update the password when you will connect to metabase for the first time

:::

You can as well check [liberodark's helper script for it](https://github.com/liberodark/crowdsec-dashboard).