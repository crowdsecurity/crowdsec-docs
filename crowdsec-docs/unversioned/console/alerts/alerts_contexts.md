---
title: Alerts Context
description: Understanding the alerts context in the CrowdSec Console
---

In specific scenarios, there might be a lack of context in alerts due to centralizing logs on one server. CrowdSec does not store raw log information after processing is completed. Additional data can be included within an alert using the alert context feature. Configuration can be done using the provided [documentation](/user_guides/alert_context.md).

## Usage

By default, the column that displays alert contexts through tags is hidden to maintain a clean and focused interface. This column can be enabled for those wishing to view all contextual tags associated with each alert for a more detailed overview. Instructions for enabling this feature are as follows:

![Alerts Context](/img/console/alerts/alerts-context.png)

![Alerts Context](/img/console/alerts/alerts-context-2.png)

Now, the Alerts Table will refresh to display the selected column, providing a comprehensive view of all contextual tags associated with each alert and enhancing the ability to monitor and respond to security threats effectively.

### Comfortable mode

Comfortable View Mode expands the view of each alert to display all associated tags inline. This mode provides a more comprehensive, at-a-glance understanding of each alert's context without navigating each alert individually.

To activate Comfort View Mode, toggle the "Comfort View" switch above the Alerts Table or in your user settings. Once activated, the Alerts Table will refresh to display all tags associated with each alert directly in the table's view.

![Alerts Context](/img/console/alerts/alerts-context-comfort.png)

![Alerts Context](/img/console/alerts/alerts-context-comfort-2.png)

### More filtering

Filtering alerts by context is a powerful feature that enables the focus on alerts that are most relevant to current security concerns.

- **Direct Filter**: A filter based on that tag is applied by clicking on a tag in the Alerts Table. The table immediately updates to display only the alerts associated with the selected tag.
- **Exclude Filter**: To exclude alerts associated with a specific tag, clicking on the tag and selecting "Exclude" from the menu will update the table to show all alerts except those associated with the excluded tag.
- **Copy Tag Value**: For purposes such as reporting or further investigation, the value of a tag can be copied by clicking on the tag and selecting "Copy Context Value". This action copies the tag's text to the clipboard.

![Alerts Context](/img/console/alerts/alerts-context-filter.png)
