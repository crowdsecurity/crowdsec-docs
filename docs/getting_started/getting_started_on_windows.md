---
id: install_windows
title: Windows
---

## Security Engine Installation

You can download the MSI file from the [latest github release](https://github.com/crowdsecurity/crowdsec/releases/latest).

Before installing the package, you might want to check [the ports that the security engine will use](/docs/next/configuration/network_management).

The MSI file will perform some basic setup:
 - Installation of the Security Engine
 - Download of the [windows collection](https://hub.crowdsec.net/author/crowdsecurity/collections/windows). This includes the basic parser for the windows event log, a scenario to detect login brute force and the MMDB files to perform geo-ip enrichment.
 - Registering your Security Engine with our Central API.
 - Installation of the Windows Service for Security Engine. The service will start at boot time.

Contrary to Linux, the Security Engine does not yet support the automatic configuration at installation time. If you want to be able to detect something other than RDP or SMB bruteforce, then you will need to customize your acquisition configuration.

The default configuration will catch brute force attacks against RDP and SMB or any kind of remote authentication that uses Windows authentification.

We currently support the following Windows services:
 - RDP/SMB: Brute force detection
 - IIS: HTTP attacks
 - SQL Server: Brute force detection
 - Windows Firewall: Network scan detection

These directories are created:
 - `C:\Program Files\CrowdSec`: Contains the `crowdsec.exe` and `cscli.exe` executables
 - `C:\ProgramData\CrowdSec\config`: Contains all the configuration files
 - `C:\ProgramData\CrowdSec\log`: Contains the various log files of CrowdSec or the bouncers
 - `C:\ProgramData\Crowdsec\data`: Contains the CrowdSec database (if using sqlite) and the various data files used by the scenarios/parsers
 - `C:\ProgramData\Crowdsec\hub`: Contains the hub data

### Acquisition Configuration

#### SQL Server logs

You will need to install the [`crowdsecurity/mssql`](https://hub.crowdsec.net/author/crowdsecurity/collections/mssql) collection.

The collection contains a parser for the SQL server authentication logs and a scenario to detect brute force.

To install the collection from an admin powershell prompt run `cscli.exe collections install crowdsecurity/mssql`.

You will then need to update the acquisition file located in `C:\ProgramData\CrowdSec\config\acquis.yaml` and add the following:
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

Restart the CrowdSec service (using `net`, `sc` or the services app), and the `Security Engine` will now parse the SQL server authentification logs.

:::info

This scenario requires SQL Server to log failed authentication, which is the case by default

:::

#### IIS Logs

You will need to install the [`crowdsecurity/iis`](https://hub.crowdsec.net/author/crowdsecurity/collections/iis) collection.

The collection contains a parser for IIS W3C log format (with the default fields) and an another collection containing all the basic HTTP scenarios.

To install the collection from an administrator powershell prompt, run `cscli.exe collections install crowdsecurity/iis`.

If your IIS setup logs to a file then add the following to your acquisition configuration (`C:\ProgramData\CrowdSec\config\acquis.yaml`):

```yaml
---
use_time_machine: true
filenames:
  - C:\\inetpub\\logs\\LogFiles\\*\\*.log
labels:
  type: iis
```

Please note that `use_time_machine` is very important: By default IIS will flush the logs to a file every minute or if there is 64kB of logs to write.

This means the `Security Engine` will see a influx of lines at the same time which can lead to false positive.

The `use_time_machine` option enforces the use of the timestamp present in the line instead of the date of acquisition as the date of the event.

If your IIS logs to the event logs, add the following to your acquisition configuration:
```yaml
---
source: wineventlog
event_channel: Microsoft-IIS-Logging/Logs
event_ids:
 - 6200
event_level: information
labels:
 type: iis
```
Restart the CrowdSec service (using `net`, `sc` or the services app) and the `Security Engine` will now parse your IIS access logs.

#### Windows Firewall

You will need to install the [`crowdsecurity/windows-firewall`](https://hub.crowdsec.net/author/crowdsecurity/collections/windows-firewall) collection.

The collection contains a parser for the windows firewall logs and a scenario to detect port scans.

To install the collection from an administrator powershell or DOS prompt run  `cscli.exe collections install crowdsecurity/windows-firewall`

You will also need to enable the windows firewall logging. The official Microsoft documentation is available [here](https://docs.microsoft.com/en-us/windows/security/threat-protection/windows-firewall/configure-the-windows-firewall-log). 

Update the acquisition configuration in `C:\ProgramData\CrowdSec\config\acquis.yaml` and add the following:
```yaml
---
filenames:
  - C:\\Windows\\System32\\LogFiles\\Firewall\\pfirewall.log
labels:
  type: windows-firewall
```

Restart the CrowdSec service and the `Security Engine` will now parse the firewall logs.

:::info

Because the Windows Firewall operates in `stealth mode` by default, not all dropped packets will be logged. Only the one intented for port on which a service listens, which means that CrowdSec won't catch all network scans.

Please note that we *DO NOT* recommand disabling stealth mode.

:::

#### Other services

Almost all service types supported on Linux should also be supported on Windows, as long as the `Security Engine` does not expect logs in the syslog format.


## Windows Firewall Remediation Component Installation

:::info
You may see Remediation Components referred to as "bouncers" in the documentation and/or within cscli commands.
:::

Now that you've got the `Security Engine` up and running, it's time to install a Remediation Component to actually block the IP addresses which are attacking your server.

We will use the Windows Firewall Component, which manages some windows firewall rules to drop traffic from IP addresses blocked by the engine.

You can download either a MSI (containing only the bouncer) or a setup bundle (containing the component and the .NET 6 runtime) from the github releases: https://github.com/crowdsecurity/cs-windows-firewall-bouncer/releases

:::warning

The Windows Firewall Remediation Component requires the .NET 6 runtime. Install it before running the Component or use our setup bundle to install it with the Component.

The runtime can be downloaded from [Microsoft](https://dotnet.microsoft.com/en-us/download/dotnet/6.0/runtime).
Choose the "Console App" download.

:::

:::warning

If you installed the previous alpha release that was distributed from https://alpha-packages.crowdsec.net/, you must uninstall the previous version first.

:::


When you run the MSI file, the Remediation Component will automatically register itself in the Security Engine and creates the Windows service, that will start the component on boot.

The component works by adding a number of rules to the windows firewall (one rule per thousand blocked IPs).

Those rules begins with `crowdsec-blocklist` and you should not manually update or delete them.

They will be automatically deleted when the component stops, and created at startup.

### Manual configuration

If you install the Remediation Component before the Security Engine, you will need to perform some manual steps.

First, you will need to create an API key for the Remediation Component.

To do so, open an administrator powershell or DOS prompt and run `cscli.exe bouncers add windows-firewall-bouncer`. This will display an API key.


Add this key in the Remediation Component configuration file located in `C:\ProgramData\CrowdSec\bouncers\cs-windows-firewall-bouncer\cs-windows-firewall-bouncer.yaml`.

When done, you will need to enable the `cs-windows-firewall-bouncer` service and start it.

## Enrolling your instance

The next step is to enroll your instance with the [CrowdSec Console](https://app.crowdsec.net/security-engines?enroll-engine=true).

For the benefits, please visit the [Console section](/u/console/intro).