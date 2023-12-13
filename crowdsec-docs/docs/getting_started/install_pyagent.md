---
id: install_pyagent
title: Python Soft Agent
sidebar_position: 1
---

# Using our Python SDK

This python SDK is designed for signal sharing partners to send signals and benefit from the community blocklist. Learn more about [signal sharing](TODO).

Our SDK does the heavy lifting of the CAPI connectivity so you can simply, sendSignals and getDecisions, as well as enroll your soft-agent into the console.

# Installation

Make sure you have **Python 3.9+** installed.

## From source

```bash
pip install git+https://github.com/crowdsecurity/python-capi-sdk
```
<!-- 
## From PyPi

```bash

pip install python-capi-sdk
``` -->

# Usage Guide

Here is a quick example of how to use the SDK to send signals to the API.

```python
from cscapi.client import CAPIClient, CAPIClientConfig
from cscapi.sql_storage import SQLStorage
from cscapi.utils import create_signal, generate_machine_id_from_key

config = CAPIClientConfig(
        scenarios=["crowdsecurity/ssh-bf", "acme/http-bf"], 
        # Scenarios you're sending signals for
        user_agent_prefix="mycompany" 
        # Prefix for the user agent used to make calls to CrowdSec API
)
client = CAPIClient(
    storage=SQLStorage(connection_string="sqlite:///cscapi.db"),
    config=config
)

# Fetch signals from your data, and convert it into format accepted by CrowdSec
signals = [
    create_signal(
        attacker_ip="<attacker_ip>", # Replace this with value from your signals
        scenario="crowdsecurity/ssh-bf",
        created_at="2023-11-17 10:20:46 +0000",
        machine_id=generate_machine_id_from_key(key="<key>", prefix="mycompany"),
        # set value of key to something that's unique to a machine from which this signal has originated from. Eg IP

    )
]

# This stores the signals in the database
client.add_signals(signals)

# This sends all the unsent signals to the API.
# You need to chron this call to send signals periodically.
client.send_signals()

# This enrolls the specified machines in the CrowdSec Console.
# This is a one time operation for each machine id you want to enroll.
client.enroll_machines(
    machine_ids=[generate_machine_id_from_key("<key>", prefix="mycompany")],
    attachment_key="ckqlyuz9700000vji4xxxxxxz" 
    name="mymachine", tags=["ssh-honeypot"]
)

# This fetches decisions for the specified machine id and ip.
# This machine id must be validated by CrowdSec Team.
decisions = client.get_decisions(
    main_machine_id = "validated_machine_id",
)

```

To obtain attachment key for enrolling a machine see [this doc](../console/enrollment/#where-can-i-find-my-enrollment-key) 

See reference section for more details. 

## Good practices

- Don't call `send_signals` too often. Once every 5-20 minutes is a good frequency.
- Call `enroll_machines` only once for each machine you want to enroll.
- Call `get_decisions` 0.5-4 hours

# Reference

#### `cscapi.client.CAPIClientConfig`
```python
cscapi.client.CAPIClientConfig(
    scenarios: List[str],
    max_retries: int = 3,
    latency_offset: int = 10,
    user_agent_prefix: str = "",
    retry_delay: int = 5)
    
```

This class contains configuration for the client.

Constructor Parameters:

- `scenarios`: A list of scenarios that you want to send signals for.
- `max_retries`: Maximum number of retries to make when sending signals to the API.
- `latency_offset`: Offset to calculate machin login expiration.
- `user_agent_prefix`: Prefix for the user agent used to make calls to CrowdSec API.
- `retry_delay`: Delay between retries when sending signals to the API

#### `cscapi.client.CAPIClient(storage: StorageInterface, config: CAPIClientConfig)`

This is the main class that you will use to interact with the CrowdSec API.

Contructor Parameters:

- `storage`: An instance of a class that implements `StorageInterface`. This is used to store signals that are sent to the API.
- `config`: An instance of `CAPIClientConfig` that contains configuration for the client.


#### `CAPIClient.add_signals(self, signals: List[SignalModel])`

This method takes a list of `SignalModel` instances and stores them using the provided storage interface.

#### `CAPIClient.send_signals(self, prune_after_send: bool = True)`

This method sends all unsent signals to CrowdSec. If `prune_after_send` is set to `True` (which is the default), signals are removed from the storage after they are sent.

#### `CAPIClient.enroll_machines(self, machine_ids: List[str], name: str, attachment_key: str, tags: List[str])`

This method enrolls the specified machines in the CrowdSec Console. This is a one time operation for each machine id you want to enroll.

#### `CAPIClient.get_decisions(self, machine_id: str, ip: str)`

This method fetches decisions for the specified machine id and ip. This machine id must be validated by CrowdSec Team.

## `cscapi.utils`

This module contains utility functions that you can use to create signals and generate machine ids.

#### `cscapi.utils.create_signal(attacker_ip: str, scenario: str, created_at: str, machine_id: str, **kwargs)`

This method creates a `cscapi.storage.SignalModel` instance from the provided parameters.


#### `cscapi.utils.generate_machine_id_from_key(key: str, prefix: str)`

This method generates a machine id from the provided key and prefix. Generated machine is is always same for a given key and prefix.

#### `cscapi.storage.SQLStorage`

This class implements `cscapi.storage.StorageInterface` and can be used to store signals in a SQL database.

Constructor Parameters:

- `connection_string`: Connection string for the SQL database. See [SQLAlchemy documentation](https://docs.sqlalchemy.org/en/14/core/engines.html#database-urls) for more details.

#### `cscapi.storage.StorageInterface`

This is an interface that you can implement to store signals in your own storage. You can use the provided `SQLStorage` class to store signals in a SQLite database.

