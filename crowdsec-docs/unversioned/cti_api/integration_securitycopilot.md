---
id: integration_securitycopilot
title: Security Copilot Plugin
---

CrowdSec Intelligence Plugin for Microsoft Security Copilot allows you to get advanced insights on a malicious IP activity.  
As part of the core plugins of Security copilot its setup and usage are very straight forward.

This documentation will lead you through an easy setup and lead you through some example usage and prompts.

## Configure the plugin

### Prerequisite: retrieve your API Key
The plugin is using our CTI API to provide information on over 70M attackers recently reported by CrowdSec's network.  
You can create a trial key or retrieve your existing keys in the [console](https://app.crowdsec.net/) in the "Settings" > "CTI API Keys" section.  
If you need more details check out the [CTI API Key - getting started section](/cti_api/getting_started)

### Activate and setup the plugin
This consist of 3 easy step: browse plugins, select "CrowdSec Threat Intelligence" plugin, paste API Key in setting

#### 1. Browse plugins
Within the [Security Copilot](https://securitycopilot.microsoft.com/) main page, on the right hand side of the prompt input, you'll see an icon represented by 4 squares with a "source" tooltip like shown in the picture there after.   
![Show all plugins via the sources menu](/img/securitycopilot_prompt_and_sourcebutton.png)

Activate the "CrowdSec Threat Intelligence" plugin by clicking on the switch (it will turn blue).  
![Activate the plugin](/img/securitycopilot_plugin_activation.png)

Then fill in your api key in the settings:  
Press the "cog" icon on the plugin within the list  
![Edit settings](/img/securitycopilot_edit_settings.png)

And paste your API Key  
![Paste API Key](/img/securitycopilot_fill_api_key.png)

## Usage

Now let's play around with this plugin.  
*Note: You might need to reload the page after updating your plugin selection.*  

### Basic prompts

You can simply ask:  
```
What does CrowdSec know about <an IP>
```
For example: 
```
What does CrowdSec know about 102.0.4.250
```  

The 3 steps copilot take will be: to select the plugin, do the request and format his response as shown below:  

![Basic result](/img/securitycopilot_basic_prompt_result.png)
