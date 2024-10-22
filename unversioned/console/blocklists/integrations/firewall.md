---
title: Firewall integrations
---

The Firewall integration feature allows users to consume blocklists without installing any CrowdSec Security Engine. This feature provides flexibility by enabling users to pull blocklists from an endpoint in various formats.

## Create an integration

You will find the integration page under the blocklist menu. When it's your first time, you will encounter this page showing you all the possible integrations available.

![](/img/console/blocklists/integrations/catalog.png)

To create a new integration, click on the desired provider or the generic vendor format. The generic vendor format is a one-IP per-line format that will suit many situations. If you need another format, please ask us by clicking the _Request integration_ button. <br />
Once you have an integration, the page is built differently, and you can click on the "Add Integration" button at the top right corner to complete the same action. A popup will then appear, asking for the integration name and an optional description to help you organize your future integrations.

![](/img/console/blocklists/integrations/create.png)

In the next step, we will provide the necessary details for retrieving the IP addresses from a secure endpoint. It will include your unique endpoint URI and credentials.

![](/img/console/blocklists/integrations/create_last_step.png)

## Use an integration

| Don't forgot to [subscribe to a blocklist](/u/console/blocklists/subscription/#subscribe-a-firewall-integration-to-a-blocklist) to make the integration useful.

Every product product has its way to handle external blocklists. We provide a simple URL to retrieve the IPs in a format that suits your needs. You can find the supported provider documentations and output format examples in the following array.

:::info  
 Some providers have technical limits on the number of IPs they can pull at once. That's why we recommand to monitor the number of IPS returned by the integration and use the pagination feature if needed.
:::

| Provider's documentation                                                                                                                                                                 | Format     | Example                                                                                                                         |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------- |
| [Cisco](https://www.cisco.com/c/en/us/td/docs/security/secure-firewall/management-center/device-config/710/management-center-device-config-71/objects-object-mgmt.html#ID-2243-00000291) | Plain text | `192.168.38.187`<br />`192.168.38.186`                                                                                          |
| [Checkpoint](https://support.checkpoint.com/results/sk/sk132193)                                                                                                                         | Custom     | `Accessobserv2,192.168.38.187,IP,high,high,AB,C&C server IP`<br />`Accessobserv2,192.168.38.188,IP,high,high,AB,C&C server IP ` |
| [F5](https://techdocs.f5.com/kb/en-us/products/big-ip-afm/manuals/product/big-ip-network-firewall-policies-and-implementations-14-0-0/07.html)                                           | Custom     | `192.168.38.187,32,BL,crowdsec-myf5Integration`<br /> `192.168.38.188,32,BL,crowdsec-myf5Integration`                           |
| [Fortinet](https://docs.fortinet.com/document/fortigate/6.4.5/administration-guide/891236/external-blocklist-policy)                                                                     | Plain text | `192.168.38.187`<br />`192.168.38.186`                                                                                          |
| [Palo Alto](https://docs.paloaltonetworks.com/pan-os/11-1/pan-os-admin/policy/use-an-external-dynamic-list-in-policy/external-dynamic-list#idf36cb80a-77f1-4d17-9c4b-7efe9fe426af)       | Plain text | `192.168.38.187`<br />`192.168.38.186`                                                                                          |
| [Sophos](https://docs.sophos.com/nsg/sophos-firewall/21.0/help/en-us/webhelp/onlinehelp/AdministratorHelp/ActiveThreatResponse/ThirdPartyThreatFeeds/index.html)                         | Plain text | `192.168.38.187`<br />`192.168.38.186`                                                                                          |
| Generic vendor                                                                                                                                                                           | Plain text | `192.168.38.187`<br />`192.168.38.186`                                                                                          |

## How to bypass provider limit?

Some providers have technical limits on the number of IPs they can pull at once. That's why we recommand to monitor the number of IPS returned by the integration and use the pagination feature if needed.
For this, you can use the page and page_size query parameters in the URL.

`https://admin.api.dev.crowdsec.net/v1/integrations/123/content?page=1&page_size=1500 `

You can then use the page parameter to get the next page of IPs.

## I lost my credentials

Remember that you can only view your credentials once when you create the integration. If you lose them, you must generate new credentials and update your firewall configuration. You can do this under the "Configure" menu, which is located on the corresponding integration catalog item.

![](/img/console/blocklists/integrations/refresh_credentials.png)
