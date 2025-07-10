---
title: Select multiple organizations 🧪
description: Learn how to select multiple organizations to all their Security Engines in the CrowdSec Console
---

> 🧪 Beta users only

The Multi-organization selection feature allows monitoring engines across multiple organizations. This centralization simplifies the oversight of numerous security systems, making maintaining a high level of security effectiveness easier. This feature ensures you can promptly address the most pressing security concerns without navigating multiple systems or interfaces.

## Usage

To use the multi organization selection, these steps should be followed:

1. Navigate to the **Security Engines** page.
2. Click on the following button to select multiple organizations:

![Select multiple organizations](/img/console/security_engines/select-multiple-organizations-button.png)

3. Click on it to see a modal appear, then select various organizations and click on the confirm button:

![Select multiple organizations modal](/img/console/security_engines/select-multiple-organizations-modal-1.png)
![Select multiple organizations modal](/img/console/security_engines/select-multiple-organizations-modal-2.png)

4. The list will automatically update to display only the engines that match the search criteria.

![Select multiple organizations modal](/img/console/security_engines/select-multiple-organizations-list.png)

The [**"Troubleshooting"**](/u/console/security_engines/troubleshooting) feature is also applied to multiple organizations. Allowing us to find issues directly across all selected organizations.

![Select multiple organizations modal](/img/console/security_engines/select-multiple-organizations-troubleshooting.png)

### Good to know

Foreign Security Engines are not updatable as they are not in the current Organization. To update them, you need to switch to the Organization where the engine is located.

![Select multiple organizations modal](/img/console/security_engines/select-multiple-organizations-foreign-engine.png)

Clicking on a foreign Security Engine Name will switch to the correct organization and redirect to the Security Engine details page.
