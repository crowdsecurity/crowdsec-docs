# Blocklist details

To help decide to install a blocklist on your infrastructure, many figures are provided to give a comprehensive view of the value provided by the Blocklist

  

### Popularity of the blocklist

  

The first section gives info about the popularity of the blocklist among CrowdSec users

  

*   A new feature to give the possibility to rate a blocklist when installed is under development
*   The number of users who have subscribed to the blocklist.
*   The last card shows the number of IPs present in the blocklist versus the number of IPs

![](/img/console/blocklists/popularity.png)

  

### Quality of the blocklist

![](/img/console/blocklists/data_insights.png)

The following metrics use two main approaches to demonstrate the overall quality of the data provided by the blocklist:

*   The frequency and impact of updates
*   The quality of the content can be composed of 4 different metrics:
    *   For third-party blocklists, the number of IPs removed due to being identified as false positives by CrowdSec.
    *   The quantity of IPs that are also present in the CrowdSec Intelligence blocklist (LINK to CSI explanation).
    *   The number of IPs that have been reportedly seen by CrowdSec agents.
    *   The amount of IPs unique to this blocklist, not present in any other blocklist.

:::info
 When navigating on the Console, info circles next to each metric can be clicked to have a reminder of the meaning.
 :::

:::info
Hovering the circled graph gives the accurate percentage of items concerned by the stat.
:::

![](/img/console/blocklists/exclusivity.png)

  

### Portions of the blocklist content

![](/img/console/blocklists/data_chunk.png)

The content of the blocklist is enriched against CrowdSec CTI to provide high-value meta-data about the most aggressive actors listed by the Blocklist.