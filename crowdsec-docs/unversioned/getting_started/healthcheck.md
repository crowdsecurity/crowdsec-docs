---
id: health_check
title: CrowdSec Security Engine Setup Health-Check
---

Welcome to the interactive health check of your CrowdSec setup.  
We'll have a Top-Down approach:  
First, check the proper functioning of the Security Engine's finality: **Detecting** AND **Protecting** against attacks.  
Then, eventually, diving into troubleshooting any issue you may encounter.  

## Detection checks

Check that your Security Engine properly reads and parses the logs of the services you protect.

### Trigger CrowdSec's test scenarios

The HTTP collection and the Linux collection contain test scenarios allowing you to prove your Security Engine works as intended, without having to do penetration tests, risking getting you banned from your own server.

#### Test HTTP detection

For this test, you'll add the following path to a URL of a website you're protecting: `/CRODWSEC/TEST`

_*// Any issue possible with .htaccess that would rewrite before this path reaches the log? – **Yes, this is a valid concern. Add a note: "Important: Ensure your web server configuration (e.g., .htaccess) does not rewrite or block this specific URL path `/CRODWSEC/TEST`."***_

Looking at your alerts for the specific scenario **crowdsec/test-http**, you should see a line related to your test.

Note that this scenario has a delay of 1 minute before it can re-trigger _(blackhole parameter of the scenario)_.  You can use the "-a" flag to list all alerts

```bash
sudo cscli alerts list -s crowdsec/test-http -a
```

#### Test SSH detection

Try to authenticate to your server via SSH using the following user: `ABCDEFGH123456`

Looking at your alerts for the specific scenario **crowdsec/test-ssh**, you should see a line related to your test.

Note that this scenario has a delay of 5 minute before it can re-trigger _(blackhole parameter of the scenario)_.  You can use the "-a" flag to list all alerts

```bash
sudo cscli alerts list -s crowdsec/test-ssh -a
```

#### Test AppSec detection

If you are using an AppSec-capable bouncer and have configured CrowdSec WAF, you can test it by [insert specific instructions based on typical AppSec setup; see notes below].

_[**Important Notes for AppSec Test:** The specific test and instructions here are heavily dependent on the WAF/bouncer being used (nginx-bouncer, cloudflare-bouncer, etc.) and the specific AppSec rules enabled.  You need a generic but useful example. Suggestions:*

*   *If possible, install a VERY basic "test XSS" AppSec rule as part of a starter collection.* The test could be adding `<script>alert('XSS')</script>` as a query parameter value in your web application.
*   *If targeting a specific bouncer/WAF, provide instructions for a known trigger for a common rule.* For example, if using the Cloudflare bouncer, provide a query that triggers a known SQL injection or XSS rule.]

* * *

#### Ready for next phase ?

Were all the tests related to your setup successful ?

If not, check the troubleshooting section below

## Detection Troubleshooting <details><summary>Detection Troubleshooting: No alerts triggered? Let's investigate</summary>

So, you did not see an alert. Here are some tests to identify where the issue might be.

#### Acquisition and Metrics check: are your logs read and parsed?

// small description of what acquisition and parser should do + link to docs pages (docs pages to clean up probably soon)

Let's check the specific metrics section:

```plain
sudo cscli metrics show acquisition parsers
```

If this command fails, check the **CrowdSec Service Troubleshooting section** [<details><summary>CrowdSec Service Troubleshooting: Command failed?</summary>
    The `cscli` tool relies on a working CrowdSec service. Possible issues are:
    - **CrowdSec not running:** Run `sudo systemctl status crowdsec` to check. Start with `sudo systemctl start crowdsec` if necessary.
    - **Permission issues:** Ensure you're running `cscli` commands with `sudo`.
    - **Incorrect installation:** If you recently updated or reinstalled CrowdSec, check your installation steps again.
    - **LAPI Misconfiguration:** Check /etc/crowdsec/config.yaml for correct LAPI parameters. Check the LAPI connectivity section
</details>]

*   You should see the names of the log files configured in the acquisition files and the number of lines parsed for each of them.
*   The number of _"Lines parsed"_ should be non-zero for each of the files you configured in the acquisition section.
*   The parsers metrics show you what parsers were successfully used. Look for the name of the parsers installed for the logs you're reading.

If you don't see the log names supposed to be parsed, check the **Acquisition Troubleshooting section**[<details><summary>Acquisition Troubleshooting: Missing Log Files?</summary>
    Possible issues with missing log files:
    - **Incorrect log file path:** Verify the log file path in your `acquis.yaml` file is correct. Typographical errors are common!
    - **File permissions:** CrowdSec needs read access to the log files. Ensure the `crowdsec` user (or the user CrowdSec runs as) has permissions. Use `ls -l /path/to/your/log/file` to check.
    - **Log file rotation:** If the log file is rotated, CrowdSec may be looking for an older file.  Ensure the acquisition configuration is set to follow rotated logs (using wildcards, for example).
    - **Log file doesn't exist:** The log file may simply not exist! Verify the service is actually generating logs.
    - **Syntax errors:** Validate your acquisition file using `sudo cscli config test`.
