---
title: CrowdSec Configuration
id: crowdsec_configuration
---

# Crowdsec configuration

CrowdSec has a main `yaml` configuration file, usually located in `/etc/crowdsec/config.yaml`.

## Configuration example

You can find the default configurations on our GitHub repository:

[Linux default configuration](https://github.com/crowdsecurity/crowdsec/blob/master/config/config.yaml)

[Windows default configuration](https://github.com/crowdsecurity/crowdsec/blob/master/config/config_win.yaml)

## Common configuration directories & paths

### `/etc/crowdsec/`

All CrowdSec configuration are living in this directory.

### `/etc/crowdsec/config.yaml`

Main configuration file for Log Processor and Local API.

### `/etc/crowdsec/acquis.d` and `/etc/crowdsec/acquis.yaml`

Documents which log sources and datasources are processed by the Log Processor.

`/etc/crowdsec/acquis.yaml` is the historical acquisition configuration file.
`/etc/crowdsec/acquis.d/*.yaml` is prefered when possible.

### `/etc/crowdsec/bouncers/*.yaml`

Individual configuration file for bouncers.

### `/etc/crowdsec/collections/*.yaml`

Collections currently installed on the Log Processor.

### `/etc/crowdsec/console.yaml`

Console specific flags:
 - enable/disable decisions management from the console
 - enable/disable sharing of manual decisions with the console
 - enable/disable sharing of custom/tainted scenarios related decisions with the console
 - enable/disable sharing of alert context data with the console.

### `/etc/crowdsec/contexts/*.yaml`

Enabled alert context for Local API and Log Processor. This is where you should add custom data to be sent in alert context.

### `/etc/crowdsec/hub/`

Local Hub Mirror. Not intended to be modified by the user. Do not put custom scenarios/parsers here.

### `/etc/crowdsec/local_api_credentials.yaml` and `/etc/crowdsec/online_api_credentials.yaml`

Credentials for Local API and Central API.

### `/etc/crowdsec/parsers`

Contains all parsers enabled on the Log Processor, including local parsers, organised in stages:
 - `/etc/crowdsec/parsers/s00-raw/*.yaml` : parsers for based formats such as syslog.
 - `/etc/crowdsec/parsers/s01-parse/*.yaml` : service specific parsers such as nginx or ssh.
 - `/etc/crowdsec/parsers/s02-enrich/*.yaml` : enrichment parsers and whitelists.


### `/etc/crowdsec/scenarios`

Contains all scenarios enabled on the Log Processor, including local scenarios.

### `/etc/crowdsec/profiles.yaml`

Contains profiles used by Local API to eventually turn alerts into decisions or dispatch them to notification plugins.

### `/etc/crowdsec/notifications/*.yaml`

Contains notification plugins configuration (slack, email, splunk, etc.)

### `/etc/crowdsec/appsec-configs/*.yaml`

Contains AppSec (WAF) configuration indicating which rules or loaded in `inband` and `outofband` files, as well as eventual `hooks` configuration.

### `/etc/crowdsec/appsec-rules/*.yaml`

Contains individual AppSec (WAF) rules loaded by `appsec-configs` files.

## Environment variables

It is possible to set configuration values based on environment variables.

For example, if you don't want to store your database password in the configuration file, you can do this:

```yaml
db_config:
  type:     mysql
  user:     database_user
  password: ${DB_PASSWORD}
  db_name:  db_name
  host:     192.168.0.2
  port:     3306
```

And export the environment variable such as:

```bash
export DB_PASSWORD="<db_password>"
```

:::warning
**Note**: you need to be `root` or put the environment variable in `/etc/environment`
:::


If the variable is not defined, crowdsec >= 1.5.0 will leave the original
string. This is to allow for literal `$` characters, especially in passwords:
versions before 1.5.0 replaced a non-existent reference with an empty string
which corrupted the password and made it harder to find configuration mistakes.


## Overriding values

If you change `config.yaml` and later upgrade crowdsec, the package system may
ask if you want to replace the configuration with the version from the new
package, or leave the file with your changes untouched. This is usually not a
problem because new directives have default values, but they won't appear in
your configuration file until you manually merge them in. On some OSes
(like freebsd) the package system just writes a `config.yaml.sample` with the
new values if there has been any change to `config.yaml`.

It can also be easier, while automating deployments, to write local
configuration changes to a separate file instead of parsing and rewriting
`config.yaml`.

For all these reasons, you can write your local settings in
`config.yaml.local`, which follows the same format and has the same options as
`config.yaml`. Values defined in `config.yaml.local` will take precedence.
Mappings are merged, sequences are replaced. You can use the environment
variable substitution, explained above, in both files.

Example:

```yaml title="/etc/crowdsec/config.yaml.local"
common:
  log_level: debug
api:
  server:
    trusted_ips:
     - 192.168.100.0/24
```

:::info
**Note:** you cannot remove configuration keys from a `.local` file, only
change them (possibly with an empty or default value). So for example, removing
`db_config.db_path` is not possible, even if you don't use it. And you cannot
remove a whole mapping (like `api.server`). Sequences on the other hand, are
always replaced.
:::

### Configuration files that support `.yaml.local`:

- `config.yaml`
- `local_api_credentials.yaml`
- `simulation.yaml`
- `bouncers/crowdsec-firewall-bouncer.yaml`
- `bouncers/crowdsec-custom-bouncer.yaml`
- `bouncers/crowdsec-blocklist-mirror.yaml`

In the case of `profiles.yaml`, the files are read as a whole (as if they were
attached) instead of merged. See [profiles - introduction](/local_api/profiles/intro.md).


## Configuration directives

```yaml title="/etc/crowdsec/config.yaml"
common:
  daemonize: "(true|false)"
  pid_dir: "<path_to_pid_folder>"
  log_media: "(file|stdout)"
  log_level: "(error|info|debug|trace)"
  log_dir: "<path_to_log_folder>"
  working_dir: "<path_to_working_folder>"
  log_max_size: <max_size_of_log_file>
  log_max_age: <max_age_of_log_file>
  log_max_files: <number_of_log_files_to_keep>
  compress_logs: (true|false)
  log_format: "(text|json)"
config_paths:
  config_dir: "<path_to_crowdsec_config_folder>"
  data_dir: "<path_to_crowdsec_data_folder>"
  simulation_path: "<path_to_simulation_file>"
  hub_dir: "<path_to_crowdsec_hub_folder>"
  index_path: "<path_to_hub_index_file>"
  notification_dir: "<path_to_notification_config_folder>"
  plugin_dir: "<path_to_notification_binaries_folder>"
crowdsec_service:
  enable: <true|false>  ## enable or disable crowdsec agent
  acquisition_path: "<acqusition_file_path>"
  acquisition_dir: "<acquisition_dir_path>"
  console_context_path: <path_to_context_file>
  parser_routines: "<number_of_parser_routines>"
  buckets_routines: "<number_of_buckets_routines>"
  output_routines: "<number_of_output_routines>"
plugin_config:
  user: "<user_to_run_plugin_process_as>"
  group: "<group_to_run_plugin_process_as>"
cscli:
  output: "(human|json|raw)"
  hub_branch: "<hub_branch>"
db_config:
  type:     "<db_type>"
  db_path:  "<path_to_database_file|path_to_socket_file>" #Socket file mysql or mariadb
  user:     "<db_user>"      # for mysql/pgsql
  password: "<db_password>"  # for mysql/pgsql
  db_name:  "<db_name>"      # for mysql/pgsql
  host:     "<db_host_ip>"   # for mysql/pgsql
  port:     "<db_host_port>" # for mysql/pgsql
  sslmode:  "<require/disable>" # for pgsql
  ssl_ca_cert: "<path_to_ca_cert_file>" # for mysql/pgsql
  ssl_client_cert: "<path_to_client_cert_file>" # for mysql/pgsql
  ssl_client_key: "<path_to_client_key_file>" # for mysql/pgsql
  use_wal:  "true|false" # for sqlite
  max_open_conns: "<max_number_of_conns_to_db>"
  flush:
    max_items: "<max_alerts_in_db>"
    max_age: "<max_age_of_alerts_in_db>"
    metrics_max_age: "<max_age_metrics_in_db>"
    bouncers_autodelete:
      cert: "<max_duration_since_last_pull>"
      api_key: "<max_duration_since_last_pull>"
    agents_autodelete:
      cert: "<max_duration_since_last_push>"
      login_password: "<max_duration_since_last_push>"
api:
  cti:
    key: "<api_cti_key>"
    cache_timeout: "60m"
    cache_size: 50
    enabled: "(true|false)"
    log_level: "(info|debug|trace)"
  client:
    insecure_skip_verify: "(true|false)"
    credentials_path: "<path_to_local_api_client_credential_file>"
    unregister_on_exit: "(true|false)"
  server:
    enable: <true|false> # enable or disable local API
    log_level: "(error|info|debug|trace>")"
    listen_uri: "<listen_uri>" # host:port
    profiles_path: "<path_to_profile_file>"
    use_forwarded_for_headers: "<true|false>"
    console_path: <path_to_console_file>
    online_client:
      sharing: "(true|false)"
      pull:
        community: "(true|false)"
        blocklists: "(true|false)"
      credentials_path: "<path_to_crowdsec_api_client_credential_file>"
    disable_remote_lapi_registration: (true|false)
    capi_whitelists_path: "<path_to_capi_whitelists_file>"
    tls:
      cert_file: "<path_to_certificat_file>"
      key_file: "<path_to_certificat_key_file>"
      client_verification: "NoClientCert|RequestClientCert|RequireAnyClientCert|VerifyClientCertIfGiven|RequireAndVerifyClientCert"
      ca_cert_path: "<path_to_ca_cert_file>"
      agents_allowed_ou: # List of allowed Organisational Unit for the agents
       - agents_ou
      bouncers_allowed_ou: # List of allowed Organisational Unit for the bouncers
       - bouncers_ou
      crl_path: "<path_to_crl_file>"
      cache_expiration: "<cache_duration_for_revocation_check>"
    trusted_ips: # IPs or IP ranges which should have admin API access
      #- 127.0.0.1
      #- ::1
      #- 10.0.0.0/24
    auto_registration:
      enabled: <true|false>
      token: <string>
      allowed_ranges:
        - 10.0.0.0/24
prometheus:
  enabled: "(true|false)"
  level: "(full|aggregated)"
  listen_addr: "<listen_address>"
  listen_port: "<listen_port>"
```

### `common`

```yaml
common:
  daemonize: "(true|false)"
  pid_dir: "<path_to_pid_folder>"
  log_media: "(file|stdout)"
  log_level: "(error|info|debug|trace)"
  log_dir: "<path_to_log_folder>"
  working_dir: "<path_to_working_folder>"
  log_max_size: <max_size_of_log_file>
  log_max_age: <max_age_of_log_file>
  log_max_files: <number_of_log_files_to_keep>
  compress_logs: (true|false)
  log_format: "(text|json)"
```

#### `daemonize`
> bool

Daemonize or not the crowdsec daemon.

#### `pid_dir`
> string

Folder to store PID file.

#### `log_media`
> string

Log media. Can be `stdout` or `file`.

#### `log_level`
> string

Log level. Can be `error`, `info`, `debug`, `trace`.

#### `log_folder`
> string

Folder to write log file.

:::warning
Works only with `log_media = file`.
:::

#### `working_dir`
> string

Current working directory.

#### `log_max_size`
> int

Maximum size in megabytes of the log file before it gets rotated. Defaults to 500 megabytes.

#### `log_max_age`
> int

Maximum number of days to retain old log files based on the timestamp encoded in their filename.  Note that a day is defined as 24 hours and may not exactly correspond to calendar days due to daylight savings, leap seconds, etc. The default is to remove old log files after 28 days.

#### `log_max_files`
> int

Maximum number of old log files to retain.  The default is to retain 3 old log files (though MaxAge may still cause them to get deleted.)

#### `compress_logs`
> bool

Whether to compress the log file after rotation or not.

#### `log_format`
> string

Format of crowdsec log. Can be `text` (default) or `json`

### `config_paths`

This section contains most paths to various sub configuration items.


```yaml
config_paths:
  config_dir: "<path_to_crowdsec_config_folder>"
  data_dir: "<path_to_crowdsec_data_folder>"
  simulation_path: "<path_to_simulation_file>"
  hub_dir: "<path_to_crowdsec_hub_folder>"
  index_path: "<path_to_hub_index_file>"
  notification_dir: "<path_to_notification_config_folder>"
  plugin_dir: "<path_to_notification_binaries_folder>"
  pattern_dir: "<path_to_patterns_folder>"
```

#### `config_dir`
> string

Main configuration directory of crowdsec.

#### `data_dir`
> string

This is where crowdsec is going to store data, such as files downloaded by scenarios, geolocalisation database, metabase configuration database, or even SQLite database.

#### `simulation_path`
> string

Path to the simulation configuration.

#### `hub_dir`
> string

Directory where `cscli` will store parsers, scenarios, collections and such.

#### `index_path`
> string

Path to the `.index.json` file downloaded by `cscli` to know the list of available configurations.

#### `plugin_dir`
> string
Path to directory where the plugin binaries/scripts are located. 

**Note:** binaries must be root-owned and non-world writable, and binaries/scripts must be named like `<plugin_type>-<plugin_subtype>` eg "notification-slack"

#### `notification_dir`
> string
Path to directory where configuration files for `notification` plugins are kept.

Each notification plugin is expected to have its own configuration file.

#### `pattern_dir`
> string

Path to directory where pattern files are located. Can be omitted from configuration and CrowdSec will use the `config_dir` + `patterns/` as default.


### `crowdsec_service`

This section is only used by crowdsec agent.


```yaml
crowdsec_service:
  enable: <true|false>
  acquisition_path: "<acqusition_file_path>"
  acquisition_dir: "<acqusition_dir_path>"
  console_context_path: <path_to_context_file>
  parser_routines: "<number_of_parser_routines>"
  buckets_routines: "<number_of_buckets_routines>"
  output_routines: "<number_of_output_routines>"
```

#### `enable`
> bool

Enable or disable the CrowdSec Agent (`true` by default).

#### `parser_routines`
> int

Number of dedicated goroutines for parsing files.

#### `buckets_routines`
> int

Number of dedicated goroutines for managing live buckets.

#### `output_routines`
> int

Number of dedicated goroutines for pushing data to local api.

#### `console_context_path`
> string

Path to the yaml file containing the context to send to the local API.

#### `acquisition_path`
> string

Path to the yaml file containing logs that needs to be read.

#### `acquisition_dir`
> string

(>1.0.7) Path to a directory where each yaml is considered as a acquisition configuration file containing logs that needs to be read.
If both `acquisition_dir` and `acquisition_path` are specified, the entries are merged alltogether.


### `cscli`

This section is only used by `cscli`.

```yaml
cscli:
  output: "(human|json|raw)"
  hub_branch: "<hub_branch>"
  prometheus_uri: "<uri>"
```

#### `output`
> string

The default output format (human, json or raw).

#### `hub_branch`
> string

The git branch on which `cscli` is going to fetch configurations.

#### `prometheus_uri`
> uri

(>1.0.7) An uri (without the trailing `/metrics`) that will be used by `cscli metrics` command, ie. `http://127.0.0.1:6060/`


### `plugin_config`

#### `user`
> string

The owner of the plugin process. If set to an empty string, the plugin process
will run as the same user as crowdsec. Both user and group must be either set
or unset.

#### `group`
> string

The group of the plugin process. If set to an empty string, the plugin process
will run in the same group as crowdsec. Both user and group must be either set
or unset.

### `db_config`

The configuration of the database to use for the local API.

```yaml
db_config:
  type:     "<db_type>"

  db_path:  "<path_to_database_file|path_to_socket_file>"  # database path for sqlite or socket file for mysql/pgx
  use_wal:  "true|false" # for sqlite

  user:     "<db_user>"      # for mysql/postgresql/pgx
  password: "<db_password>"  # for mysql/postgresql/pgx
  db_name:  "<db_name>"      # for mysql/postgresql/pgx
  host:     "<db_host_ip>"   # for mysql/postgresql/pgx # must be omitted if using socket file
  port:     "<db_host_port>" # for mysql/postgresql/pgx # must be omitted if using socket file
  sslmode:  "<require/disable>" # for postgresql/pgx
  ssl_ca_cert: "<path_to_ca_cert_file>" # for mysql/pgsql
  ssl_client_cert: "<path_to_client_cert_file>" # for mysql/pgsql
  ssl_client_key: "<path_to_client_key_file>" # for mysql/pgsql
  max_open_conns: "<max_number_of_conns_to_db>"
  decision_bulk_size: "<decision_bulk_size>"
  flush:
    max_items: "<max_alerts_in_db>"
    max_age: "<max_age_of_alerts_in_db>"
    metrics_max_age: "<max_age_metrics_in_db>"
    bouncers_autodelete:
      cert: "<max_duration_since_last_pull>"
      api_key: "<max_duration_since_last_pull>"
    agents_autodelete:
      cert: "<max_duration_since_last_push>"
      login_password: "<max_duration_since_last_push>"
```

#### `type`

```yaml
db_config:
  type: sqlite
```

The `type` of database to use. It can be:

- `sqlite`
- `mysql`
- `postgresql`
- `pgx`

#### `db_path`

```yaml
db_config:
  type: sqlite
  db_path: /var/lib/crowdsec/data/crowdsec.db
---
db_config:
  type: mysql
  db_path: /var/run/mysqld/mysqld.sock
---
db_config:
  type: pgx
  db_path: /var/run/postgresql/ #Folder that holds socket file. Socket MUST be the named `.s.PGSQL.5432`
```

The path to the database file (only if the type of database is `sqlite`) or path to socket file (only if the type of database is `mysql|pgx`)

#### `user`

```yaml
db_config:
  type: mysql|postgresql|pgx

  user: foo
```
The username to connect to the database (only if the type of database is `mysql` or `postgresql`)

#### `password`

```yaml
db_config:
  type: mysql|postgresql|pgx

  password: foobar
```
The password to connect to the database (only if the type of database is `mysql` or `postgresql`)

#### `db_name`

```yaml
db_config:
  type: mysql|postgresql|pgx

  db_name: crowdsec
```
The database name to connect to (only if the type of database is `mysql` or `postgresql`)

#### `host`

```yaml
db_config:
  type: mysql|postgresql|pgx

  host: foo
```
The host to connect to (only if the type of database is `mysql` or `postgresql`). Must be omitted if using socket file.

#### `port`

```yaml
db_config:
  type: mysql|postgresql|pgx

  port: 3306|5432|5432
```
The port to connect to (only if the type of database is `mysql` or `postgresql`). Must be omitted if using socket file.


#### `sslmode`

```yaml
db_config:
  type: postgresql

  sslmode: require
```
Require or disable ssl connection to database (only if the type of database is `mysql` or `postgresql` or `pgx`).

See [PostgreSQL SSL modes](https://www.postgresql.org/docs/current/libpq-ssl.html#LIBPQ-SSL-SSLMODE-STATEMENTS) for possible values.
See [MySQL SSL modes](https://dev.mysql.com/doc/refman/8.0/en/using-encrypted-connections.html) for possible values within the `Client-Side` configuration.

#### `ssl_ca_cert`

```yaml
db_config:
  type: mysql|postgresql|pgx

  ssl_ca_cert: /path/to/ca.crt
```
Path to the CA certificate file (only if the type of database is `mysql` or `postgresql` or `pgx`)

#### `ssl_client_cert`

```yaml
db_config:
  type: mysql|postgresql|pgx

  ssl_client_cert: /path/to/client.crt
```
Path to the client certificate file when using mTLS (only if the type of database is `mysql` or `postgresql` or `pgx`)

#### `ssl_client_key`

```yaml
db_config:
  type: mysql|postgresql|pgx

  ssl_client_key: /path/to/client.key
```
Path to the client key file when using mTLS (only if the type of database is `mysql` or `postgresql` or `pgx`)

#### `max_open_conns`

```yaml
db_config:
  type: mysql|postgresql|pgx|sqlite
  max_open_conns: 100
```
Maximum number of open connections to the database.

Defaults to 100. Set to 0 for unlimited connections.


#### `decision_bulk_size`

```yaml
db_config:
  decision_bulk_size: 1000
```
Maximum number of decisions inserted or updated in a single query.

Added in v1.5.3.

This can affect the responsiveness of the system. If you use big blocklists
on devices like raspberry or similar appliances with slow disks, you can
raise this up to 2000. Higher values will still be interpreted as 2000
due to query size limits.

#### `use_wal`

```yaml
db_config:
  type: sqlite
  use_wal: true
```
[SQLite Write-Ahead Logging](https://www.sqlite.org/wal.html) is an option allowing more concurrency in SQLite that will improve performances in most scenarios.

When WAL is unspecified you will see the following warning message at startup :


> You are using sqlite without WAL, this can have an impact of performance. If you do not store the database in a network share, set db_config.use_wal to true. Set explicitly to false to disable this warning.

#### `flush`

```yaml
flush:
  max_items: <nb_max_alerts_in_database>
  max_age: <max_alerts_age_in_database>
  metrics_max_age: <max_metrics_age_in_database>
  bouncers_autodelete:
    cert: "<max_duration_since_last_pull>"
    api_key: "<max_duration_since_last_pull>"
  agents_autodelete:
    cert: "<max_duration_since_last_push>"
    login_password: "<max_duration_since_last_push>"
```

#### `max_items`
> int

Number max of alerts in database.

#### `max_age`
> string

Alerts retention time.

Supported units:

 - `s`: seconds

 - `m`: minutes

 - `h`: hours

 - `d`: days

#### `metrics_max_age`
> string

Usage metrics retention time.

Supported units:

 - `s`: seconds

 - `m`: minutes

 - `h`: hours

 - `d`: days

#### `bouncers_autodelete`

##### `cert`

Bouncers authenticated using TLS certificate will be deleted after `duration` without any requests.

Supported units are the same as for `max_age`

##### `api_key`

Bouncers authenticated using API key auth will be deleted after `duration` without any requests.

Supported units are the same as for `max_age`

#### `agents_autodelete`

##### `cert`

Agents authenticated using TLS certificate will be deleted after `duration` without any requests and if there is no active alerts for them.

Supported units are the same as for `max_age`


##### `login_password`

Agents authenticated using login/password will be deleted after `duration` without any requests and if there is no active alerts for them.

Supported units are the same as for `max_age`


### `api`

The api section is used by both `cscli`, `crowdsec` and the local API.

```yaml
api:
  cti:
    key: "<api_cti_key>"
    cache_timeout: "60m"
    cache_size: 50
    enabled: "(true|false)"
    log_level: "(info|debug|trace)"
  client:
    insecure_skip_verify: "(true|false)"
    credentials_path: "<path_to_local_api_client_credential_file>"
    unregister_on_exit: "(true|false)"
  server:
    enable: <true|false>
    log_level: "(error|info|debug|trace>"
    listen_uri: "<listen_uri>" # host:port
    profiles_path: "<path_to_profile_file>"
    use_forwarded_for_headers: "(true|false)"
    console_path: <path_to_console_file>
    online_client:
      sharing: "(true|false)"
      pull:
        community: "(true|false)"
        blocklists: "(true|false)"
      credentials_path: "<path_to_crowdsec_api_client_credential_file>"
    disable_remote_lapi_registration: (true|false)
    capi_whitelists_path: "<path_to_capi_whitelists_file>"
    tls:
      cert_file: "<path_to_certificat_file>"
      key_file: "<path_to_certificat_key_file>"
      client_verification: "NoClientCert|RequestClientCert|RequireAnyClientCert|VerifyClientCertIfGiven|RequireAndVerifyClientCert"
      ca_cert_path: "<path_to_ca_cert_file>"
      agents_allowed_ou: # List of allowed Organisational Unit for the agents
       - agents_ou
      bouncers_allowed_ou: # List of allowed Organisational Unit for the bouncers
       - bouncers_ou
      crl_path: "<path_to_crl_file>"
      cache_expiration: "<cache_duration_for_revocation_check>"
    auto_registration:
      enabled: <true|false>
      token: <string>
      allowed_ranges:
       - 10.0.0.0/24 
```

#### `cti`

The cti subsection is used by `crowdsec` and `cscli` to query the CrowdSec CTI.

```yaml
cti:
  key: "<api_cti_key>"
  cache_timeout: "60m"
  cache_size: 50
  enabled: "(true|false)"
  log_level: "(info|debug|trace)"
```

##### `key`
>string

The API key to use to query the CTI. This key is generated via [console](https://app.crowdsec.net/)

##### `cache_timeout`
>string

The duration to cache the CTI API response.

Supported units:

 - `s`: seconds

 - `m`: minutes

 - `h`: hours

 - `d`: days

##### `cache_size`
>int

The number of CTI API responses to cache.

##### `enabled`
>bool

Whether to enable the CTI integration.

##### `log_level`
>string

The log level for the CTI integration.

#### `client`

The client subsection is used by `crowdsec` and `cscli` to read and write decisions to the local API.

```yaml
client:
  insecure_skip_verify: "(true|false)"
  credentials_path: "<path_to_local_api_client_credential_file>"
  unregister_on_exit: "(true|false)"
```

##### `insecure_skip_verify`
>bool

Allows the use of https with self-signed certificates.

##### `credentials_path`
>string

Path to the credential files (contains API url + login/password).

##### `unregister_on_exit`
>bool

If set to `true`, the log processor will remove delete itself from LAPI when stopping.

Intended for use in dynamic environment such as Kubernetes.

#### `server`

The `server` subsection is the local API configuration.

```yaml
server:
  enable: <true|false>
  log_level: (error|info|debug|trace)
  listen_uri: <listen_uri> # host:port
  profiles_path: <path_to_profile_file>
  use_forwarded_for_headers: (true|false)
  trusted_ips: # IPs or IP ranges which should have admin API access
    #- 127.0.0.1
    #- ::1
    #- 10.0.0.0/24
  console_path: <path_to_console_file>
  online_client:
    sharing: "(true|false)"
    pull:
      community: "(true|false)"
      blocklists: "(true|false)"
    credentials_path: <path_to_crowdsec_api_client_credential_file>
  disable_remote_lapi_registration: (true|false)
  capi_whitelists_path: "<path_to_capi_whitelists_file>"
  tls:
    cert_file: <path_to_certificat_file>
    key_file: <path_to_certificat_key_file>
    client_verification: "NoClientCert|RequestClientCert|RequireAnyClientCert|VerifyClientCertIfGiven|RequestAndVerifyClientCert"
      ca_cert_path: "<path_to_ca_cert_file>"
      agents_allowed_ou: # List of allowed Organisational Unit for the agents
       - agents_ou
      bouncers_allowed_ou: # List of allowed Organisational Unit for the bouncers
       - bouncers_ou
      crl_path: "<path_to_crl_file>"
      cache_expiration: "<cache_duration_for_revocation_check>"
  auto_registration:
    enabled: <true|false>
    token: <string>
    allowed_ranges:
      - 10.0.0.0/24
```

##### `enable`
> bool

Enable or disable the CrowdSec Local API (`true` by default).

##### `listen_uri`
> string

Address and port listen configuration, the form `host:port`.

##### `profiles_path`
> string

The path to the profiles configuration.

##### `console_path`
> string

The path to the console configuration.

#### `disable_remote_lapi_registration`
> bool

This option will disable the registration of remote agents using `cscli lapi register` command. As by default the local API registration will create a machine in the database (not validated), this option will prevent the creation of a machine in the database.

##### `capi_whitelists_path`
> string

:::warning

This option is deprecated.
You should use [centralized allowlists](local_api/allowlists.md) instead.

:::

The path to whitelists file for community and 3rd party blocklists.
Those IPs/CIDR whitelists apply on all the IPs received from community blocklist or 3rd party lists subscriptions.

expected file format:

```yaml
ips:
 - 1.2.3.4
 - 2.3.4.5
cidrs:
 - 1.2.3.0/24
```

##### `use_forwarded_for_headers`
> bool

Allow the usage of `X-Forwarded-For` or `X-Real-IP` to get the client IP address. Do not enable if you are not running the LAPI behind a trusted reverse-proxy or LB.

##### `online_client`

Configuration to push signals and receive bad IPs from Crowdsec API.

```yaml
online_client:
  sharing: "(true|false)"
  pull:
    community: "(true|false)"
    blocklists: "(true|false)"
  credentials_path: "<path_to_crowdsec_api_client_credential_file>"
```

###### `sharing`
> bool

Whether you want to share signals with Central API, please note as outlined in the [Community blocklists](central_api/blocklist.md) section, enabling or disabling based on your plan type will affect how many IP's are downloaded from the community blocklists.

###### `pull`

```yaml
pull:
  community: "(true|false)"
  blocklists: "(true|false)"
```

###### `community`
> bool

Whether to pull signals from the community blocklists. Useful when you want to share your signals with the community but don't want to receive signals from the community.

###### `blocklists`
> bool

Whether to pull signals from the CrowdSec blocklists. Useful when you want to share your signals with the community but don't want to receive signals from 3rd party or first party blocklists.

###### `credentials_path`
> string

Path to a file containing credentials for the Central API.

##### `tls`

if present, holds paths to certs and key files.

```yaml
tls:
  cert_file: "<path_to_certificat_file>"
  key_file: "<path_to_certificat_key_file>"
  client_verification: "NoClientCert|RequestClientCert|RequireAnyClientCert|VerifyClientCertIfGiven|RequireAndVerifyClientCert"
  ca_cert_path: "<path_to_ca_cert_file>"
  agents_allowed_ou: # List of allowed Organisational Unit for the agents
    - agents_ou
  bouncers_allowed_ou: # List of allowed Organisational Unit for the bouncers
    - bouncers_ou
  crl_path: "<path_to_crl_file>"
  cache_expiration: "<cache_duration_for_revocation_check>"

```

###### `cert_file`
> string

Path to certificate file.

###### `key_file`
> string

Path to certficate key file.

###### `client_verification`

Whether LAPI should require or not a client certificate for authentication.

Supported values mirror the ones available in the [golang TLS library](https://pkg.go.dev/crypto/tls#ClientAuthType).

Default to `VerifyClientCertIfGiven` which will allow connection without certificate or require a valid client certificate if one is provided

:::warning

Crowdsec supports all `ClientAuthType` value from the go TLS library for sake of completness, but using any value other than `NoClientCert` (completly disable authentication with certificates), `VerifyClientCertIfGiven` (only use the certificate if provided) or `RequireAndVerifyClientCert` (only allows certificate authentication and disable password/API key auth) is insecure and must not be used.

:::

###### ca_cert_path

Path to the CA certificates used to sign the client private keys.

Only required if using TLS auth and if the system does not trust the CA.

If not set and if the system does not trust the CA, all TLS authenticated requests will fail.

###### agents_allowed_ou

List of Organizational Unit allowed for the agents.

If not set, no agents will be able to authenticate with TLS.

###### bouncers_allowed_ou

List of Organizational Unit allowed for the bouncers.

If not set, no bouncers will be able to authenticate with TLS.

###### crl_path

Path to the certificate revocation list of the CA.

Optional. If not set, only OCSP revocation check will be performed (only if the client certificate contains an OCSP URL).

##### cache_expiration

How log to cache the result of a revocation check.

Defaults to 1h.

The format must be compatible with golang [time.Duration](https://pkg.go.dev/time#ParseDuration)

##### `trusted_ips`
> list

IPs or IP ranges which have admin access to API. The APIs would still need to have API keys.
127.0.0.1 and ::1 are always given admin access whether specified or not.

#### `auto_registration`

This section configures LAPI to automatically accept new machine registrations

```yaml
auto_registration:
  enabled: <true|false>
  token: <string>
  allowed_ranges:
   - 10.0.0.0/24
```

##### `enabled`
> bool

Whether automatic registration should be enabled.

Defaults to `false`.

##### `token`
> string

Token that should be passed in the registration request if LAPI needs to automatically validate the machine.

It must be at least 32 chars, and is mandatory if the feature is enabled.

##### `allowed_ranges`
> []string

IP ranges that are allowed to use the auto registration features.

It must have at least one entry if the feature is enabled


### `prometheus`

This section is used by local API and crowdsec.

```yaml
prometheus:
  enabled: "(true|false)"
  level: "(full|aggregated)"
  listen_addr: "<listen_address>"
  listen_port: "<listen_port>"
```


#### `enabled`
> bool

Allows to enable/disable prometheus instrumentation.

#### `level`
> string

Can be `full` (all metrics) or `aggregated` (to allow minimal metrics that will keep cardinality low).

#### `listen_addr`
> string

Prometheus listen url.

#### `listen_port`
> int

Prometheus listen port.

