---
title: Background Noise Filtering
description: Focus on alerts that matter.
---

The back noise filter is designed to eliminate irrelevant background sounds, enabling users to concentrate on important alerts.

> 🌟 Premium feature

### Introduction

We define Background Noise (BN), sometimes also referred to as “Internet Background Radiation” is an automatic and mild attack perpetrated on a large scale, without a specific target, at a constant pace over time. It includes, for example, mass scanning or brute-force attempts on popular services and is not specific to one domain or infrastructure in particular. Get more information [there](https://www.crowdsec.net/blog/background-noise-filter-available-crowdsec-console).

### Activate Noise cancelling

Adjacent to the filter options, you'll find a "Reduce Noise" toggle. Activating this **will filter out the noise, isolating alerts most likely irrelevant to your specific context**. In the following example, a significant portion of alerts—74.14%, to be precise—fall into this category of background noise. By enabling this feature, **we can concentrate our efforts on the remaining 25.86% of alerts, which are more likely to target your network or system directly**.

![Background Noise Filtering](/img/console/alerts/background-noise-activate.png)

This targeted approach ensures you're not overwhelmed by the volume of information and can allocate your resources more efficiently towards mitigating threats that pose a real and immediate risk to your security. Engage with this feature to transform your alert management strategy, focusing on precision and relevance over quantity.

### Customizable Noise Filter Settings

The ability to fine-tune your alert system’s sensitivity to background noise is a game-changer in cybersecurity monitoring. Our customizable noise filter settings give you control over what you deem relevant.

- **Low Cancellation**: Setting the filter to a lower sensitivity allows all alerts, including the most widespread, to be visible. This setting ensures you miss nothing, providing a broad security net.
- **High Cancellation**: Increasing the filter’s sensitivity sharpens your focus on alerts from IPs directly targeting your network. This refined approach is critical for those who wish to concentrate on direct threats, significantly reducing the volume of alerts to those with the highest relevance.

![Background Noise Filtering](/img/console/alerts/background-noise-finetune.png)

Our analysis found that alerts holding less than 50% noise are the most valuable. This sweet spot ensures you are alerted to potential threats with a high likelihood of impacting your network directly, allowing for a more strategic and efficient response to cyber threats.
