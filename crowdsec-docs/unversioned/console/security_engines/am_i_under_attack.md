---
title: 🏅 Am I Under Attack
description: Alerting you when a surge of attack is hitting you
---

## Introduction

> 🌟 **Premium Feature**

The **"Am I Under Attack?"** feature enables enterprise organizations’ owners to receive real-time alerts about potential cyber threats and attack surges. By detecting unusual attack patterns and notifying security teams immediately, this feature helps mitigate risks and reduce response time, ensuring that your team focuses on significant anomalies without being overwhelmed by routine notifications.

This feature can be easily enabled or disabled, and once activated, it will continuously monitor and alert you of attack surges detected in your infrastructure.

## How to Activate the "Am I Under Attack?" Feature

To begin receiving alerts from the **Am I Under Attack?** feature, follow these steps:

1. Navigate to the **Alerts** section on the Console.
2. Locate the **"Am I Under Attack?"** switch, shown below, and toggle it to the "on" position to enable notifications.

![Am I Under Attack? Switch](/img/console/alerts/am-i-under-attack-switch.png)

Once the feature is activated, you will start receiving real-time notifications for targeted attack surges against your organization.

### Console notification in global Alerts view

When an attack is detected, the Console will display a red banner at the top of the screen, as shown in the screenshot below, indicating that a targeted attack has been identified. This serves as an immediate visual cue to investigate further.

![Global Alerts View](/img/console/alerts/am-i-under-attack-global-alerts-view.png)

The **Visualizer** will help you analyze these attacks based on source IPs, targeted security engines, and specific scenarios, allowing you to dive into the attack patterns.

## How it Works (Detailed)

The **"Am I Under Attack?"** feature continuously monitors the attack signal stream in your organization and analyzes signal surges. These surges are defined by comparing current signal rates to historical data, using a 15-minute observation window against a 4-hour reference window. When the volume of signals exceeds the expected threshold (four times the interquartile range), an alert is triggered.

Alerts can be delivered through various channels, including email and future integrations with EventBridge-compatible services like Slack, Splunk, and more.

### Benefits

- **Enhanced Reaction Time**: Immediate alerts enable faster response to attacks.
- **Reduced Manual Oversight**: Automated detection of attack surges reduces the need for constant monitoring.
- **Seamless Integration**: Alerts can be integrated into existing security systems, simplifying management.

### Notifications and Integrations

- **Email Notifications**: By default, email alerts will be sent to the organization’s owner and admins.
- **EventBridge**: Future releases will support additional integrations with systems such as Coralogix, Datadog, MongoDB, Slack, and more, offering flexibility in managing alerts. (contact us if you're interested in a specific integration)

## Key Considerations

There are a few limitations and upcoming improvements to be aware of:

- **Delay in Alerts**: Attack surge alerts are triggered after a 10-15 minute delay to minimize false positives.
- **Non-Configurable Sensitivity**: The detection algorithm’s sensitivity is fixed in this version but will be adjustable in future releases.
- **Seasonality**: The system does not yet account for recurring seasonal attack patterns, which could trigger unnecessary alerts.

---

