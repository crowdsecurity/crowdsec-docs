---
id: writing_your_own_plugin
title: Writing Plugin in Go
---

In this guide we will implement a plugin in Go, which dispatches an email with specificied body on receiving alerts.

Full code for this plugin can be found in [crowdsec repo](https://github.com/crowdsecurity/crowdsec/tree/master/plugins/notifications/email)

Before we begin, make sure you read [intro](/notification_plugins/intro.md)

Let's start by creating a new go project in a fresh directory:

```bash
mkdir notification-email
cd notification-email
go mod init notification-email
touch main.go
```


We will write all the plugin related code in the `main.go` file. The plugin is responsible for 

1. Receiving and interpreting the configuration received from CrowdSec's main process. 
2. Receiving alerts messages from CrowdSec and dispatching them to email etc.

All the communication between CrowdSec's main process and the plugin happens via gRPC. Luckily the 
`github.com/crowdsecurity/crowdsec/pkg/protobufs` package has everything to do that.

Let's start with defining the third party dependencies and adding some utilities. In your `main.go` we add:

```go
package main
import (
	"context"
	"fmt"
	"os"

	"github.com/crowdsecurity/crowdsec/pkg/protobufs"
	"github.com/hashicorp/go-hclog"
	plugin "github.com/hashicorp/go-plugin"
	mail "github.com/xhit/go-simple-mail/v2"
	"gopkg.in/yaml.v2"
)

var logger hclog.Logger = hclog.New(&hclog.LoggerOptions{
	Name:       "email-plugin",
	Level:      hclog.LevelFromString("DEBUG"),
	Output:     os.Stderr,
	JSONFormat: true,
})

```

Note that the logs should be structured in order for the main process to interpret it. 

For our plugin to function, we need to know several credentials to send an email. Let's define a struct which expresses this. 

```go
type PluginConfig struct {
	Name     string  `yaml:"name"`
	LogLevel *string `yaml:"log_level"`

	SMTPHost      string `yaml:"smtp_host"`
	SMTPPort      int    `yaml:"smtp_port"`
	SMTPUsername  string `yaml:"smtp_username"`
	SMTPPassword  string `yaml:"smtp_password"`
	SenderEmail   string `yaml:"sender_email"`
	ReceiverEmail string `yaml:"receiver_email"`
}
```

The struct will be unmarshal target of a yaml configuration file, hence the `yaml`  hints.

Next we need to implement the plugin interface `Notifier`.

```go
type Notifier interface {
    Configure(ctx context.Context, config *protobufs.Config) (*protobufs.Empty, error)
    Notify(ctx context.Context, notification *protobufs.Notification) (*protobufs.Empty, error)
}
```

Here the `Configure` method receives `config` which is essentially contents of a yaml config file. The plugin would use this method to capture and store the received config. 

The `Notify` method receives `notification` which has two attributes 
    `Text`:  List of Alert objects formatted into specified format
    `Name`: Name of configuration for which this notification is sent to.


Let's define another struct which implements this interface and stores the config. 

```go
type EmailPlugin struct {
	ConfigByName map[string]PluginConfig
}
```

We map the config by its name because then it will be easy to adapt to configuration specified by the `notification`.


Finally let's implement the `Configure` method. 

```go
func (n *EmailPlugin) Configure(ctx context.Context, config *protobufs.Config) (*protobufs.Empty, error) {
	d := PluginConfig{}
	if err := yaml.Unmarshal(config.Config, &d); err != nil {
		return nil, err
	}
	n.ConfigByName[d.Name] = d
	return &protobufs.Empty{}, nil
}
```

It simply unmarshals the raw `config` into `PluginConfig` struct and stores it into the map for future use.


Let's implement the  `Notify` method.
```go
func (n *EmailPlugin) Notify(ctx context.Context, notification *protobufs.Notification) (*protobufs.Empty, error) {
	if _, ok := n.ConfigByName[notification.Name]; !ok {
		return nil, fmt.Errorf("invalid plugin config name %s", notification.Name)
	}
	cfg := n.ConfigByName[notification.Name]
	if cfg.LogLevel != nil && *cfg.LogLevel != "" {
		logger.SetLevel(hclog.LevelFromString(*cfg.LogLevel))
	} else {
		logger.SetLevel(hclog.Info)
	}

	server := mail.NewSMTPClient()
	server.Host = cfg.SMTPHost
	server.Port = cfg.SMTPPort
	server.Username = cfg.SMTPUsername
	server.Password = cfg.SMTPPassword
	server.Encryption = mail.EncryptionSTARTTLS

	smtpClient, err := server.Connect()
	if err != nil {
		return nil, err
	}

	email := mail.NewMSG()
	email.SetFrom(fmt.Sprintf("From <%s>", cfg.SenderEmail)).
		AddTo(cfg.ReceiverEmail).
		SetSubject("CrowdSec Notification")
	email.SetBody(mail.TextHTML, notification.Text)

	err = email.Send(smtpClient)
	if err != nil {
		return nil, err
	} else {
		logger.Info(fmt.Sprintf("sent email to %s according to %s configuration", cfg.ReceiverEmail, notification.Name))
	}
	return nil, nil
}
```

There are lot of things going on. Let's unpack:

1. In the first block we verify whether the `notification`'s configuration is present.
2. Then we set the log level according to the configuration.
3. In the second block we initiate a SMTP client using the `notification`'s configuration.
4. In the third block we send the email with body equal to the `notification.Text`.

Finally let's define the entrypoint `main` function which serves and hoists the plugin for CrowdSec main process.

```go
func main() {
	var handshake = plugin.HandshakeConfig{
			ProtocolVersion:  1,
			MagicCookieKey:   "CROWDSEC_PLUGIN_KEY",
			MagicCookieValue: os.Getenv("CROWDSEC_PLUGIN_KEY"),
	}

	plugin.Serve(&plugin.ServeConfig{
			HandshakeConfig: handshake,
			Plugins: map[string]plugin.Plugin{
					"email": &protobufs.NotifierPlugin{
							Impl: &EmailPlugin{ConfigByName: make(map[string]PluginConfig)},
					},
			},
			GRPCServer: plugin.DefaultGRPCServer,
			Logger:     logger,
	})
}
```

The `CROWDSEC_PLUGIN_KEY` environment variable is provided by the main process when calling the plugin. It
is used to make sure that the right plugin is dispatched.

The `plugin.Serve` is a method provided by `go-plugin` dependency we earlier defined. It creates a GRPC server which exposes the plugin interface.


Now let's build the plugin and paste it in `/usr/local/lib/crowdsec/plugins/` so CrowdSec can discover it.

```bash
go build
sudo cp notification-email /var/lib/crowdsec/plugins/
```

Next we need to write a configuration file for the plugin. Here's an example:

```yaml
# Don't change this
type: email

name: email_default # this must match with the registered plugin in the profile
log_level: info # Options include: trace, debug, info, warn, error, off

format: |  # This template receives list of models.Alert objects
    CrowdSec detected an attack. 

smtp_host: smtp.google.com
smtp_username: abcd
smtp_password: xyz
smtp_port: 587
sender_email: example@gmail.com
receiver_email: examplereceiver@gmail.com 

# group_wait: # duration to wait collecting alerts before sending to this plugin, eg "30s"

# group_threshold: # if alerts exceed this, then the plugin will be sent the message. eg "10"

# max_retry: # number of tries to attempt to send message to plugins in case of error.

# timeout: # duration to wait for response from plugin before considering this attempt a failure. eg "10s"

```

Replace the values as necessary and paste it in `/etc/crowdsec/notifications/email.yaml` .

Now the final step, register the plugin in your crowdsec profile at `/etc/crowdsec/profiles.yaml`, by adding the following to desired config.

```yaml
notifications:
 - email_default
```

Example profile:

```yaml
name: default_ip_remediation
#debug: true
filters:
 - 1==1
decisions:
 - type: ban
   duration: 4h
notifications:
 - email_default
on_success: break

```

Do the `sudo systemctl restart crowdsec` and we're done. You can try triggering alerts by creating manual decisions and verify whether you recive an email.
