---
id: cscli_completion
title: cscli completion
---
## cscli completion

Generate completion script

### Synopsis

To load completions:

### Bash:
```shell
  $ source <(cscli completion bash)

  # To load completions for each session, execute once:


  # Linux:

  $ cscli completion bash | sudo tee /etc/bash_completion.d/cscli
  $ source ~/.bashrc

  # macOS:

  $ cscli completion bash | sudo tee /usr/local/etc/bash_completion.d/cscli

  # Troubleshoot:
  If you have this error (bash: _get_comp_words_by_ref: command not found), it seems that you need "bash-completion" dependency :

  * Install bash-completion package
  $ source /etc/profile
  $ source <(cscli completion bash)
```

### Zsh:
```shell
  # If shell completion is not already enabled in your environment,
  # you will need to enable it.  You can execute the following once:

  $ echo "autoload -U compinit; compinit" >> ~/.zshrc

  # To load completions for each session, execute once:

  $ cscli completion zsh > "${fpath[1]}/_cscli"

  # You will need to start a new shell for this setup to take effect.

### fish:
```shell
  $ cscli completion fish | source

  # To load completions for each session, execute once:
  $ cscli completion fish > ~/.config/fish/completions/cscli.fish
```
### PowerShell:
```powershell
  PS> cscli completion powershell | Out-String | Invoke-Expression

  # To load completions for every new session, run:
  PS> cscli completion powershell > cscli.ps1
  # and source this file from your PowerShell profile.
```

```
cscli completion [bash|zsh|powershell|fish]
```

### Options

```
  -h, --help   help for completion
```

### Options inherited from parent commands

```
      --color string    Output color: yes, no, auto (default "auto")
  -c, --config string   path to crowdsec config file (default "/etc/crowdsec/config.yaml")
      --debug           Set logging to debug
      --error           Set logging to error
      --info            Set logging to info
  -o, --output string   Output format: human, json, raw
      --trace           Set logging to trace
      --warning         Set logging to warning
```

### SEE ALSO

* [cscli](/cscli/cscli.md)	 - cscli allows you to manage crowdsec

