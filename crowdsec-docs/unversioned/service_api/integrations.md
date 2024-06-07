---
id: integrations
title: Integrations
---

## Integration supported formats

For some constructors, the integrations can generate vendor-specific format, see table below:

| Constructor | Authentication | Multiple URLs | Constructor Doc                                                                                                                                                                              | Format       |
| ----------- | -------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| Fortinet    | Basic Auth     | Yes           | [Fortinet doc](https://docs.fortinet.com/document/fortigate/6.4.5/administration-guide/891236/external-blocklist-policy)                                                                     | `fortigate`  |
| Palo alto   | Basic Auth     | Yes           | [PaloAlto doc](https://docs.paloaltonetworks.com/pan-os/11-1/pan-os-admin/policy/use-an-external-dynamic-list-in-policy/configure-the-firewall-to-access-an-external-dynamic-list)           | `paloalto`   |
| CheckPoint  | Basic Auth     | Yes           | [CheckPoint doc](https://support.checkpoint.com/results/sk/sk1)                                                                                                                              | `checkpoint` |
| Cisco       | Basic Auth     | Yes           | [Cisco doc](https://www.cisco.com/c/en/us/td/docs/security/secure-firewall/management-center/device-config/710/management-center-device-config-71/objects-object-mgmt.html#ID-2243-00000291) | `cisco`      |
| F5          | Basic Auth     | Yes           | [F5 doc](https://techdocs.f5.com/kb/en-us/products/big-ip-afm/manuals/product/big-ip-network-firewall-policies-and-implementations-14-0-0/07.html )                                          | `f5`         |


For all the other providers, the `plain_text` format consists of one ip per line, and should be supported by most devices. If a specific format is missing, reach out to us and we'll help you support it!

## Dealing with blocklist size limits

Some providers have technical limits on the number of IPs they can pull at once. That's why we recommand to monitor the number of IPS returned by the integration and use the pagination feature if needed. For this, you can use the page and page_size query parameters in the URL.

https://admin.api.dev.crowdsec.net/v1/integrations/123/content?page=1&page_size=1500

You can then use the page parameter to get the next page of IPs.