</details>]

If you don't see parsed lines, check the **Collection Troubleshooting section**[<details><summary>Collection Troubleshooting: No lines parsed?</summary>
    Here are a few checks to do to troubleshoot why a given collection of parsers isn't working
    - **Log format mismatch:** The log format may not match the parsers in the collection.
    - **Install collection**: Verify the hub's command line to install a given collection, there may be missing dependencies or manual actions to trigger
</details>]

</details>

## Acquisition Troubleshooting <details><summary>Acquisition Troubleshooting: Further Steps</summary>

(Flesh out with more detailed steps. Include:

*   Using `cscli explain` to diagnose parsing issues.
*   Example `acquis.yaml` configurations for different log sources (files, syslog).
*   Guidance on using wildcards and excluding files.
*   Common issues: Incorrect log paths, permission errors, file rotation problems.)

</details>

## Collections Troubleshooting <details><summary>Collection Troubleshooting: Further Steps</summary>

(Flesh out with more detailed steps. Include:

*   Ensuring the necessary parsers and scenarios are installed.
*   Verifying that the log format matches the parsers.
*   How to identify relevant collections and dependencies using the hub.
*   Addressing errors during collection installation or updates.)

</details>

## CrowdSec Service Troubleshooting <details><summary>CrowdSec Service Troubleshooting: Further Steps</summary>

(Expand with more detailed steps. Include:

*   Checking `crowdsec.log` for errors (specific examples of error messages and their meanings).
*   Troubleshooting port conflicts (8080, 6060).
*   Permission issues for the CrowdSec user.
*   Configuration file validation.
*   Resource limits (CPU, memory).
*   Systemd journal analysis (using `journalctl -u crowdsec`).)

</details>

## CrowdSec Connectivity checks

Check that your Security Engine can communicate with the CrowdSec Central API and receive the community blocklist and additional ones.

// Do we make them check console enroll here? or just cscli capi status? - *Recommend console enrollment here; the previous checks establish core functionality.  Enrollment becomes the next logical step.*

```bash
sudo cscli capi status
```

[<details><summary>What to expect?</summary>
- Should show: "You can successfully interact with Central API (CAPI)"
- If this test fail, try to enrol to the console to check what's going on.
</details>]

[<details><summary>Register on the Console</summary>
- Link to your documentation
- You could explain how to display all security engines and select the right ones

</details>]

## CrowdSec Network Connectivity Troubleshooting <details><summary>Network Troubleshooting</summary>

(Expand this section to cover:

*   Firewall rules blocking outbound connections to the CrowdSec Central API.
*   DNS resolution issues.
*   Proxy server configuration.
*   Connectivity issues within Docker containers.)

</details>

## Remediation checks

*   Canary tester

(This section requires a robust, safe, and automated canary tester solution. The biggest challenge is preventing users from accidentally banning themselves.  This section can be skipped on V0, as you mentioned, and focused on later. For V1, It could be a URL to a third party machine for testing, or a private machine dedicated to running a canary test)

## Bouncer Troubleshooting <details><summary>Bouncer Troubleshooting: Steps</summary>

(Expand this section. Include:

*   Verifying that the bouncer is registered and active.
*   Checking bouncer logs for errors.
*   Troubleshooting communication issues between the bouncer and the CrowdSec LAPI.
*   Firewall configuration for the bouncer.
*   Specific troubleshooting steps for common bouncers (firewall-bouncer, nginx-bouncer, etc.).)

</details>

## Profile Troubleshooting <details><summary>Profile Troubleshooting: Steps</summary>

(Expand this section with more detailed steps. Include:

*   Verifying profile configuration.
*   Troubleshooting errors related to profile application.
*   Understanding the impact of profiles on detection and remediation.)

</details>

**Important Considerations:**

*   **Brevity:** Keep the content within the accordion details concise and focused on solving the most common problems.
*   **Links to Documentation:** Provide links to the full CrowdSec documentation for more in-depth information.
*   **Specificity:** Tailor the troubleshooting steps to the most common issues for each component.
*   **Visual Aids:** Use screenshots and code examples to illustrate the troubleshooting steps.
* **Console Verification:**  The more checks that can be verified via the console, the better.

This detailed breakdown should give you a solid foundation for building an effective and user-friendly Health Check for your CrowdSec quick guides. Remember to test the guide thoroughly and gather feedback from users to identify areas for improvement.
