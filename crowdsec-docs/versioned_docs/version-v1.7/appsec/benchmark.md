---
id: benchmark
title: WAF Component Benchmark
sidebar_position: 80
---

<!--

 - benchmark as previously done by KKA

 - naked
 - with a few vpatch rules
 - with full CRS
 - ?!

-->

The Application Security Component benchmarks were run on an AWS EC2 instance `t2.medium` (2vCPU/4GiB RAM).

All benchmarks were run with a single `routine` configured for the Application Security Component.

The benchmarks cover the following tests:

- Basic GET request:
  - 5 concurrent connections / 1000 requests
  - 15 concurrent connections / 1000 requests

<!--- POST request (50Ko body):
  - 5 concurrent connections / 1000 requests
  - 15 concurrent connections / 1000 requests
-->

Each test was run with multiple cases:

- Application Security Component enabled but without any rules
- Application Security Component enabled with 100 vpatch rules (in-band)
- Application Security Component enabled with all the CRS (in-band)

On the system, we deployed:

- Openresty `1.21.4.3`
- CrowdSec `v1.6.0`
- cs-openresty-bouncer `v1.0.1`

## Basic GET request

### 5 concurrent connections / 1000 requests

![5 concurrent connections / 1000 requests](/img/appsec/bench/basic_get_appsec_one_routine_5_1000.png)

### 15 concurrent connections / 1000 requests

![15 concurrent connections / 1000 requests](/img/appsec/bench/basic_get_appsec_one_routine_15_1000.png)

<!--
## POST request (50Ko body)

### 5 concurrent connections / 1000 requests

![5 concurrent connections / 1000 requests](/img/appsec/bench/big_post_appsec_one_routine_5_1000.png)

### 15 concurrent connections / 1000 requests

![15 concurrent connections / 1000 requests](/img/appsec/bench/big_post_appsec_one_routine_15_1000.png)
-->
