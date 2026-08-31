---
id: setup-expr-helpers
title: Expr Helpers
sidebar_position: 1
---

# Expression Helpers Reference

Various helpers are available for use in the `detect.yaml` file to determine how crowdsec should be configured.

## Host

    This object gives access to various information about the current state of the operating system

### `Host.Hostname`

&nbsp;&nbsp;&nbsp;&nbsp;Returns the hostname of the machine

> `Host.Hostname == "mymachine"`

### `Host.Uptime`

&nbsp;&nbsp;&nbsp;&nbsp;Returns the uptime of the machine in seconds.

### `Host.Boottime`

&nbsp;&nbsp;&nbsp;&nbsp;Returns the unix timestamp of the time the machine booted.

### `Host.Procs`

&nbsp;&nbsp;&nbsp;&nbsp;Returns the number of processes on the machine.

### `Host.OS`

&nbsp;&nbsp;&nbsp;&nbsp;Returns the name of the OS (`linux`, `freebsd`, `windows`, ...)

> `Host.OS == "linux"`

### `Host.Platform`

&nbsp;&nbsp;&nbsp;&nbsp;Returns the variant of the OS (`ubuntu`, `linuxmint`,  ....)

> `Host.Platform == "ubuntu"`

### `Host.PlatformFamily`

&nbsp;&nbsp;&nbsp;&nbsp;Returns the family of the OS (`debian`, `rhel`, ...)

> `Host.PlatformFamily == "debian"`

### `Host.PlatformVersion`

&nbsp;&nbsp;&nbsp;&nbsp;Returns the version of the OS or distribution (for linux, /etc/os-release)

> `Host.PlatformVersion == "25.04"

### `Host.KernelVersion`

&nbsp;&nbsp;&nbsp;&nbsp;Returns the current kernel version as returned by `uname -r`

> `Host.KernelVersion == "6.16.2"

### `Host.KernelArch`

&nbsp;&nbsp;&nbsp;&nbsp;Returns the native architecture of the system (`x86_64`, ...)

> `Host.KernelArch == "x86_64"`

### `Host.VirtualizationSystem`

&nbsp;&nbsp;&nbsp;&nbsp;Returns the name of the virtualization system in use if any.

> `Host.VirtualizationSystem == "kvm"`

### `Host.VirtualizationRole`

&nbsp;&nbsp;&nbsp;&nbsp;Returns the virtualization role of the system if any (`guest`, `host`)

> `Host.VirtualizationRole == "host"`

### `Host.HostID`

&nbsp;&nbsp;&nbsp;&nbsp;Returns a unique ID specific to the system.

## Path

This object exposes helpers functions for the filesystem

### `Exists(path) bool`

&nbsp;&nbsp;&nbsp;&nbsp;Returns `true` if the specified path exists.

> `Path.Exists("/var/log/nginx/access.log") == true`

### `Glob(pattern) []string`

&nbsp;&nbsp;&nbsp;&nbsp;Returns a list of files matching the provided pattern.

&nbsp;&nbsp;&nbsp;&nbsp;Returns an empty list if the glob pattern is invalid

> `len(Path.Glob("/var/log/nginx/*.log")) > 0`

## System

### `ProcessRunning(name) bool`

&nbsp;&nbsp;&nbsp;&nbsp;Returns `true` if there's any process with the specified name running

> `System.ProcessRunning("nginx") == true`

## Systemd

&nbsp;&nbsp;&nbsp;&nbsp;This object exposes helpers to get informations about Systemd units.

&nbsp;&nbsp;&nbsp;&nbsp;Only available on Linux.

### `UnitInstalled(unitName) bool`

&nbsp;&nbsp;&nbsp;&nbsp;Returns `true` if the provided unit is installed.

> `Systemd.UnitInstalled("nginx") == true`

### `UnitConfig(unitName, key) string`

&nbsp;&nbsp;&nbsp;&nbsp;Returns the value of the specified key from the specified unit.

&nbsp;&nbsp;&nbsp;&nbsp;Returns an empty value if the unit if not installed and an error if the key does not exist.

> `Systemd.UnitConfig("nginx", "StandardOutput") == "journal"`

### `UnitLogsToJournal(unitName) bool`

&nbsp;&nbsp;&nbsp;&nbsp;Returns `true` if unit stdout/stderr are redirect to journal or journal+console.

> `Systemd.UnitLogsToJournal("nginx") == true`

## Windows

&nbsp;&nbsp;&nbsp;&nbsp;This object exposes helpers to get informations about Windows services.

&nbsp;&nbsp;&nbsp;&nbsp;Only available on Windows.

### `ServiceEnabled(serviceName) bool`

&nbsp;&nbsp;&nbsp;&nbsp;Returns `true` if the specified service exists and is configured to start automatically on boot.

> `Windows.ServiceEnabled("MSSSQLSERVER") == true`

## Version

### `Check(version, constraint) bool`

&nbsp;&nbsp;&nbsp;&nbsp;Performs a semantic version check.

&nbsp;&nbsp;&nbsp;&nbsp;Constraint supports operators like `=`, `!=`, `<`, `<=`, `>`, `>=`, ranges (1.1.1 - 1.3.4), AND with commas (`>1`, `<3`), and ~ compatible ranges.

> `Version.Check(Host.KernelVersion, ">=6.24.0")`
