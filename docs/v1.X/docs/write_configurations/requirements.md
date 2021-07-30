# Requirements

> - Having read and understood [`crowdsec` concepts](/Crowdsec/v1/getting_started/concepts/)

> - Some requirements are needed in order to be able to write your own end-to-end configurations.

> - During all this documentation, we are going to show as an exemple how we wrote a full port scan detection scenario (from acqusition to scenario, including parser)


## Create the test environment

### Using generated .tgz file

First of all, please [download the latest release of {{v1X.crowdsec.name}}](https://github.com/crowdsecurity/crowdsec/releases).

Then run the following commands:

```bash
tar xzvf crowdsec-release.tgz
```
```bash
cd ./crowdsec-vX.Y/
```
```bash
./test_env.sh  # the -o is facultative, default is "./tests/"
```
```bash
cd ./tests/
```

The `./test_env.sh` script creates a local (non privileged) working environement for {{v1X.crowdsec.name}} and {{v1X.cli.name}}.
The deployed environment is intended to write and test parsers and scenarios easily.


<details>
  <summary>Example</summary>

```bash
$ tar xzvf ./crowdsec-release.tgz
$ cd ./crowdsec-v*/
$ ./test_env.sh 
[12/11/2020:11:45:19][INFO] Creating test arboresence in /tmp/crowdsec-v1.0.0/tests
[12/11/2020:11:45:19][INFO] Arboresence created
[12/11/2020:11:45:19][INFO] Copying needed files for tests environment
[12/11/2020:11:45:19][INFO] Files copied
[12/11/2020:11:45:19][INFO] Setting up configurations
INFO[0000] Machine 'test' created successfully          
INFO[0000] API credentials dumped to '/tmp/crowdsec-v1.0.0/tests/config/local_api_credentials.yaml' 
INFO[0000] Wrote new 73826 bytes index to /tmp/crowdsec-v1.0.0/tests/config/hub/.index.json 
INFO[0000] crowdsecurity/syslog-logs : OK               
INFO[0000] crowdsecurity/geoip-enrich : OK              
INFO[0000] downloading data 'https://crowdsec-statics-assets.s3-eu-west-1.amazonaws.com/GeoLite2-City.mmdb' in '/tmp/crowdsec-v1.0.0/tests/data/GeoLite2-City.mmdb' 
INFO[0002] downloading data 'https://crowdsec-statics-assets.s3-eu-west-1.amazonaws.com/GeoLite2-ASN.mmdb' in '/tmp/crowdsec-v1.0.0/tests/data/GeoLite2-ASN.mmdb' 
INFO[0003] crowdsecurity/dateparse-enrich : OK          
INFO[0003] crowdsecurity/sshd-logs : OK                 
INFO[0004] crowdsecurity/ssh-bf : OK                    
INFO[0004] crowdsecurity/sshd : OK                      
WARN[0004] crowdsecurity/sshd : overwrite               
INFO[0004] crowdsecurity/linux : OK                     
INFO[0004] /tmp/crowdsec-v1.0.0/tests/config/collections doesn't exist, create 
INFO[0004] Enabled parsers : crowdsecurity/syslog-logs  
INFO[0004] Enabled parsers : crowdsecurity/geoip-enrich 
INFO[0004] Enabled parsers : crowdsecurity/dateparse-enrich 
INFO[0004] Enabled parsers : crowdsecurity/sshd-logs    
INFO[0004] Enabled scenarios : crowdsecurity/ssh-bf     
INFO[0004] Enabled collections : crowdsecurity/sshd     
INFO[0004] Enabled collections : crowdsecurity/linux    
INFO[0004] Enabled crowdsecurity/linux                  
INFO[0004] Run 'systemctl reload crowdsec' for the new configuration to be effective. 
[12/11/2020:11:45:25][INFO] Environment is ready in /tmp/crowdsec-v1.0.0/tests

```
</details>

### Using generated binaries and configuration

1) Run `make release`

