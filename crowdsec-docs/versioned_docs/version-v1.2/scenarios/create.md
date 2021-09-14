---
id: create
title: Creating scenarios
sidebar_position: 4
---

:::caution

All the examples assume that you have installed the [iptables parser](https://hub.crowdsec.net/author/crowdsecurity/configurations/iptables-logs), and that your iptables configuration logs dropped packets.

:::

## Leaky bucket

In this example, we will write a simple scenario based on a leaky bucket that will trigger if an IP tries to port scan our machine.

We'll start with the most basic scenario:
```yaml
type: leaky
debug: true
name: demo/leaky-example
description: "detect cool stuff"
filter: evt.Meta.log_type == 'iptables_drop'
capacity: 1
leakspeed: 1m
blackhole: 1m
labels:
  type: scan
```

We define:
 - A filter: an expression that decides if the scenario will apply to current event or not
 - A type: here, we have a `leaky` bucket
 - A capacity: how many events can be poured in the bucket before it overflows
 - A leakspeed: the speed at which events are removed from the bucket
 - A blackhole: duration for which the bucket should be overflow again
 - Some labels to qualify the event

This scenario in its current state is not really useful:
 - We do not define a `groupby`: the same bucket will be used for all source IP, which prevent us to ban the IP actually doing the port scan.
 - Our filter is too generic: we also match dropped UDP packets, and it can be very dangerous to apply a decision on them.

Let's fix that !

 ```yaml
type: leaky
debug: true
name: demo/leaky-example
description: "detect cool stuff"
filter: "evt.Meta.log_type == 'iptables_drop' and evt.Parsed.proto == 'TCP'"
groupby: evt.Meta.source_ip
capacity: 15
leakspeed: 1m
blackhole: 1m
labels:
  type: scan
```

We added:
 - A new filter, ` and evt.Parsed.proto == 'TCP'`: our scenario will now only apply if the protocol is TCP (based on what was extracted from the log line by our GROK pattern)
 - A `groupby` parameter: we now create one bucket per source ip
 - We also updated the capacity and leakspeed to be more useful for a real life scenario.

 But this is still not perfect ! We want to create a scenario to detect port scan, but our current configuration will also detect repeated connections to the same port.

 We can fix this by adding a `distinct` parameter:
```yaml
type: leaky
debug: true
name: demo/leaky-example
description: "detect cool stuff"
filter: "evt.Meta.log_type == 'iptables_drop' and evt.Parsed.proto == 'TCP'"
groupby: evt.Meta.source_ip
distinct: evt.Parsed.dst_port
capacity: 15
leakspeed: 1m
blackhole: 1m
labels:
  type: scan
```

The distinct parameter will prevent an event to be poured into the bucket if there is already an event in it with the same value for `evt.Parsed.dst_port`.

In our case, this means that we will only have unique ports in our bucket. 

And voila ! We now have a working scenario able to detect port scanning.

## Trigger bucket

In this example, we will write a simple scenario that will trigger if anyone sends a packet to the port 3389.

```yaml
type: trigger
name: demo/trigger-example
description: "Detect connection to RDP port"
filter: "evt.Meta.log_type == 'iptables_drop' and evt.Parsed.proto == 'TCP' and evt.Parsed.dst_port == '3389'"
groupby: evt.Meta.source_ip
blackhole: 2m
labels:
 service: rdp
 type: scan
 remediation: true
```

What changed in comparaison to our leaky example ?
 - We defined the type to be `trigger`: this means that the bucket will overflow if any event is poured into it
 - Our filter checks if the value of `dst_port` is equal to `3389`: you can access all capture group defined in a GROK pattern with the object `evt.Parsed`
 - We set the `remediation` label to `true`: if the bucket overflow, we will apply a remediation based on your profile configuration (by default, 4h ban)

Let's try it !

Put the scenario in a file called `iptables-rdp.yaml`, in the `scenarios` folder of crowdsec.

Use `cscli` to make sure the scenario is detected:
```shell
$ cscli scenarios list                    
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 NAME                                     📦 STATUS          VERSION  LOCAL PATH                                                                                                              
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 iptables-rdp.yaml                        🏠  enabled,local           /etc/crowdsec/scenarios/iptables-rdp.yaml                                 
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
``` 

Next, we will trigger the scenario by attempting to connect to the port 3389 on the machine where crowdsec is running:
```shell
$ nc -v 127.0.0.1 3389
nc: connect to 127.0.0.1 port 3389 (tcp) failed: Connection refused 
```

In our kernel logs, we can see:
```
Aug 20 16:20:09 mantis kernel: [887475.435839] DROP: IN=lo OUT= MAC=00:00:00:00:00:00:00:00:00:00:00:00:08:00 SRC=192.168.1.23 DST=192.168.1.23 LEN=60 TOS=0x00 PREC=0x00 TTL=64 ID=29037 DF PROTO=TCP SPT=39158 DPT=3389 WINDOW=65495 RES=0x00 SYN URGP=0 
```

We can then check that a decision has been applied:
```
$ cscli decisions list
+-------+----------+-----------------+----------------------+--------+---------+----+--------+------------------+----------+
|  ID   |  SOURCE  |   SCOPE:VALUE   |        REASON        | ACTION | COUNTRY | AS | EVENTS |    EXPIRATION    | ALERT ID |
+-------+----------+-----------------+----------------------+--------+---------+----+--------+------------------+----------+
| 17563 | crowdsec | Ip:192.168.1.47 | demo/trigger-example | ban    |         |    |      1 | 3h59m5.00140614s |       82 |
+-------+----------+-----------------+----------------------+--------+---------+----+--------+------------------+----------+
```