---
id: decisions
title: Decisions Management
sidebar_position: 1
---

## Console Management

CrowdSec Local API is able to receive or delete local decisions from the Console.


### Adding decision

From the Console, it is possible to add a decision for your whole organization, for instances that belong to a tag or to one or more instances.

 - Click on the "Add a decision" button in the "Decisions" tab:

![Add decision button](/img/add_decision_button.png)

 - Then enter the IP address you want to ban, the remediation type, the duration, a reason and select the target of this decision:
>In this example, we are adding a __ban__ decision on __192.168.1.1__ for __4h__ because it is a __Bad IP__, to my two instances. 

![Add decision](/img/add_decision_to_machines.png)


And we can see in the CrowdSec Local API logs that we received this new decision:

```bash title="/var/log/crowdsec.log"
time="31-03-2023 10:01:22" level=info msg="Received order 96384829-4dfd-4759-9e99-6b007dcf6452 from PAPI (1 decisions)"
time="31-03-2023 10:01:22" level=info msg="Adding decision for '192.168.1.1' with UUID: b0ab6879-99b0-4960-8e80-c231ff22aa6c"
time="31-03-2023 10:01:22" level=info msg="(console) xxxx@crowdsec.net ban decision from console by ip 192.168.1.1 : 4h ban on ip 192.168.1.1"
time="31-03-2023 10:01:29" level=info msg="Signal push: 1 signals to push"
```

```bash
sudo cscli decisions list
╭──────────┬──────────┬────────────────────┬─────────────────────────────────────┬────────┬─────────┬─────────────────────────────────────────────────────────┬────────┬────────────────────┬──────────╮
│    ID    │  Source  │    Scope:Value     │               Reason                │ Action │ Country │                           AS                            │ Events │     expiration     │ Alert ID │
├──────────┼──────────┼────────────────────┼─────────────────────────────────────┼────────┼─────────┼─────────────────────────────────────────────────────────┼────────┼────────────────────┼──────────┤
│ 51093289 │ console  │ ip:192.168.1.1         │ Bad IP                              │ ban    │         │                                                         │ 0      │ 3h55m45.776620725s │ 13404    │
```


### Deleting decision

 - Go to the decision you want to delete. You can then choose if you want to delete the decision on all the machines, or only on the specified machine:


![Delete decision](/img/delete_decision.png)


 - And confirm that you want to delete it:

![Delete decision confirm](/img/delete_decision_confirm.png)



And we can see that our CrowdSec Local API received the order to delete the decision:

```bash
time="31-03-2023 11:41:52" level=info msg="Decision from 'console' for '192.168.1.1' (ban) has been deleted"
time="31-03-2023 11:42:01" level=info msg="sync decisions: 1 deleted decisions to push" interval=10 source=papi
```