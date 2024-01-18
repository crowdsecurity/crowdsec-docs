---
id: integration_msticpy
title: MSTICpy
sidebar_position: 2
---

MSTICpy includes a CrowdSec Threat Intelligence Provider. It can be used to enrich your IP IOCs with CrowdSec's smoke CTI. You can learn more about MSTICpy [here](https://msticpy.readthedocs.io/en/latest/).


## Configuration

### Adding CrowdSec as TIProvider

In your `msticpyconfig.yaml` file, add the following:

```yaml
TIProviders:
    CrowdSec:
    Args:
        AuthKey: <your_api_key>
    Provider: "CrowdSec"
```

Make sure to replace `<your_api_key>` with your API key for CrowdSec CTI API. You can learn more about getting your API key [here](/cti_api/getting_started.mdx).

You can uncomment the `Primary` line if you want to use CrowdSec as your primary TIProvider, for enriching IOCs of ipv4 and ipv6 types.

## Example Jupyter Notebooks Usage

This assumes you've already installed MSTICpy and have a Jupyter Notebook running.


### Using the TIProvider

You can use the following code block to enrich multiple IP addresses using CrowdSec's TIProvider and browse the results. Make sure to replace the IPs with what you want to lookup.

```python
import msticpy as mp
mp.init_notebook()
ti_lookup = mp.TILookup()
ips = ["ip1", "ip2"] # replace the IPs with what you want to lookup
result = ti_lookup.lookup_iocs(ips, providers=["CrowdSec"])
results_df = ti_lookup.result_to_df(result)
mp.TILookup.browse(results_df)
```
![Example Output](/img/msticpy/jupytermsticpy.png)

## Example Azure Sentinel Notebook Usage

To use notebooks in Microsoft Sentinel, make sure that you have the required permissions. For more information, see [Manage access to Microsoft Sentinel notebooks](https://learn.microsoft.com/en-us/azure/sentinel/notebooks#manage-access-to-microsoft-sentinel-notebooks).

Make sure your `msticpyconfig.yaml` file is configured to access the Azure Sentinnel Workspace. 

In this example, we'll lookup IP IOCs from Azure Sentinel in CrowdSec CTI using the CrowdSec's TIProvider.

```python
import msticpy as mp
from msticpy.context.azure import MicrosoftSentinel
mp.init_notebook()

sentinel = MicrosoftSentinel()
sentinel.connect(auth_methods=['cli','interactive'])

ips_to_lookup = []
indicators = sentinel.query_indicators(patternTypes=["ipv4-addr"])
for indicator in indicators.get("properties.parsedPattern"):
    for patternTypeValue in indicator[0]["patternTypeValues"]:
        ips_to_lookup.append(patternTypeValue["value"])

ti_lookup = mp.TILookup()
result = ti_lookup.lookup_iocs(ips_to_lookup, providers=["CrowdSec"])
results_df = ti_lookup.result_to_df(result)
mp.TILookup.browse(results_df)

```

![Example Output](/img/msticpy/azure.png)




