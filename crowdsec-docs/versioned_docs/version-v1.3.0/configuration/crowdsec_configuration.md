---
title: CrowdSec Configuration
id: crowdsec_configuration
---

# Crowdsec configuration

CrowdSec has a main `yaml` configuration file, usually located in `/etc/crowdsec/config.yaml`.

## Configuration example


<details>
  <summary>Default configuration</summary>

```yaml
common:
  daemonize: true
  pid_dir: /var/run/
  log_media: file
  log_level: info
  log_dir: /var/log/
  log_max_size: 500
  log_max_age: 28
  log_max_files: 3
  compress_logs: true
  working_dir: .
config_paths:
  config_dir: /etc/crowdsec/
  data_dir: /var/lib/crowdsec/data/
  simulation_path: /etc/crowdsec/simulation.yaml
  hub_dir: /etc/crowdsec/hub/
  index_path: /etc/crowdsec/hub/.index.json
  notification_dir: /etc/crowdsec/notifications/
  plugin_dir: /var/lib/crowdsec/plugins/
crowdsec_service:
  acquisition_path: /etc/crowdsec/acquis.yaml
  #acquisition_dir: /etc/crowdsec/acquis/
  parser_routines: 1
  buckets_routines: 1
  output_routines: 1
cscli:
  output: human
  hub_branch: wip_lapi
db_config:
  log_level: info
  type: sqlite
  db_path: /var/lib/crowdsec/data/crowdsec.db
  #user:
  #password:
  #db_name:
  #host:
  #port:
  flush:
    max_items: 5000
    max_age: 7d
api:
  client:
    insecure_skip_verify: false
    credentials_path: /etc/crowdsec/local_api_credentials.yaml
  server:
    log_level: info
    listen_uri: 127.0.0.1:8080
    profiles_path: /etc/crowdsec/profiles.yaml
    use_forwarded_for_headers: false
    console_path: /etc/crowdsec/console.yaml
    online_client: # Crowdsec API
      credentials_path: /etc/crowdsec/online_api_credentials.yaml
#    tls:
#      cert_file: /etc/crowdsec/ssl/cert.pem
#      key_file: /etc/crowdsec/ssl/key.pem
prometheus:
  enabled: true
  level: full
  listen_addr: 127.0.0.1
  listen_port: 6060
```

</details>

## Environment variable

It is possible to set a configuration value based on an enrivonement variables.

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
config_paths:
  config_dir: "<path_to_crowdsec_config_folder>"
  data_dir: "<path_to_crowdsec_data_folder>"
  simulation_path: "<path_to_simulation_file>"
  hub_dir: "<path_to_crowdsec_hub_folder>"
  index_path: "<path_to_hub_index_file>"
  notification_dir: "<path_to_notification_config_folder>"
  plugin_dir: "<path_to_notification_binaries_folder>"
crowdsec_service:
  acquisition_path: "<acqusition_file_path>"
  acquisition_dir: "<acquisition_dir_path>"
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
  db_path:  "<path_to_database_file>"
  user:     "<db_user>"      # for mysql/pgsql
  password: "<db_password>"  # for mysql/pgsql
  db_name:  "<db_name>"      # for mysql/pgsql
  host:     "<db_host_ip>"   # for mysql/pgsql
  port:     "<db_host_port>" # for mysql/pgsql
  sslmode:  "<required/disable>" # for pgsql
  flush:
    max_items: "<max_alerts_in_db>"
    max_age: "<max_age_of_alerts_in_db>"
api:
  client:
    insecure_skip_verify: "(true|false)"
    credentials_path: "<path_to_local_api_client_credential_file>"
  server:
    log_level: "(error|info|debug|trace>")"
    listen_uri: "<listen_uri>" # host:port
    profiles_path: "<path_to_profile_file>"
    use_forwarded_for_headers: "<true|false>"
    console_path: <path_to_console_file>
    online_client:
      credentials_path: "<path_to_crowdsec_api_client_credential_file>"
    tls:
      cert_file: "<path_to_certificat_file>"
      key_file: "<path_to_certificat_key_file>"
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

Maximum size the log file in MB before rotating it.

#### `log_max_age`
> int

Maximum age of previous log files before deleting them.

#### `log_max_files`
> int

Number of previous log files to keep.

#### `compress_logs`
> bool

Whether to compress the log file after rotation or not.

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


### `crowdsec_service`

This section is only used by crowdsec agent.


