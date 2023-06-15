---
id: integration_thehive
title: TheHive/Cortex Plugin
sidebar_position: 2
---

The **CrowdSec Cortex Analyzer** allows you to obtain a detailed report from CrowdSec's CTI **smoke** database.

Here is the source code of the analyzer and report template:
* [analyzer](https://github.com/TheHive-Project/Cortex-Analyzers/tree/master/analyzers/Crowdsec)
* [report template](https://github.com/TheHive-Project/Cortex-Analyzers/tree/master/thehive-templates/Crowdsec_1_0)

## Installation

The CrowdSec analyzer is available in Cortex analyzers collection from version **3.2.0** and will be ready to use within your observables of type **IP**.

To add the CrowdSec analyzer to a case's observable you can refer to the [offical documentation](https://docs.thehive-project.org/thehive/user-guides/analysts/run-analyzers/).

To complete/customize the template you can refer to this [how to](https://docs.thehive-project.org/thehive/user-guides/administrators/analyzer-templates/).

## Usage

1. For a case's observable of type IP click on preview

![TheHive observables](/img/thehive_observables.png)

2. Run the CrowdSec analyzer
    * It should appear in the list
    * Click on the **analyze** (fire) icon

![TheHive - Cortex Analyzers](/img/thehive_cortex_analyzers.png)

3. Check the report
    * Once the analyze process is complete, click on the date to see the report.
    * Note that if you run the analyzer again, multiple reports for each date will be available.

![TheHive - Analyze complete](/img/thehive_cortex_analyze_complete.png)

![TheHive - Cortex report](/img/thehive_cortex_report.png)


