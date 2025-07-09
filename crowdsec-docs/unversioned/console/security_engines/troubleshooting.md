---
title: Troubleshooting Hints
description: Troubleshooting Security Engines
---

This feature simplifies cybersecurity management by providing a quick, comprehensive view of Security Engines requiring immediate action. It's designed for efficiency, enabling you to identify critical issues such as outdated or inactive components with just one click. This functionality ensures streamlined, focused security maintenance, ideal for teams with many servers to monitor simultaneously.

This feature will detect the following behaviors needing your remediation attention:

- **Inactive Remediation component**: Inactive Remediation Components detected. Affected Security Engines may be unprotected. Please review for possible Engine or machine configuration issues.
- **No alerts received within the last 24 hours**: Security Engines have not shared alerts during the previous 24 hours. This could indicate an issue with your machine or monitoring setup. Please validate your setup.
- **Security Engines to update**: Security Engines are out of date. This may compromise your security. Please update to the latest version as soon as possible.

## Usage

To access the Troubleshooting feature, follow these steps:

1. Navigate to the **Security Engines** page.
2. Reaching the page automatically generates a **report** at the top of your engine list.

![Troubleshooting](/img/console/security_engines/troubleshooting-report.png)

3. You can directly filter on the troubleshooting type by clicking on the **"X engine(s)"** button

![Troubleshooting](/img/console/security_engines/troubleshooting-report-filter.png)

4. The example below shows that all engines require maintenance. A non-working remediation component could be critical.

![Troubleshooting](/img/console/security_engines/troubleshooting-report-filtered-page.png)

### Summary view

The summary view provides a quick overview of the issues detected on your Security Engines. By default, the Troubleshoot report is in an **"Extended"** view. You switch to a smaller view called **"Summary"**.

1. Navigate to the **Security Engines** page.
2. Click the icon in the top right corner of the report.

![Troubleshooting](/img/console/security_engines/troubleshooting-summary-button.png)

3. You can view the **Summary** now. Clicking the button will filter by troubleshooting type.

![Troubleshooting](/img/console/security_engines/troubleshooting-summary-view.png)