```
go build -ldflags "-s -w -X github.com/crowdsecurity/crowdsec/pkg/cwversion.Version="v1.1.1" -X github.com/crowdsecurity/crowdsec/pkg/cwversion.System=linux -X github.com/crowdsecurity/crowdsec/pkg/cwversion.BuildDate=2021-07-28_23:27:26 -X github.com/crowdsecurity/crowdsec/pkg/cwversion.Codename=alphaga -X github.com/crowdsecurity/crowdsec/pkg/cwversion.Tag="cedfca07c2dcd15b7ec958ad407217a6b044389a" -X github.com/crowdsecurity/crowdsec/pkg/cwversion.GoVersion="1.16"" -o crowdsec -v
Building Release to dir crowdsec-v1.1.1
crowdsec-v1.1.1/
...
crowdsec-v1.1.1/test_env.sh
```

2) The compiled version can be seen inside the new directory `crowdsec-v1.1.1`. Execute `test_env.sh` from inside 
this directory. You will see the following output

```
[28/07/21:23:28:34][INFO] Creating test arboresence in /home/gopath/src/github.com/crowdsecurity/crowdsec/crowdsec-v1.1.1/tests
[28/07/21:23:28:34][INFO] Arboresence created
[28/07/21:23:28:34][INFO] Copying needed files for tests environment
[28/07/21:23:28:34][INFO] Files copied
[28/07/21:23:28:34][INFO] Setting up configurations
WARN[28-07-2021 11:28:34 PM] can't load CAPI credentials from './config/online_api_credentials.yaml' (missing field) 
INFO[28-07-2021 11:28:34 PM] push and pull to crowdsec API disabled       
INFO[28-07-2021 11:28:34 PM] Machine 'test' successfully added to the local API 
...
INFO[28-07-2021 11:28:35 PM] crowdsecurity/syslog-logs : OK               
INFO[28-07-2021 11:28:35 PM] Enabled parsers : crowdsecurity/syslog-logs  
INFO[28-07-2021 11:28:35 PM] crowdsecurity/geoip-enrich : OK              
....

All the necessary files will be downloaded inside the crowdsec-v1.1.1/tests directory.
```

4) Now you are ready to run `crowdsec` on your local machine. Execute the following command
 
`./crowdsec -c ./dev.yaml -debug`

You will see the following output:

```
WARN[0000] can't load CAPI credentials from './config/online_api_credentials.yaml' (missing field) 
INFO[0000] push and pull to crowdsec API disabled       
INFO[28-07-2021 23:54:53] Crowdsec v1.1.1-linux-cedfca07c2dcd15b7ec958ad407217a6b044389a 
WARN[28-07-2021 23:54:53] prometheus is enabled, but the listen address is empty, using '127.0.0.1' 
WARN[28-07-2021 23:54:53] prometheus is enabled, but the listen port is empty, using '6060' 
INFO[28-07-2021 23:54:53] Loading prometheus collectors                
DEBU[28-07-2021 23:54:53] starting router, logging to                  
[GIN-debug] [WARNING] Running in "debug" mode. Switch to "release" mode in production.
 - using env:   export GIN_MODE=release
 - using code:  gin.SetMode(gin.ReleaseMode)

INFO[28-07-2021 23:54:53] [GIN-debug] POST   /v1/watchers              --> github.com/crowdsecurity/crowdsec/pkg/apiserver/controllers/v1.(*Controller).CreateMachine-fm (4 handlers) 
INFO[28-07-2021 23:54:53] [GIN-debug] POST   /v1/watchers/login        --> github.com/appleboy/gin-jwt/v2.(*GinJWTMiddleware).LoginHandler-fm (4 handlers) 
INFO[28-07-2021 23:54:53] [GIN-debug] GET    /v1/refresh_token         --> github.com/appleboy/gin-jwt/v2.(*GinJWTMiddleware).RefreshHandler-fm (4 handlers) 
INFO[28-07-2021 23:54:53] [GIN-debug] POST   /v1/alerts                --> github.com/crowdsecurity/crowdsec/pkg/apiserver/controllers/v1.(*Controller).CreateAlert-fm (6 handlers) 
INFO[28-07-2021 23:54:53] [GIN-debug] GET    /v1/alerts                --> github.com/crowdsecurity/crowdsec/pkg/apiserver/controllers/v1.(*Controller).FindAlerts-fm (6 handlers) 
INFO[28-07-2021 23:54:53] [GIN-debug] HEAD   /v1/alerts                --> github.com/crowdsecurity/crowdsec/pkg/apiserver/controllers/v1.(*Controller).FindAlerts-fm (6 handlers) 
INFO[28-07-2021 23:54:53] [GIN-debug] GET    /v1/alerts/:alert_id      --> github.com/crowdsecurity/crowdsec/pkg/apiserver/controllers/v1.(*Controller).FindAlertByID-fm (6 handlers) 
INFO[28-07-2021 23:54:53] [GIN-debug] HEAD   /v1/alerts/:alert_id      --> github.com/crowdsecurity/crowdsec/pkg/apiserver/controllers/v1.(*Controller).FindAlertByID-fm (6 handlers) 
INFO[28-07-2021 23:54:53] [GIN-debug] DELETE /v1/alerts                --> github.com/crowdsecurity/crowdsec/pkg/apiserver/controllers/v1.(*Controller).DeleteAlerts-fm (6 handlers) 
INFO[28-07-2021 23:54:53] [GIN-debug] DELETE /v1/decisions             --> github.com/crowdsecurity/crowdsec/pkg/apiserver/controllers/v1.(*Controller).DeleteDecisions-fm (6 handlers) 
INFO[28-07-2021 23:54:53] [GIN-debug] DELETE /v1/decisions/:decision_id --> github.com/crowdsecurity/crowdsec/pkg/apiserver/controllers/v1.(*Controller).DeleteDecisionById-fm (6 handlers) 
INFO[28-07-2021 23:54:53] [GIN-debug] GET    /v1/decisions             --> github.com/crowdsecurity/crowdsec/pkg/apiserver/controllers/v1.(*Controller).GetDecision-fm (6 handlers) 
INFO[28-07-2021 23:54:53] [GIN-debug] HEAD   /v1/decisions             --> github.com/crowdsecurity/crowdsec/pkg/apiserver/controllers/v1.(*Controller).GetDecision-fm (6 handlers) 
INFO[28-07-2021 23:54:53] [GIN-debug] GET    /v1/decisions/stream      --> github.com/crowdsecurity/crowdsec/pkg/apiserver/controllers/v1.(*Controller).StreamDecision-fm (6 handlers) 
...
...
...
...
...
```

