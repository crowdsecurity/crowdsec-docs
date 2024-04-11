# Blocklist Subscription

To start the subscription process the top button is the most straightforward way.

![](/img/console/blocklists/header_point_subscribe.png)
  
:::info
 You can also use the _security engines_ dashboard actions to start the process
:::

![](/img/console/blocklists/se_section_point_subscribe.png)

After clicking the button, a popup will open to show all the security engines enrolled and available for subscription.

![](/img/console/blocklists/subscription_popup.png)

:::warning
 To subscribe a _security engine_ to a Blocklist, the CrowdSec version used must be 1.4.2 or higher.
Otherwise, a red message will warn that the subscription is impossible.
 :::

![](/img/console/blocklists/subscription_lapi_error.png)
  
The popup will give the possibility to configure which engines will subscribe to the blocklist, and what remediation will be applied to the IPs listed, trying to reach your server.

By default, all the eligible engines are selected.

![](/img/console/blocklists/subscription_popup_point_valid.png)

Once an engine is subscribed, it will automatically receive all the blocklist data and stay up to date when the blocklist content is refreshed.

The dashboard at the bottom of the page provides an advanced management of the blocklist subscriptions.

![](/img/console/blocklists/subscribed_engine_section.png)

To interact with the engines subscribed, two options are available:

*   To perform batch actions the checkboxes can be used in combination with the selector

![](/img/console/blocklists/se_section_point_actions.png)

![](/img/console/blocklists/se_section_action_list.png)

*   To perform quick actions, the buttons on the right side of the item can switch the remediation type, or unsubscribe the security engine from the blocklist.

![](/img/console/blocklists/se_section_point_unsubscribe.png)

:::info
When performing an action, a popup will prompt to validate the action performed.
:::

![](/img/console/blocklists/remediation_popup.png)