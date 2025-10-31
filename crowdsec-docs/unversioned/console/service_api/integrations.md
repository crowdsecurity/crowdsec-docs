---
id: integrations
title: Integrations
---

## Integration supported formats

For some constructors, the integrations can generate vendor-specific format, see table below:

| Constructor | Authentication | Multiple URLs | Constructor Doc                                                                                                                                                                              | Format       |
| ----------- | -------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| CheckPoint  | Basic Auth     | Yes           | [CheckPoint doc](https://support.checkpoint.com/results/sk/sk132193)                                                                                                                              | `checkpoint` |
| Cisco       | Basic Auth     | Yes           | [Cisco doc](https://www.cisco.com/c/en/us/td/docs/security/secure-firewall/management-center/device-config/710/management-center-device-config-71/objects-object-mgmt.html#ID-2243-00000291) | `cisco`      |
| F5          | Basic Auth     | Yes           | [F5 doc](https://techdocs.f5.com/kb/en-us/products/big-ip-afm/manuals/product/big-ip-network-firewall-policies-and-implementations-14-0-0/07.html )                                          | `f5`         |
| Fortinet    | Basic Auth     | Yes           | [Fortinet doc](https://docs.fortinet.com/document/fortigate/6.4.5/administration-guide/891236/external-blocklist-policy)                                                                     | `fortigate`  |
| Palo alto   | Basic Auth     | Yes           | [PaloAlto doc](https://docs.paloaltonetworks.com/pan-os/11-1/pan-os-admin/policy/use-an-external-dynamic-list-in-policy/configure-the-firewall-to-access-an-external-dynamic-list)           | `paloalto`   |
| Sophos      | Basic Auth     | Yes           | [Sophos doc](https://docs.sophos.com/nsg/sophos-firewall/latest/Help/en-us/webhelp/onlinehelp/AdministratorHelp/ActiveThreatResponse/ConfigureFeeds/ThirdPartyThreatFeeds/index.html)                         | `sophos`     |


For all the other providers, the `plain_text` format consists of one ip per line, and should be supported by most devices. If a specific format is missing, reach out to us and we'll help you support it!

## Managing integrations size limits with pagination

Some firewalls or security devices impose strict limits on how many IP addresses can be imported or processed from an external blocklist. When a blocklist exceeds these limits, it can lead to incomplete imports or failures during updates. To address this, CrowdSec integrations support pagination, allowing you to fetch IPs in manageable chunks.

### Why pagination matters

Pagination ensures that large blocklists are retrieved and processed efficiently by splitting them into smaller segments. This helps:

* Avoid exceeding the maximum number of entries a firewall can handle per list.
* Maintain reliable updates without API timeouts.
* Improve performance when synchronizing IPs from CrowdSec.

### How pagination works

You can control pagination using two query parameters in the integration API URL:

* `page`: The current page number (starting from 1).
* `page_size`: The number of IP addresses to include per page.

Example request:

```
GET https://admin.api.crowdsec.net/v1/integrations/123/content?page=1&page_size=1500
```

* The above request retrieves the first 1,500 IPs in the list.
* To fetch the next batch, increment the page parameter:

```
GET https://admin.api.crowdsec.net/v1/integrations/123/content?page=2&page_size=1500
```

Repeat this process until no new results are returned.

### Example use case (Palo Alto firewall)

A Palo Alto firewall may limit external dynamic lists between 50,000 and 150,000 entries depending on the model. If your CrowdSec blocklist exceeds this limit, you can set `page_size` to 50,000 and iterate through pages until all IPs are retrieved.

1. Start with `page=1` and `page_size=50000`.
2. Add the dynamic list to the firewall.
3. Increment the `page` parameter and add the new dynamic list.
4. Repeat until all IPs are processed.


### Pro Tip

When you know the maximum number of entries your device can handle, and you want to calculate the number of pages needed, you will also need to know the total number of IPs in your integration. You can get this information from the [integration details page](https://app.crowdsec.net/blocklists/integrations), where you can find the "Total IPs" count. Then, use the following formula:

```
number_of_pages = ceil(total_ips / page_size)
```
