# Blocklist Details

To assist in deciding which blocklists to implement on your infrastructure, various statistics are available, offering a detailed insight into the benefits of using the Blocklist.

### Metrics

The first section gives info about the popularity of the list among CrowdSec users

*   A new feature to give the possibility to rate a list when installed is under development
*   The number of users who have subscribed to the list
*   The amount of IPs that have been seen by the CrowdSec Community vs the amount that are in the list

![](/img/console/blocklists/popularity.png)

### Data Insights

![](/img/console/blocklists/data_insights.png)

The following insights use two main approaches to demonstrate the overall quality of the data provided by the list:

*   The frequency and impact of updates
*   The quality of the content can be composed of 4 different metrics:
    *   For curated third-party blocklists, the number of IPs removed due to being identified as [false positives](/cti_api/taxonomy/false_positives.mdx) by CrowdSec.
    *   The quantity of IPs that are also present in the CrowdSec Intelligence blocklist (LINK to CSI explanation).
    *   The number of IPs that have been reportedly seen by CrowdSec agents.
    *   The amount of IPs unique to this blocklist, not present in any other blocklist.

:::info
While exploring the Console, you can hover on the information circles next to each metric to get a refresher on what they signify.
:::

:::info
Hovering over the circled graph displays the precise percentage of items related to the statistic.
:::

![](/img/console/blocklists/exclusivity.png)

### Blocklist Insights

![](/img/console/blocklists/data_chunk.png)

* Top [behaviors](/cti_api/taxonomy/behaviors.mdx) in the list
* Top [classifications](/cti_api/taxonomy/classifications.mdx) in the list
* Most reported IP's in the blocklist (You can click on the IP to search for it in the CrowdSec CTI)
* Most reported ASN's in the blocklist 

The content of the blocklist is enriched against CrowdSec CTI to provide high-value meta-data about the most aggressive actors listed by the Blocklist.
