---
id: scores
title: Scores
sidebar_position: 3
---

## Understanding CrowdSec CTI Scores

While CrowdSec provides general scores for common use cases, this section offers a deeper breakdown of IP-related data.

These scores help categorize alerts and can be used to build internal products tailored to your organization's needs.

They serve as indicators of malevolent activity associated with an IP address, computed over several periods: 1 day, 1 week, 1 month, and overall.

Each score is measured on a scale from **0** (lowest) to **5** (highest). Below is an overview of the main score components:

| Indicator          | Explanation                                                                                                                                                                                                                                                                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Aggressiveness** | _How intense is the attack?_ <br /> Measures the frequency of attacks within a given time period. A higher score indicates a greater number of attack attempts, signaling aggressive behavior or persistent targeting over time.                                                                                                           |
| **Threat**         | _How dangerous are the attacks?_ <br /> Reflects the severity of the attacks, ranging from low-risk activities like scanning to high-risk behaviors like exploiting vulnerabilities. A higher score means the IP is associated with more dangerous tactics.                                                                                |
| **Trust**          | _How reliable is the information about the IP?_ <br /> Based on the credibility of the reporting sources. This score considers factors like the age of the reports, how many different security engines flagged the IP, and the diversity of the reports. A higher score indicates more trust in the accuracy and reliability of the data. |
| **Anomaly**        | _Are there any suspicious behaviors associated with the device behind this IP?_ <br /> Evaluates red flags like outdated software, unusual configurations, or other traits that could indicate a compromised or malicious device. A higher score suggests more alarming anomalies linked to the IP.                                        |
| **Total**          | Combines the scores of the above four components to give an overall malevolence score. The higher the total, the more likely the IP is associated with malicious activity indicators.                                                                                                                                                      |

For a more detailed explanation on how we calculate these scores, read our [blog article](https://www.crowdsec.net/blog/crowdsec-cti-scoring-system).

### IP Range Score

The `ip_range_score` reflects the malevolence of an entire IP range, ranging from _0_ (no reports) to _5_ (highly reported).

It is based on the number of IPs in the range that have been flagged as malicious by the CrowdSec community.

The more IPs from the same range are reported, the higher the score, indicating a greater likelihood that the range is associated with malicious activity.
