---
id: contributing_hub
title: Hub
sidebar_position: 3
---

# Contributing to the Hub

Parsers, Scenarios, and Collections allow the CrowdSec `Security Engine` to detect and block malevolent behavior. Supporting new services or improving the detection capabilities on existing software is a great way to contribute to the CrowdSec ecosystem.

Sharing your parsers, scenarios and collections on the hub allows other users to use them to protect themselves.

## Communication

The main communication channels for hub contributions are:

- [Discord](https://discord.gg/crowdsec): Best for live interactions and quick questions about hub development
- [Discourse](https://discourse.crowdsec.net/): Great for discussing ideas, suggesting improvements, or asking detailed questions
- [GitHub Issues](https://github.com/crowdsecurity/hub/issues): Use for bug reports and feature requests

## Getting Started

Anyone can open an issue about parsers/scenarios, or contribute a change with a pull request (PR) to the [crowdsecurity/hub](https://github.com/crowdsecurity/hub) GitHub repository. You need to be comfortable with git and GitHub to work effectively.

### Find something to work on

Here are some things you can do today to start contributing:

- Help improve existing parsers and scenarios
- Add support for new services and applications
- Create comprehensive test coverage
- Help triage issues and review pull requests
- Improve documentation and examples

### Find a good first topic

The hub repository has beginner-friendly issues that are a great place to get started:

- Look for issues labeled `good first issue` - these don't require high-level CrowdSec knowledge
- Issues labeled `help wanted` indicate that community help is particularly welcome

### Prerequisites

Before contributing, make sure you have:

- Basic understanding of YAML syntax
- Familiarity with grok patterns (for parsers)
- Git and GitHub knowledge
- A local CrowdSec installation for testing (optional but recommended)

### Contribution Workflow

The basic workflow for contributing:

1. Have a look at open [issues](https://github.com/crowdsecurity/hub/issues) and [pull requests](https://github.com/crowdsecurity/hub/pulls)
2. Fork and clone the hub repository
3. Create/Modify parsers/scenarios/collections
4. Create/Modify tests to ensure proper coverage
5. Open a pull request

## Testing

Before submitting your contribution, ensure proper testing using `cscli hubtest`:

### Local Testing with cscli hubtest

`cscli hubtest` is the primary tool for testing hub components. It creates tests for parsers, scenarios, and collections.

#### 1. Create a test

```bash
# Create a test for a parser
cscli hubtest create my-parser-test --type syslog

# Create a test for a scenario (skip parser testing)
cscli hubtest create my-scenario-test --type syslog --ignore-parsers

# Create a test for specific components
cscli hubtest create my-test --parsers crowdsecurity/nginx --scenarios crowdsecurity/http-probing
```

#### 2. Configure your test

Edit the generated configuration file (`.tests/<test-name>/config.yaml`):

```yaml
parsers:
    - crowdsecurity/syslog-logs
    - ./parsers/s01-parse/crowdsecurity/my-parser.yaml
scenarios:
    - ./scenarios/crowdsecurity/my-scenario.yaml
postoverflows:
log_file: my-test.log
log_type: syslog
ignore_parsers: false
```

#### 3. Add test data and assertions

- **Log file**: Add sample logs to `.tests/<test-name>/<test-name>.log`
- **Parser assertions**: Define expected parsed fields in `parser.assert`
- **Scenario assertions**: Define expected alerts in `scenario.assert`

**Note**: When you first run `cscli hubtest run`, it will output the generated assertions that you need to fill out in `parser.assert` or `scenario.assert` files. You can find examples of assertion files in the hub repository at `.tests/<existing-test>/parser.assert` and `.tests/<existing-test>/scenario.assert`.

#### 4. Run your test

```bash
# Run a specific test
cscli hubtest run my-parser-test

# Run all tests
cscli hubtest run --all

# Run with verbose output
cscli hubtest run my-parser-test -v
```

#### 5. Debug your test

```bash
# Explain test results
cscli hubtest explain my-parser-test

# Show only failures
cscli hubtest explain my-parser-test --failures

# Verbose explanation
cscli hubtest explain my-parser-test -v
```

### CI/CD Testing

The hub repository uses GitHub Actions for automated testing:

- All parsers and scenarios are automatically tested when you open a PR
- Tests include syntax validation, pattern matching, and integration tests
- Make sure all tests pass before requesting review


## Git Workflow / Branch Management

We receive contributions on the `master` branch. To contribute:

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/hub.git
   cd hub
   ```
3. **Create a dedicated branch** for your contribution:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make your changes** and commit them with descriptive messages
5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Open a Pull Request** targeting the `master` branch

### Branch Naming Convention

Use descriptive branch names that indicate the type of contribution:
- `feature/parser-nginx-access-logs`
- `fix/scenario-ssh-bruteforce-labels`
- `docs/collection-apache-examples`

### Commit Messages

Write clear, descriptive commit messages:
- Use imperative mood: "Add parser for Apache access logs"
- Reference issues when applicable: "Fix scenario labels (#123)"
- Keep the first line under 50 characters

## Guidelines

### YAML Best Practices

When creating parsers, scenarios, and collections, follow these YAML guidelines:

#### Avoid YAML Anchors

**❌ Don't use YAML anchors** - they make YAML files harder to maintain and understand:

```yaml
# BAD - Using anchors in nodes
nodes:
- grok:
    pattern: 'pattern1'
    apply_on: message
  nodes: &message_parsers
  - grok:
      pattern: "user pattern"
      apply_on: parsedmessage
    statics:
      - meta: sub_type
        value: user_enumeration
- grok:
    pattern: 'pattern2'
    apply_on: message
  nodes: *message_parsers
```

**✅ Duplicate the node structure instead of using anchors:**

```yaml
# GOOD - No anchors, explicit node definitions
nodes:
- grok:
    pattern: 'pattern1'
    apply_on: message
  nodes:
  - grok:
      pattern: "user pattern"
      apply_on: parsedmessage
    statics:
      - meta: sub_type
        value: user_enumeration
- grok:
    pattern: 'pattern2'
    apply_on: message
  nodes:
  - grok:
      pattern: "user pattern"
      apply_on: parsedmessage
    statics:
      - meta: sub_type
        value: user_enumeration
```

### AI-Assisted Generation

We do allow AI-assisted generation of parsers, scenarios, and collections, but with important requirements:

#### Requirements for AI-Generated Contributions

- **Follow all guidelines**: AI-generated code must still follow all the guidelines in this document
- **Include comprehensive tests**: A pull request with AI-generated code but no tests will be immediately closed
- **Proper documentation**: Include complete documentation and examples as required
- **Code quality**: Ensure the generated code follows CrowdSec conventions and best practices

#### Disclosure Requirement

**Important**: When submitting AI-assisted contributions, you must check the "AI was used to generate any/all content of this PR" box in the PR template. You must understand and be able to explain yourself what was generated. AI-generated code will receive additional scrutiny to ensure quality and correctness.

#### What We Expect

- Test coverage using `cscli hubtest`
- Proper error handling and edge cases
- Clear documentation and examples
- Adherence to CrowdSec patterns and conventions
- Human review and validation of the AI output

AI is a powerful tool, but it should augment human expertise, not replace proper testing and review processes.

### Technical Documentation

The following explains how to create and test:

- [parsers](/log_processor/parsers/create.md)
- [scenarios](/log_processor/scenarios/create.md)

### Collections

Collections group related parsers, scenarios, and postoverflows together. It often makes sense for a new parser or scenario to be added to an existing [collection](/log_processor/collections/format.md), or create a new one.

#### When to create a new collection:

- Your parsers and/or scenarios cover a new or specific service
- You're adding multiple related components that work together
- The existing collections don't fit your use case

#### When to add to existing collections:

- Adding a parser for a specific web server's access logs that would benefit from existing HTTP-related scenarios
- Your contribution enhances an existing service's detection capabilities
- Your scenario complements existing parsers in a collection

#### Collection structure:

Each collection should include:
- Descriptive name and description
- Proper labels and tags
- Documentation with setup instructions
- Example acquisition configuration
- Related parsers, scenarios, and postoverflows


### Scenarios

Scenarios define the logic for detecting attacks and suspicious behavior. When you create a scenario, you must fill some fields in the [`labels`](/log_processor/scenarios/format.md#labels), else the CI won't accept the contribution.

#### Required Labels

Those `labels` are:
 - `classification`: this array contains the CVE ID and the [Mitre Techniques](https://attack.mitre.org/techniques/enterprise/) related to the scenario (when applicable)
 - `spoofable`: between 0 and 3, is the chance that the attacker behind the attack can spoof its origin
 - `confidence`: between 0 and 3, is the confidence that the scenario will not trigger false positive
 - `behaviors`: an existing behavior in [this file](https://github.com/crowdsecurity/hub/blob/scenario_taxonomy/taxonomy/behaviors.json)
 - `label` : a human readable name for the scenario
 - `cti` : (optional) true or false, used to specify that a scenario is mainly used for audit rather than detecting a threat 

[Here](/log_processor/scenarios/format.md#labels) is the `labels` documentation for more information.

#### Example Scenario Labels

```yaml
labels:
  service: ssh
  confidence: 3
  spoofable: 0
  classification:
    - attack.T1110
  label: "SSH Bruteforce"
  behavior: "ssh:bruteforce"
  remediation: true
```

#### Label Guidelines

- **Confidence**: Start with 3 (high confidence) and reduce if you're unsure
- **Spoofable**: Consider if the attack source can be easily faked (0 = cannot be spoofed, 3 = easily spoofed)
- **Classification**: Use MITRE ATT&CK techniques when applicable
- **Behavior**: Choose from the predefined taxonomy to ensure consistency


## Preparing your contribution

Before asking for a review of your PR, please ensure you have the following:

### Tests

Test creation is covered in [parsers creation](/log_processor/parsers/create.md) and [scenarios creation](/log_processor/scenarios/create.md). Ensure that each of your parser or scenario is properly tested:

- **Parser tests**: Include sample log files that cover various scenarios (success, failure, edge cases)
- **Scenario tests**: Test with different input data to ensure proper triggering and no false positives
- **Integration tests**: Verify that your components work well with existing parsers/scenarios

### Documentation

Please provide a `.md` file with the same name as each of your parser, scenario or collection. The markdown is rendered in the [hub](https://hub.crowdsec.net).

#### Documentation Requirements

- Clear description of what the component does
- Setup instructions and prerequisites
- Configuration examples
- Troubleshooting tips
- Links to relevant documentation

#### Collection Documentation

If you're creating a collection targeting a specific log file, be sure to provide an acquisition example:

```yaml
filenames:
- /var/log/xxx/*.log
labels:
  type: something
```

### Code Quality

- Follow existing naming conventions
- Use consistent indentation and formatting
- Add comments for complex logic
- Ensure all required fields are properly filled

## Opening your PR

Everything is all set, you can now open a PR that will be reviewed and merged!

### PR Checklist

Before opening your PR, ensure you can check all items in the [PR template](https://github.com/crowdsecurity/hub/blob/master/.github/pull_request_template.md). Additional requirements:

- [ ] Documentation is complete and accurate
- [ ] Code follows the project's style guidelines
- [ ] Commit messages are clear and descriptive
- [ ] PR description explains the changes and motivation
- [ ] Related issues are referenced (if applicable)

### Review Process

- PRs are reviewed by maintainers and community members
- Feedback may be requested for improvements
- All CI checks must pass before merging
- Maintainers will merge approved PRs

## Troubleshooting

### Common Issues

#### Parser Issues

- **Grok patterns not matching**: Use online grok testers to validate patterns
- **Missing fields**: Ensure all required fields are extracted

#### Scenario Issues

- **False positives**: Adjust thresholds and conditions
- **Not triggering**: Check that events are properly parsed and available
- **Label validation**: Ensure all required labels are present and valid

#### Testing Issues

- **Hubtest creation fails**: Ensure you're in the hub repository root directory
- **Test configuration errors**: Check YAML syntax in `.tests/<test-name>/config.yaml`
- **Parser assertions failing**: Use `cscli hubtest explain <test-name>` to debug parser output
- **Scenario assertions failing**: Verify scenario logic and thresholds with `cscli hubtest explain <test-name>`
- **Missing test data**: Provide comprehensive log samples and assertion files
- **CI tests failing**: Review the GitHub Actions logs for specific errors

### Getting Help

If you encounter issues:

1. Check existing [GitHub Issues](https://github.com/crowdsecurity/hub/issues) for similar problems
2. Ask for help on [Discord](https://discord.gg/crowdsec) or [Discourse](https://discourse.crowdsec.net/)
3. Open a new issue with detailed information about your problem

### Useful Resources

- [Parser Creation Guide](/log_processor/parsers/create.md)
- [Scenario Creation Guide](/log_processor/scenarios/create.md)
- [Collection Format](/log_processor/collections/format.md)
- [Expression Language Documentation](/expr/intro.md)
- [cscli hubtest Documentation](/cscli/cscli_hubtest.md)
- [Hub Website](https://hub.crowdsec.net)
