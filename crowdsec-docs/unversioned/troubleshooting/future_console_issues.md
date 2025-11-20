---
title: Future Console Health Check Issues
id: future_console_issues
---

This page lists potential health check issues and recommendations that may be added to the CrowdSec Console in future versions. These are categorized by type and priority to help guide feature development.

:::info
These features are planned or under consideration and are not yet available in the Console. This documentation is maintained for planning purposes.
:::

## Overview

This page documents **17 future issues** across four main categories:

- **Configuration Issues** (4 issues) - Initial setup and component configuration
- **Maintenance & Updates** (4 issues) - Version updates and collection management
- **Configuration Validation** (3 issues) - Detecting misconfigurations and optimization opportunities
- **Premium Features & Enhancements** (6 issues) - Value-added features and intelligent upgrade recommendations

## Configuration Issues

### No Security Engine or Blocklist Integration Configured

- **Criticality**: 💡 Recommended
- **Trigger**: Organization has neither Security Engines (LAPI) nor Blocklist-as-a-Service (BLaaS) integrations configured
- **Description**: Account is set up but has no active detection or blocklist infrastructure
- **Impact**: No threat detection or proactive blocking capabilities
- **Category**: Initial Configuration

### No Scenarios Installed

- **Criticality**: 🔥 Critical
- **Trigger**: Security Engine has zero scenarios installed
- **Description**: No detection rules configured to identify threats
- **Impact**: Even if logs are parsed, no alerts can be generated
- **Category**: Configuration

### No Notification Channels Configured

- **Criticality**: 💡 Recommended (bonus for Premium users)
- **Trigger**: No notification integrations configured for Console alerts
- **Description**: User won't receive proactive notifications about stack health issues
- **Impact**: Delayed response to critical problems
- **Notes**: Recommended as a Premium feature benefit
- **Category**: Configuration

### Alert Context Not Activated

- **Criticality**: 💡 Recommended
- **Trigger**: Alert context enrichment is disabled in Console settings
- **Description**: Missing valuable CTI context data for alert analysis
- **Impact**: Reduced threat intelligence and harder troubleshooting
- **Category**: Configuration Enhancement

## Maintenance & Updates

### Security Engine Version Outdated

- **Criticality**: 💡 Recommended
- **Trigger**: Security Engine running an older version when a new stable release is available
- **Description**: Missing bug fixes, performance improvements, security patches, and new features
- **Impact**: Potential vulnerabilities, reduced performance, or missing functionality
- **Requirements**: Version reporting from Security Engine, release tracking system
- **Notes**: Could highlight major version upgrades separately (e.g., 1.6.x → 1.7.x with significant new features)
- **Category**: Maintenance

### Remediation Component Version Outdated

- **Criticality**: 💡 Recommended
- **Trigger**: Active remediation components (bouncers) running outdated versions
- **Description**: Remediation components missing features, bug fixes, or security patches from newer releases
- **Impact**: Reduced remediation effectiveness, potential vulnerabilities, or missing compatibility
- **Requirements**: Bouncer version reporting from FOSS/backend, release tracking for all bouncer types
- **Category**: Maintenance

### Collection Version Outdated

- **Criticality**: 💡 Recommended
- **Trigger**: Installed collections have newer versions available on the Hub
- **Description**: Using outdated detection rules and parsers, potentially missing scenarios from updated collections
- **Impact**: Missing newer attack patterns, parser improvements, and additional scenarios added to collection
- **Requirements**: Hub version comparison, backend processing
- **Notes**: Includes detecting when collection on Hub has new scenarios not present in installed version
- **Category**: Maintenance

### Incomplete Scenario Installation from Collection

- **Criticality**: ⚠️ High
- **Trigger**: Scenarios installed but not representing the complete collection (missing scenarios compared to Hub collection definition)
- **Description**: Partial collection installation leaves detection gaps
- **Impact**: Reduced detection coverage for specific attack types within the collection scope
- **Requirements**: Collection definition comparison between installed and Hub versions
- **Category**: Configuration Validation

## Configuration Validation & Optimization

### Acquisition and Collection Mismatch

- **Criticality**: 💡 Recommended
- **Trigger**: Collection installed (e.g., nginx) but no corresponding acquisition configuration for that log type
- **Description**: Detection rules installed but no logs being collected to trigger them
- **Impact**: Wasted resources, collection cannot function as intended
- **Example**: NGINX collection installed but no nginx access logs configured in acquisition
- **Category**: Configuration Validation

### Long-Duration Decisions

- **Criticality**: 🌟 Bonus (informational)
- **Trigger**: Active decisions with TTL exceeding threshold (e.g., 30+ days)
- **Description**: Very long bans may indicate manual decisions that should be reviewed
- **Impact**: No direct functional impact but may need periodic review
- **Notes**: Informational alert for housekeeping
- **Category**: Maintenance

### Decisions Against Legitimate IPs