```yaml
crowdsec_service:
  acquisition_path: "<acqusition_file_path>"
  acquisition_dir: "<acqusition_dir_path>"
  parser_routines: "<number_of_parser_routines>"
  buckets_routines: "<number_of_buckets_routines>"
  output_routines: "<number_of_output_routines>"
```


#### `parser_routines`
> int

Number of dedicated goroutines for parsing files.

#### `buckets_routines`
> int

Number of dedicated goroutines for managing live buckets.

#### `output_routines`
> int

Number of dedicated goroutines for pushing data to local api.

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

The owner of the plugin process. 

#### `group`
> string

The group of the plugin process. 

### `db_config`

The configuration of the database to use for the local API.

```yaml
db_config:
  type:     "<db_type>"

  db_path:  "<path_to_database_file>"  # for sqlite

  user:     "<db_user>"      # for mysql/postgresql/pgx
  password: "<db_password>"  # for mysql/postgresql/pgx
  db_name:  "<db_name>"      # for mysql/postgresql/pgx
  host:     "<db_host_ip>"   # for mysql/postgresql/pgx
  port:     "<db_host_port>" # for mysql/postgresql/pgx
  sslmode:  "<required/disable>" # for postgresql/pgx
  flush:
    max_items: "<max_alerts_in_db>"
	max_age: "<max_age_of_alerts_in_db>"
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
  db_path: "/var/lib/crowdsec/data/crowdsec.db
```

The path to the database file (only if the type of database is `sqlite`)

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

#### `db_host`

```yaml
db_config:
  type: mysql|postgresql|pgx

  user: foo
```
The host to connect to (only if the type of database is `mysql` or `postgresql`)

#### `db_port`

```yaml
db_config:
  type: mysql|postgresql|pgx

  user: foo
```
The port to connect to (only if the type of database is `mysql` or `postgresql`)

```yaml
db_config:
  type: postgresql

  sslmode: required
```
Required or disable ssl connection to database (only if the type of database is `postgresql`)

#### `flush`

```yaml
flush:
  max_items: <nb_max_alerts_in_database>
  max_age: <max_alerts_age_in_database>
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



### `api`

The api section is used by both `cscli`, `crowdsec` and the local API.

```yaml
api:
  client:
    insecure_skip_verify: "(true|false)"
    credentials_path: "<path_to_local_api_client_credential_file>"
  server:
    log_level: "(error|info|debug|trace>"
    listen_uri: "<listen_uri>" # host:port
    profiles_path: "<path_to_profile_file>"
    use_forwarded_for_headers: "(true|false)"
    console_path: <path_to_console_file>
    online_client:
      credentials_path: "<path_to_crowdsec_api_client_credential_file>"
    tls:
      cert_file: "<path_to_certificat_file>"
      key_file: "<path_to_certificat_key_file>"
```

#### `client`

The client subsection is used by `crowdsec` and `cscli` to read and write decisions to the local API.

```yaml
client:
  insecure_skip_verify: "(true|false)"
  credentials_path: "<path_to_local_api_client_credential_file>"
```

##### `insecure_skip_verify`
>bool

Allows the use of https with self-signed certificates.

##### `credentials_path`
>string

Path to the credential files (contains API url + login/password).

#### `server`

The `server` subsection is the local API configuration.

```yaml
server:
  log_level: (error|info|debug|trace)
  listen_uri: <listen_uri> # host:port
  profiles_path: <path_to_profile_file>
  use_forwarded_for_headers: (true|false)
  console_path: <path_to_console_file>
  online_client:
    credentials_path: <path_to_crowdsec_api_client_credential_file>
  tls:
    cert_file: <path_to_certificat_file>
    key_file: <path_to_certificat_key_file>
```

##### `listen_uri`
> string

Address and port listen configuration, the form `host:port`.

##### `profiles_path`
> string

The path to the profiles configuration.

##### `console_path`
> string

The path to the console configuration.

##### `use_forwarded_for_headers`
> string

Allow the usage of `X-Forwarded-For` or `X-Real-IP` to get the client IP address. Do not enable if you are not running the LAPI behind a trusted reverse-proxy or LB.

##### `online_client`

Configuration to push signals and receive bad IPs from Crowdsec API.

```yaml
online_client:
  credentials_path: "<path_to_crowdsec_api_client_credential_file>"
```

###### `credentials_path`
> string

Path to a file containing credentials for the Central API.

##### `tls`

if present, holds paths to certs and key files.

```yaml
tls:
  cert_file: "<path_to_certificat_file>"
  key_file: "<path_to_certificat_key_file>"
```

###### `cert_file`
> string

Path to certificate file.

###### `key_file`
> string

Path to certficate key file.

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

