---
id: bouncers_configuration
title: Bouncers
sidebar_position: 1
---

CrowdSec is composed of different components that communicate via a Local API.
To access this API, the various components (CrowdSec agent, cscli and bouncers) need to be authenticated.

:::info

This documentation should be relevant mostly for administrators that would like to setup distributed architectures. Single machine setup users can likely skip this part.

:::

There are two kind of access to the local api :

 - `machines`: a login/password authentication used by cscli and CrowdSec, it allows to post, get and delete decisions and alerts.
 - `bouncers`: a token authentication used by bouncers to query the decisions, it only allows to get decisions.


## Bouncers authentication

:::caution

The `cscli bouncers` command interacts directly with the database (bouncers add and delete are not implemented in the API), therefore it must have the correct database configuration.

:::

```bash
sudo cscli bouncers list
```


You can view the registered bouncers with `list`, and add or delete them :

```bash
sudo cscli bouncers add mybouncersname
Api key for 'mybouncersname':

   23........b5a0c

Please keep this key since will not be able to retrieve it!
sudo cscli bouncers delete mybouncersname
```

The API key must be kept and given to the bouncer configuration.

<details>
  <summary>cscli bouncers example</summary>

```bash
sudo cscli bouncers add mybouncersname
Api key for 'mybouncersname':

   23........b5a0c

Please keep this key since will not be able to retrieve it!
sudo cscli bouncers list              
-----------------------------------------------------------------------------
 NAME            IP ADDRESS  VALID  LAST API PULL              TYPE  VERSION 
-----------------------------------------------------------------------------
 mybouncersname              ✔️     2020-11-01T11:45:05+01:00                
-----------------------------------------------------------------------------
sudo cscli bouncers add  jlkqweq
Api key for 'jlkqweq':

   a7........efdc9c

Please keep this key since will not be able to retrieve it!
sudo cscli bouncers delete mybouncersname
sudo cscli bouncers list                 
----------------------------------------------------------------------
 NAME     IP ADDRESS  VALID  LAST API PULL              TYPE  VERSION 
----------------------------------------------------------------------
 jlkqweq              ✔️     2020-11-01T11:49:32+01:00                
----------------------------------------------------------------------
```

</details>
