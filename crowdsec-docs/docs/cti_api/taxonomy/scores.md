---
id: scores
title: CrowdSec CTI Scores
sidebar_position: 3
---



The scores are indicators of malevolence associated with an IP address, computed over several periods of time : 1 day, 1 week, 1 month and overall. 
 
For a given period, the indicator of malevolence is summarized under the `total` key with a value ranging from **0** (no reports) to **5** (high malevolence). 
 
This value is a summary based on 4 components (see below) also ranging from **0** (Not Applicable/ Missing) to **5** (High), comparing to all the the signals reported by the community.

| indicator | explaination |
|-----------|--------------|
|Aggressiveness | _What is the intensity of the attack?_ This component measures the number of attacks reported over a period of time. |
|Threat Level | _How serious is the type of threats reported?_ The category of attacks reported by the community defines the danger induced by the attacks. An IP known for crawling and scanning will have a lower threat level than an IP reported for brute-force and exploits. This score ranges from 1 (mainly crawling) to 5 (exploit). 0 is the default for unknown scenarios |
|Trust| _What is the level of confidence in the actors which reported the IP address?_ This component is based on the reputation (age, number of reports) and the diversity (number of IP ranges, AS Numbers) of all the actors reporting the IP. It ranges from **0** (low\_confidence) to **5** (high confidence). |
| Anomaly |  _What are the red flags associated with this IP address?_ It analyses the static description of the reported IP address and checks for red flags which can be linked to evidence of malicious activities |
| Total | Aggregation of 4 component calculated on threats reported by the community and described below. |


The `ip_range_score` is the score of malevolence associated with an IP range, ranging from *0* (No IP reported) to *5* (massively reported). It is calculated based on the number of IPs belonging to this range that were reported by the community as malicious