In case you want to run from IDE (Goland or VSCode) make sure you do step (3) as above to register 
the machine, then from your IDE run the `cmd/crowdsec/main.go` file with the following parameter:

`-c <full-directory-path>/tests/dev.yaml -debug`

make sure the `dev.yaml` configurations are using absolute path, following is an example of `dev.yaml` 
using absolute path

```
common:
  daemonize: true
  pid_dir: /tmp/
  log_media: stdout
  log_level: info
  working_dir: .
config_paths:
  config_dir: /home/gopath/src/github.com/crowdsecurity/crowdsec/crowdsec-v1.1.1/tests/config
  data_dir: /home/gopath/src/github.com/crowdsecurity/crowdsec/crowdsec-v1.1.1/tests/data
  #simulation_path: /etc/crowdsec/config/simulation.yaml
  hub_dir: /home/gopath/src/github.com/crowdsecurity/crowdsec/crowdsec-v1.1.1/tests/config/hub
  #index_path: ./config/hub/.index.json
crowdsec_service:
  acquisition_path: /home/gopath/src/github.com/crowdsecurity/crowdsec/crowdsec-v1.1.1/tests/config/acquis.yaml
  parser_routines: 1
cscli:
  output: human
db_config:
  type: sqlite
  db_path: /home/gopath/src/github.com/crowdsecurity/crowdsec/crowdsec-v1.1.1/tests/data/crowdsec.db
  user: root
  password: crowdsec
  db_name: crowdsec
  host: "172.17.0.2"
  port: 3306
  flush:
    #max_items: 10000
    #max_age: 168h
api:
  client:
    credentials_path: /home/gopath/src/github.com/crowdsecurity/crowdsec/crowdsec-v1.1.1/tests/config/local_api_credentials.yaml
  server:
    #insecure_skip_verify: true
    listen_uri: 127.0.0.1:8081
    profiles_path: /home/gopath/src/github.com/crowdsecurity/crowdsec/crowdsec-v1.1.1/tests/config/profiles.yaml
    tls:
      #cert_file: ./cert.pem
      #key_file: ./key.pem
    online_client: # Crowdsec API
      credentials_path: /home/gopath/src/github.com/crowdsecurity/crowdsec/crowdsec-v1.1.1/tests/config/online_api_credentials.yaml
prometheus:
  enabled: true
  level: full
```