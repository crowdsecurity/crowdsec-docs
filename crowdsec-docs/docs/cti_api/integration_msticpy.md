---
id: integration_msticpy
title: MSTICpy
sidebar_position: 2
---

MSTICpy includes a CrowdSec Threat Intelligence Provider. It can be used to enrich your IP IOCs with CrowdSec's smoke CTI. You can learn more about MSTICpy [here](https://msticpy.readthedocs.io/en/latest/).

## Using Jupyter Notebooks

This assumes you've already installed MSTICpy and have a Jupyter Notebook running.

### Adding CrowdSec as TIProvider

In your `msticpyconfig.yaml` file, add the following:

```yaml
TIProviders:
    CrowdSec:
    Args:
        AuthKey: <your_api_key>
    Provider: "CrowdSec"
```

Make sure to replace `<your_api_key>` with your API key for CrowdSec CTI API. You can learn more about getting your API key [here](/docs/next/cti_api/getting_started).

You can uncomment the `Primary` line if you want to use CrowdSec as your primary TIProvider, for enriching IOCs of ipv4 and ipv6 types.

### Using the TIProvider

You can use the following code block to enrich multiple IP addresses using CrowdSec's TIProvider and browse the results

```python
import msticpy as mp
mp.init_notebook()
ti_lookup = mp.TILookup()
ips = ["91.214.82.51", "167.71.59.64"]
result = ti_lookup.lookup_iocs(ips, providers=["CrowdSec"])
results_df = ti_lookup.result_to_df(result)
mp.TILookup.browse(results_df)
```
![Example Output](/img/msticpy/jupytermsticpy.png)



