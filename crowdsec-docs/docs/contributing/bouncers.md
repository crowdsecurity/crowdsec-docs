---
id: contributing_bouncers
title: Remediation Components
sidebar_position: 5
---

## Publishing remediation component

We do welcome remediation components from the community, and will gladly publish them on the hub.

### Why ?

Sharing on the hub allows other users to find and use it. While increasing your code's visibility, it also ensures a benevolent evaluation by the community and our team.

### How ?

#### Specs

Remediation components have mandatory and optional features, they are described in the following sub pages:
- [Specifications for Remediation Component and AppSec Capabilities](/contributing/specs/bouncer_appsec_specs)
- [Remediation Component Metrics](/contributing/specs/bouncer_metrics_specs)

*Don't hesitate to get in touch with us via discord if anything is unclear to you*

Those specs describe how the Remediation component interacts with the Security Engine Local API as well as how each feature should behave.

Main features are:
- **Mode**: How the bouncer retrieves decisions
  - **Stream**: Pulls them periodically and stores them locally (preferred for low latency remediation)
  - **Live**: Queries the LAPI upon request reception (easier to implement)
  - Both available ideally, but **Stream** preferred in most cases
- **AppSec**: Ability to forward requests to the Security Engine to eval appsec rules
  - Optional but if the remediation component has access to the request this features is a big plus
- **Metrics**: Keep track of what was remediated
  - Optional but very useful for the users to be able to evaluate the efficiency of the protection
  - Ideally with details on the source of the decision (blocklist, manual block, a scenario triggering a decision 'crowdsec'...)

Other optional features are:
- **MTLS** support
- Exposing metrics to **Prometheus**

#### Publish on Github

To have it published on the hub, please simply [open a new issue on the hub](https://github.com/crowdsecurity/hub/issues/new), requesting "remediation component inclusion". The remediation component will then be reviewed by the team, and published directly on the hub, for everyone to find & use it!

:::info
currently the hub only allows links to code bases hosted on github.com, we will support others in the future
:::

The information that should be stated in your issue is:

- Source repository of your remediation component (for example `https://github.com/crowdsecurity/cs-firewall-bouncer/`)
- Software licence used
- Current status of the remediation component (stage: dev/unstable/stable)
- Documentation (can be simply in the README.md):
  - must contain: installing, uninstalling
  - should contain: configuration documentation
- Link to existing tests if applicable (either functional or unit tests)

Please take care of the following :

- Ensure your repository has a About/Short description meaningful enough: it will be displayed in the hub
- Ensure your repository has a decent README.md file: it will be displayed in the hub
- Ensure your repository has _at least_ one release: this is what users will be looking for
- (ideally) Have a "social preview image" on your repository: this will be displayed in the hub when available
- (ideally) A Howto or link to a guide that provides a hands-on experience with the remediation component

You can follow this template:

```markdown
Hello,

I would like to suggest the addition of the `XXXX` to the hub :

- Source repository: https://github.com/xxx/xxx/
- Licence: MIT
- Current status: stable (has been used in production for a while)
- README/doc: https://github.com/xxx/xxx/blob/main/README.md
- Existing tests:

  - functional tests: https://github.com/xxx/xxx/blob/main/.github/workflows/tests.yml

- Short/Long description: OK
- Howto: in README
- At least one release: yes
```


### Bonus

You can also open a Pull Request to add the remediation component in the Hub.
To do this, you must edit the [`blockers/list.json`](https://raw.githubusercontent.com/crowdsecurity/hub/master/blockers/list.json) file and add the following object in the array:

```json
    {
        "name": "<BOUNCER NAME>",
        "author": "<GITHUB ACCOUNT OR ORG>",
        "logo": "<THE BASE64 LOGO IMAGE>"
    }
```