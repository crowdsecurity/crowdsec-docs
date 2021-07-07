
# Installation methods



## On debian / ubuntu :

 - [Set up crowdsec's repositories](/Crowdsec/v11/getting_started/installation/#install-on-debian-using-crowdsec-repository) and install from them, for ease of installation and upgrade
 - Some users [use debian's official crowdsec packages](/Crowdsec/v11/getting_started/installation/#install-using-debian-official-packages)
 - Some users download the DEB package directly and [install it manually](/Crowdsec/v11/getting_started/installation/#manually-install-the-debian-package)


## On RHEL / CentOS :

 - [Set up crowdsec's repositories](/Crowdsec/v11/getting_started/installation/#install-on-redhatcentos-using-crowdsec-repository) and install from them, for ease of installation and upgrade

## On FreeBSD :

 - [crowdsec and the firewall bouncer](/Crowdsec/v11/getting_started/installation/#install-on-freebsd) are available

## Generic *nix & containers :

 - Some users download the tarball directly and [install it manually](/Crowdsec/v11/getting_started/installation/#install-from-the-release-tarball)
 - Some users use the [docker hub image](https://hub.docker.com/r/crowdsecurity/crowdsec)
 - And the most adventurous might want to [build & install from source](/Crowdsec/v11/getting_started/installation/#install-from-source)
 - And some might even want to [build their own docker image](/Crowdsec/v11/getting_started/installation/#build-docker-image)
 - Or use it with [docker-compose](https://github.com/crowdsecurity/example-docker-compose)

# Required resources

Crowdsec agent itself is rather light, and in a small to medium setup should use less than 100Mb of memory.
During intensive logs processing, CPU is going to be the most used resource, and memory usage shouldn't really grow.

However, running [metabase](https://www.metabase.com/) (the dashboard deployed by `cscli dashboard setup`) [requires 1-2Gb of RAM](https://www.metabase.com/docs/latest/troubleshooting-guide/running.html).


# Install on debian using crowdsec repository

On debian and ubuntu, packages are hosted on [packagecloud.io](https://packagecloud.io).

Crowdsec distributes their own pragmatic debian packages that closely follow the development stream (packages are automatically published on release), and are suitable for those that want to keep up with the latest changes of crowdsec.


## setup the repository

Instructions for adding repositories to your machine can be found in [packagecloud's installation docs](https://packagecloud.io/crowdsec/crowdsec/install#bash-deb).

If you're not fond of `curl ... | sudo bash`, follow instruction bellow :

 1. Retrieve the signing key 

```bash
curl -L https://packagecloud.io/crowdsec/crowdsec/gpgkey | sudo apt-key add -
```

 2.Install the apt-transport-https package in order to be able to fetch packages over HTTPS:

```bash
sudo apt-get install -y apt-transport-https
```

 3. Add the appropriate repository to your source.list 

```bash
echo "deb https://packagecloud.io/crowdsec/crowdsec/debian/ $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/crowdsec.list > /dev/null
```

## install crowdsec

The following debian suites / architectures are available :

<center>

| Suite       | Architecture     |
| :------------- | :----------: | 
| bionic | amd64, arm64   |
| bullseye   | amd64, arm64 |
| buster | amd64, arm64 |
| focal |  amd64, arm64 | 
| stretch | amd64, arm64 | 
| xenial | amd64, arm64 | 

</center>

```bash
sudo apt-get update
sudo apt-get install crowdsec
```

# Manually install the debian package

Fetch your package from the [public repository](https://packagecloud.io/crowdsec/crowdsec), and install it manually :

```bash
sudo dpkg -i ./crowdsec_1.0.7-4_amd64.deb
```

# Install using debian official packages

Crowdsec is available for [bullseye & sid](https://packages.debian.org/search?searchon=names&keywords=crowdsec) and can be installed simply :

```bash
sudo apt-get install crowdsec
```


# Install on redhat/centos using crowdsec repository

On redhat and centos, packages are hosted on [packagecloud.io](https://packagecloud.io).

Crowdsec distributes their own pragmatic debian packages that closely follow the development stream (packages are automatically published on release), and are suitable for those that want to keep up with the latest changes of crowdsec.

## setup the repository

Instructions for adding repositories to your machine can be found in [packagecloud's installation docs](https://packagecloud.io/crowdsec/crowdsec/install#bash-rpm).

If you're not fond of `curl ... | sudo bash`, you [can look at the manual method](https://packagecloud.io/crowdsec/crowdsec/install#manual-rpm) to directly add the appropriate `.repo` to your configuration.


## install crowdsec

The following rhel/centos suites / architectures are available :

<center>

| Suite       | Architecture     |
| :------------- | :----------: | 
|  el/7| amd64   |
|  el/8 | amd64, arm64   |
| fedora/33   | amd64, arm64 |
| fedora/34   | amd64, arm64 |
| amazon linux/2 | amd64, arm64 |

</center>

__centos/8 and fedora/33 and fedora/34 :__
```bash
dnf install crowdsec
```

__older versions :__
```bash
yum install crowdsec
```

# Install on FreeBSD

Crowdsec is available on FreeBSD:
```bash
sudo pkg install crowdsec
```

The [crowdsec firewall bouncer](https://github.com/crowdsecurity/cs-firewall-bouncer) is available as well:
```bash
sudo pkg install crowdsec-firewall-bouncer
```

# Install from the release tarball

Fetch {{v11X.crowdsec.name}}'s latest version [here]({{v11X.crowdsec.download_url}}).

```bash
tar xvzf crowdsec-release.tgz
```
```bash
cd crowdsec-v1.X.X
```

A {{v11X.wizard.name}} is provided to help you deploy {{v11X.crowdsec.name}} and {{v11X.cli.name}}.

## Using the interactive wizard

```
sudo {{v11X.wizard.bin}} -i
```

![crowdsec](../assets/images/crowdsec_install.gif)

The {{v11X.wizard.name}} is going to guide you through the following steps :

 - detect services that are present on your machine
 - detect selected services logs
 - suggest collections (parsers and scenarios) to deploy
 - deploy & configure {{v11X.crowdsec.name}} in order to watch selected logs for selected scenarios
 
The process should take less than a minute, [please report if there are any issues]({{v11X.wizard.bugreport}}).

You are then ready to [take a tour](/Crowdsec/v11/getting_started/crowdsec-tour/) of your freshly deployed {{v11X.crowdsec.name}} !

!!! info
        Keep in mind the {{v11X.crowdsec.name}} is only in charge of the "detection", and won't block anything on its own. You need to deploy a {{v11X.bouncers.Htmlname}} to "apply" decisions.

## Binary installation

> you of little faith

```
sudo {{v11X.wizard.bin}} --bininstall
```

This will only deploy the binaries, and some extra installation steps need to be completed for the software to be functional :

 - `sudo cscli hub update` : update the hub index
 - `sudo cscli machines add -a` : register crowdsec to the local API
 - `sudo cscli capi register` : register to the central API
 - `sudo cscli collections install crowdsecurity/linux` : install essential configs (syslog parser, geoip enrichment, date parsers)
 - configure your sources in your {{v11X.ref.acquis}} : `/etc/crowdsec/acquis.yaml`

You can now start & enable the crowdsec service :

 - `sudo systemctl start crowdsec`
 - `sudo systemctl enable crowdsec`

## Using the unattended wizard

If your setup is standard and you've walked through the default installation without issues, you can win some time in case you need to perform a new install : `sudo ./wizard.sh --unattended` 

This mode will emulate the interactive mode of the wizard where you answer **yes** to everything and stick with the default options. 

# Install from source

!!! warning "Requirements"
    
    * [Go](https://golang.org/doc/install) v1.13+
    * `git clone {{v11X.crowdsec.url}}`
    * [jq](https://stedolan.github.io/jq/download/)


Go in {{v11X.crowdsec.name}} folder and build the binaries :

```bash
cd crowdsec
make release
```

This will create you a directory (`crowdsec-vXXX/`) and an archive (`crowdsec-release.tgz`) that are release built from your local code source. 

Now, you can install either with [interactive wizard](#using-the-interactive-wizard) or the [unattended mode](#using-unattended-mode).

# Build docker image

Crowdsec provides a docker image and can simply built like this :

```bash
git clone https://github.com/crowdsecurity/crowdsec.git && cd crowdsec
docker build -t crowdsec .
```
