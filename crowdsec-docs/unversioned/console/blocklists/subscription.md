# Blocklist Subscription

To begin the subscription process, click the _Subscribe_ button at the top of the blocklist details page. This will bring you to the bottom of the page, where you can subscribe to either security engines or integrations.

![](/img/console/blocklists/header_point_subscribe.png)

## Subscribe

### Security Engines
  
If your account already includes enrolled Security Engines, you'll find a section at the bottom that can also be used to start the subscription process.

![](/img/console/blocklists/se_section_point_subscribe.png)

When initiated, a popup displays all available subscription methods, including Security Engines and Blocklist-as-a-Service options.

![](/img/console/blocklists/subscription_popup.png)

:::warning
Please note that only security engines version 1.4.2 or higher can be subscribed to a blocklist. If you use an older version, please update it to the latest version.
:::

![](/img/console/blocklists/subscription_lapi_error.png)
  
The popup will allow you to configure which engines will subscribe to the blocklist and what remediation will be applied to the IPs listed that are trying to reach your server.

By default, all the eligible engines are selected.

![](/img/console/blocklists/subscription_popup_point_valid.png)

Once an engine is subscribed, it will automatically receive all the blocklist data and stay updated when the blocklist content is refreshed.

The dashboard at the bottom of the page provides an advanced management of the blocklist subscriptions.

![](/img/console/blocklists/subscribed_engine_section.png)

To interact with the engines subscribed, two options are available:

* To perform batch actions, the checkboxes can be used in combination with the selector

![](/img/console/blocklists/se_section_point_actions.png)

![](/img/console/blocklists/se_section_action_list.png)

* To perform quick actions, the buttons on the right side of the item can switch the remediation type or unsubscribe the security engine from the blocklist.

![](/img/console/blocklists/se_section_point_unsubscribe.png)

:::info
When performing an action, a popup will prompt to validate the action performed.
:::

![](/img/console/blocklists/remediation_popup.png)

### Integrations

If your organization already has integrations, a section at the bottom can also be used to start the subscription process.

![](/img/console/blocklists/integrations/subscriptions.png)

To subscribe to an integration to the current blocklist, click on the _Subscribe_ button from the desired integration.
You will now see a different border around the subscribed integrations.

![](/img/console/blocklists/integrations/subscribed.png)
