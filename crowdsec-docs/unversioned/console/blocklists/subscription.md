# Blocklist Subscription

To begin the subscription process, click the _Subscribe_ button at the top of the blocklist details page. This will open a popup that will allow you to select the subscription method.

![](/img/console/blocklists/header_point_subscribe.png)

## Subscribe

You can subscribe to a blocklist at the Organization, Security Engine, or Integration level. On the community plan you can subscribe to 3 blocklists, to remove this limitation you can upgrade to the [enterprise plan](https://www.crowdsec.net/pricing) which includes various perks.

### Organization Level

The simplest way to subscribe to a blocklist is at the organization level. This will apply the blocklist to all Security Engines and Integrations within the organization this will include current and future Security Engines and Integrations.

![](/img/console/blocklists/org_subscribe_popup.png)

:::note
One remediation type will be applied to all the Security Engines and Integrations subscribed to the blocklist.
:::

If you want to apply different remediation methods to different Security Engines or Integrations, you will need to subscribe to the blocklist at the Security Engine or Integration level.

### Security Engines
  
If your account already includes enrolled Security Engines, you'll find a section at the bottom that can also be used to start the subscription process.

![](/img/console/blocklists/se_section_point_subscribe.png)

When initiated, a popup displays all available subscription methods, including Security Engines and Blocklist-as-a-Service options.

![](/img/console/blocklists/subscription_popup.png)

:::warning
Please note that only Security Engines version 1.4.2 or higher can be subscribed to a blocklist. If you use an older version, please update it to the latest version.
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

* To perform quick actions, the buttons on the right side of the item can switch the remediation type or unsubscribe the Security Engine from the blocklist.

![](/img/console/blocklists/se_section_point_unsubscribe.png)

:::info
When performing an action, a popup will prompt to validate the action performed.
:::

![](/img/console/blocklists/remediation_popup.png)

### Integrations

If your organization already has Integrations, a section at the bottom can also be used to start the subscription process.

![](/img/console/blocklists/integrations/subscriptions.png)

To subscribe to an integration to the current blocklist, click on the _Subscribe_ button from the desired integration.
You will now see a different border around the subscribed Integrations.

![](/img/console/blocklists/integrations/subscribed.png)
