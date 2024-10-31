---
id: scores
title: CTI Scores
sidebar_position: 3
---



While CrowdSec already provides ready-made scores for common usecases such as background noise score, the scores in this section offer a more in-depth breakdown of the information we have collected about an IP. They can be used both to help categorize alerts and to build internal products for your organizations needs. These scores are indicators of malevolence associated with an IP address, computed over several periods of time : 1 day, 1 week, 1 month and overall. 
 
For a given period, each indicator is provided with a value ranging from **0** (lowest value) to **5** (highest value). The following table describes the indicators in more detail.

| indicator | explaination |
|-----------|--------------|
|Aggressiveness | _What is the intensity of the attack?_ <br /> This component measures the number of attacks reported over a period of time. |
|Threat | _How dangerous are the attacks?_ <br /> This component measures how dangerous an IP is based on the type of attacks we usually see it attempt. An IP known for crawling and scanning will have a lower threat level than an IP reported for brute-force and exploits. This score ranges from 1 (mainly crawling) to 5 (exploit). 0 is the default for unknown scenarios |
|Trust| _What is the level of confidence in the actors which reported the IP address?_ <br /> This component measures the degree of trust we have in the reports that we received about this IP. It is based on the reputation (age, number of reports) and the diversity (number of IP ranges, AS Numbers) of all security engines reporting the IP. |
| Anomaly |  _Are there any red flags associated with the device behind this IP address?_ <br /> This score is based on static properties of the machine behind the IP. For instance a machine exposing old and vulnerable software will have a high anomaly score. |
| Total | Aggregation of the 4 components above. |

For a more in-depth explanation on how we compute these scores, refer to our [blog article](https://www.crowdsec.net/blog/crowdsec-cti-scoring-system).

The `ip_range_score` is the score of malevolence associated with an IP range, ranging from *0* (No IP reported) to *5* (massively reported). It is calculated based on the number of IPs belonging to this range that were reported by the community as malicious