- **Criticality**: ⚠️ High
- **Trigger**: Active decisions against known legitimate IP ranges (Let's Encrypt, CDN providers, cloud services, etc.)
- **Description**: Potentially blocking legitimate service traffic
- **Impact**: Service disruption (e.g., SSL certificate renewal failures, CDN issues, API connectivity problems)
- **Requirements**: Maintained database of known legitimate IP ranges and services
- **Category**: False Positive Prevention

## Premium Features & Intelligent Recommendations

### Alert Volume Over Free Quota

- **Criticality**: 🌟 Bonus (informational/upgrade opportunity)
- **Trigger**: Alert volume approaching or exceeding free tier limits
- **Description**: High alert activity may benefit from Premium tier features
- **Impact**: Opportunity to upgrade for enhanced capabilities
- **Notes**: Informational nudge toward Premium upgrade for heavy users
- **Category**: Upgrade Opportunity

### Notification Overload - Premium Recommended

- **Criticality**: 💡 Recommended
- **Trigger**: Community user with multiple Security Engines OR high alert/activity volume
- **Description**: Complex setup would benefit from notification channels to track issues across infrastructure
- **Impact**: Missing visibility across distributed deployment or high-activity environment
- **Notes**: Highlight Premium notification features for managing complex deployments
- **Category**: Enhancement - Upgrade Opportunity

### AIUA Not Activated (Premium User)

- **Criticality**: 💡 Recommended
- **Trigger**: Premium tier user without "Am I Under Attack" (AIUA) feature enabled
- **Description**: Premium feature not utilized despite availability
- **Impact**: Not leveraging paid feature for automated attack detection and response
- **Notes**: Premium feature - ensure paid users activate available capabilities
- **Category**: Premium Feature Activation

### AIUA Not Activated (Community User)

- **Criticality**: 🌟 Bonus (informational)
- **Trigger**: Community tier user without AIUA enabled
- **Description**: Missing automated attack detection available in Premium tiers
- **Impact**: Manual attack detection vs automated Premium feature
- **Notes**: Possible upgrade to Premium for automated attack detection
- **Category**: Enhancement - Upgrade Opportunity

### High-Value Blocklist Available (Same Tier - >30%)

- **Criticality**: 💡 Recommended
- **Trigger**: Blocklist with >30% protection prediction (Alakazam score) available for user's current tier but not subscribed
- **Description**: High-impact blocklist available at current subscription level could significantly improve protection
- **Impact**: Missing substantial proactive threat blocking opportunity
- **Requirements**: Alakazam efficiency prediction calculation based on user's threat profile
- **Example**: Community user not subscribed to high-efficiency free blocklist, or Premium user not using available Premium blocklist
- **Category**: Enhancement - Optimization

### High-Value Blocklist Available (Upper Tier - >30%)

- **Criticality**: 🌟 Bonus (informational/upgrade opportunity)
- **Trigger**: Premium/Platinum blocklist with >30% protection prediction available in higher tier
- **Description**: Significant protection improvement available through tier upgrade
- **Impact**: Major reduction in attack surface through proactive blocking
- **Requirements**: Alakazam efficiency prediction showing concrete benefit of upgrade
- **Example**: Community user could block 35% of threats with Premium BL, or Premium user could block 40% with Platinum BL
- **Notes**: Data-driven upgrade showing measurable security benefit of upgrading
- **Category**: Enhancement - Upgrade Opportunity

## Criticality Levels Explained

### Critical

Issues that represent complete failure of core functionality. Immediate attention required.

### High

Important issues that should be addressed soon. May significantly impact protection effectiveness.

### Recommended

Improvements that would enhance security posture or operational efficiency. Should be addressed when possible.

### Bonus

Informational, optimization opportunities, or value-demonstration items. Low priority but helpful for optimization, housekeeping, or demonstrating ROI/upgrade value.

## Key Features

### Alakazam Protection Prediction

The **Alakazam scoring system** analyzes your specific threat profile (alerts, attack patterns, geographic sources) and calculates the **predicted effectiveness** of each blocklist:

- **>30% threshold**: Significant protection improvement recommended
- **Personalized**: Based on your actual threat landscape, not generic statistics
- **Tier-aware**: Shows both same-tier optimizations and upgrade opportunities
- **Data-driven upgrade**: Concrete, measurable benefit (e.g., "Block 35% of your threats preemptively")

### Smart Collection Management

- **Version tracking**: Detect when Hub collections gain new scenarios
- **Acquisition alignment**: Ensure installed collections match your log sources
- **Completeness validation**: Identify partial installations missing key scenarios

## Implementation Requirements

These future issues require:

- **Version Tracking**: Security Engine, bouncer, and Hub collection version reporting
- **Alakazam Prediction Engine**: Personalized blocklist efficiency scoring based on user's threat profile
- **Legitimate IP Database**: Curated list of known good IPs (CDNs, certificate authorities, cloud providers)
- **Collection Definition Comparison**: Track scenario additions/changes in Hub collections
- **Activity Metrics**: Alert volume, Security Engine count, notification usage patterns

## Related Pages

- [Current Console Health Check Issues](/u/troubleshooting/console_issues) - Issues currently available in the Console
- [Troubleshooting Overview](/u/troubleshooting/intro) - General troubleshooting resources

## Feedback

These future issues are based on user feedback and operational insights. If you have suggestions for additional health checks or recommendations, please:

- Share on [Discourse](https://discourse.crowdsec.net/)
- Join the discussion on [Discord](https://discord.gg/crowdsec)
- Open an issue on [GitHub](https://github.com/crowdsecurity/crowdsec-docs/issues)
