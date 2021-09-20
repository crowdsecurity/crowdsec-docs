---
id: console
title: Console
sidebar_position: 10
---

The [console](https://app.crowdsec.net) is a web interface hosted by us that allows you to get even more from our solution:
 - aggregate, tag and classify your instances (without having them share a common local API)
 - view, filter, export alerts in real time
 - get statistics, analyctics and insights regarding your alerts
 - organization management features
 - MFA
 - and much more

![console-overview](/img/console-overview.png)

Once your [registration is done](https://app.crowdsec.net/signup), follow the tour!


You will be able to register any instance directly from `cscli`:

```bash
sudo cscli console enroll <id> 
```

And see what's going in the console:

![instance-overview](/img/console-instance-overview.png)



![stats-overview](/img/console-stats-overview.png)
