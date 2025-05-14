---
title: Archiving a Security Engine
description: Archiving a Security Engine
---

Archiving a Security Engine allows you to deactivate it without losing historical alerts. This can be helpful when an engine is no longer actively used but you still want to retain its historical context and alerts for future analysis.

In the case of Enterprise plans, an archived engine does not count as a used slot.

When archived, the Security Engine will:

-   Stop reporting new alerts.
-   Be un-enrolled from the CrowdSec Console.
-   Remain available for historical consultation. All previously generated alerts from this engine remain accessible from the Alerts page.

## How to Archive a Security Engine

### Manually archiving a Security Engine

1.Go to the Security Engines page

2.Click on the three-dot menu (⋮) next to the Security Engine you wish to archive.

3.Select _Archive Security Engine_ from the dropdown menu.

![Archive Engine](/img/console/security_engines/archive-menu.png)

4.Confirm the archival by clicking the _Archive_ button in the confirmation dialog. The dialog clearly indicates that alerts will remain accessible even after archiving.

![Archive modal](/img/console/security_engines/archive-modal.png)

### Auto-archiving of Security Engines

The CrowdSec Console also offers an auto-archiving feature based on inactivity. You can configure this policy from the Security Engines section in the console settings, where you can specify a duration of inactivity after which the engine is automatically archived.

This feature helps maintain an organized workspace by automatically managing Security Engines that have ceased generating alerts, ensuring your active view remains relevant and uncluttered. All auto-archived engines retain their historical alerts, accessible through the Alerts page.

![settings auto archiving](/img/console/security_engines/settings-se-section.png)

## Viewing Archived Security Engines

To see your archived Security Engines locate and check the option labeled _Show only archived_.
Archived engines will appear in a greyed-out, read-only state.

> Please note that the Console will no longer be synchronized with archived Security Engines. This means that blocklists, scenarios and remediation components counters will always be 0.

![Show archived Engine](/img/console/security_engines/archived-option.png)

## Restoring an Archived Security Engine

If you wish to restore an archived Security Engine, simply re-enroll the Security Engine by executing the enrollment command again from your server.

**IMPORTANT**: Add the `--overwrite` flag to the enrollment command in order to replace the current status in the Console.

## Permanently Deleting an Archived Security Engine

If you decide to completely remove an archived Security Engine:

1. Make sure you have selected Show only archived.
2. Click the trash icon (🗑️) located in the top-right corner of the Security Engine card.
3. Confirm deletion when prompted. This action will permanently remove all associated data and alerts.

![Show archived Engine](/img/console/security_engines/delete-archived.png)
