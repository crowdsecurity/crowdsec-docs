---
id: install_windows
title: Install CrowdSec (Windows)
---


:::info

Windows support is still in alpha, you may encounter issues !

The installers are not yet available as part of a release, so you will need to download them from the S3 buckets linked in the documentation.

:::

## Crowdsec Installation

You can download the MSI from here: https://crowdsec-windows-alpha.s3.eu-west-1.amazonaws.com/crowdsec_1.3.0.msi

The MSI will perform some basic setup when run:
 - It will install crowdsec
 - It will download the [windows collection](https://hub.crowdsec.net/author/crowdsecurity/collections/windows) (it includes the basic parser for the windows event log, a scenario to detect login bruteforce, and the MMDB files to perform geo-ip enrichment)
 - It will register your crowdsec installation with our central API.
 - It will create a service that will run at boot and start crowdsec

Contrary to Linux, crowdsec does not (yet !) support auto configuration at install time, so you will need to customize your acquisition config if you want to be able to detect something other than RDP bruteforce.

The default configuration will catch bruteforce against RDP or SMB (or any kind of remote authentication that uses Windows auth).

We currently support the following Windows service:
 - RDP/SMB (bruteforce detection)
 - IIS (HTTP attacks)
 - SQL Server (bruteforce detection)
 - Windows Firewall (network scan detection)

These directories are created:
 - `C:\Program Files\CrowdSec`: contains the `crowdsec.exe` and `cscli.exe` executables
 - `C:\Program Files\CrowdSec\config`: contains all the configuration files
 - `C:\ProgramData\CrowdSec\log`: contains the various log files of crowdsec or the bouncers
 - `C:\ProgramData\Crowdsec\data`: contains the crowdsec database (if using sqlite), and the various datafiles used by the scenarios/parsers.
 - `C:\ProgramData\Crowdsec\hub`: contains the hub data

### Acquisition Configuration

As crowdsec is not able to auto-detect running services on Windows, you will need to configure the acquisition manually.

#### SQL Server logs

You will need to install the [`crowdsecurity/mssql`](https://hub.crowdsec.net/author/crowdsecurity/collections/mssql) collection.

The collection contains a parser for the SQL server authentication logs, and a scenario to detect bruteforce.

To install the collection, from an admin powershell prompt, run `cscli.exe collections install crowdsecurity/mssql`.

You will then need to update the acquisition file, located in `C:\Program Files\CrowdSec\config\acquis.yaml`, and add the following:
```yaml
---
source: wineventlog
event_channel: Application
event_ids:
 - 18456
event_level: information
labels:
 type: eventlog
```

Lastly, restart the crowdsec service (using `net`, `sc` or the services app), and crowdsec will now parse the SQL server authentication logs.

:::info

This scenario requires SQL Server to log failed authentication, which is the case by default

:::

#### IIS Logs

You will need to install the [`crowdsecurity/iis`](https://hub.crowdsec.net/author/crowdsecurity/collections/iis) collection.

The collection contains a parser for IIS W3C log format (with the default fields), and another collection containing all the basic HTTP scenarios.

To install the collection, from an admin powershell prompt, run `cscli.exe collections install crowdsecurity/iis`.

If your IIS setup logs to a file, add the following to your acquisition configuration (`C:\Program Files\CrowdSec\config\acquis.yaml`):
```yaml
use_time_machine: true
filenames:
  - C:\\inetpub\\logs\\LogFiles\\*\\*.log
labels:
  type: iis
```

Please note that `use_time_machine` is very important: by default IIS will flush the logs to a file every minute or if there is 64kB of logs to write.

This means crowdsec will see a bunch of lines at the same time, and can lead to false positive.

The `use_time_machine` parameter makes crowdsec use the timestamp present in the line instead of the date of acquisition as the date of the event.

If your IIS logs to the event logs, add the following to your acquisition config:
```yaml
source: wineventlog
event_channel: Microsoft-IIS-Logging/Logs
event_ids:
 - 6200
event_level: information
labels:
 type: iis
```
Lastly, restart the crowdsec service (using `net`, `sc` or the services app), and crowdsec will now parse your IIS access logs.

#### Windows Firewall

You will need to install the [`crowdsecurity/windows-firewall`](https://hub.crowdsec.net/author/crowdsecurity/collections/windows-firewall) collection.

The collection contains a parser for the windows firewall logs, and a scenario to detect port scan.

To install the collection, from an admin powershell prompt, run  `cscli.exe collections install crowdsecurity/windows-firewall`

You will also need to enable the windows firewall logging, you can use the official Microsoft documentation available [here](https://docs.microsoft.com/en-us/windows/security/threat-protection/windows-firewall/configure-the-windows-firewall-log). 

Update the acquisition configuration in `C:\Program Files\CrowdSec\config\acquis.yaml`, and add the following:
```yaml
filenames:
  - C:\\Windows\\System32\\LogFiles\\Firewall\\pfirewall.log
labels:
  type: windows-firewall
```

Lastly, restart the crowdsec service (using `net`, `sc` or the services app), and crowdsec will now parse the firewall logs.

:::info

Because the Windows Firewall operates in `stealth mode` by default, not all dropped packets will be logged, only the one intented for port on which a service listens, which means that crowdsec won't catch all network scan.

Please note that we *DO NOT* recommand disabling stealth mode.

:::

#### Other services

Almost all service types supported on Linux should also be supported on Windows, as long as crowdsec does not expect logs in the syslog format (this means that MySQL or Apache will work, but not SSH).


## Windows Firewall Bouncer Installation

Now that you've got crowdsec up and running, it's time to install a bouncer to actually block the IPs that attack you.

We will be using the Windows Firewall bouncer, which manage some windows firewall rules to drop traffic from IPs blocked by crowdsec.

You can download the MSI here: https://crowdsec-windows-alpha.s3.eu-west-1.amazonaws.com/cs_windows_firewall_bouncer_setup.msi

:::warning

The Windows Firewall Bouncer requires the .NET 6 runtime, please install it before running the bouncer or it won't work.

The runtime can be download from Microsoft: https://dotnet.microsoft.com/en-us/download

:::

When you run the MSI, the bouncer will automatically register itself in crowdsec, create a service that will run at boot, and start the bouncer.

The bouncer works by adding a number of rules to the windows firewall (one rule per thousand blocked IPs).

Those rules begins with `crowdsec-blocklist`, and you should not manually update or delete them.

They will be automatically deleted when the bouncer stops, and created at startup.

### Manual configuration

If you install the bouncer before crowdsec, you will need to perform some manual steps.

First, you will need to create an API key for the bouncer.

To do so, open an admin powershell prompt, and run `cscli.exe bouncers add windows-firewall-bouncer`, this will display an API key.

Add this key in the bouncer configuration file, located in `C:\Program Files\CrowdSec\bouncers\cs-windows-firewall-bouncer\cs-windows-firewall-bouncer.yaml`.

When done, you will need to enable the `cs-windows-firewall-bouncer` service, and start it (using `net`, `sc` or the services app).