---
id: contributing_hub
title: Hub
sidebar_position: 3
---

# Contributing to the Hub

Parsers, Scenarios, Collections, and WAF rules allow the CrowdSec `Security Engine` to detect and block malevolent behavior. Supporting new services or improving detection capabilities is a great way to contribute to the CrowdSec ecosystem.

Sharing your parsers, scenarios and waf rules on the hub allows other users to use them to protect themselves.

## Communication

The main communication channels for hub contributions are:

- [Discord](https://discord.gg/crowdsec): Best for live interactions and quick questions about hub development
- [GitHub Issues](https://github.com/crowdsecurity/hub/issues): Use for bug reports and feature requests. also  great for discussing ideas, suggesting improvements, or asking detailed questions

## Getting Started

Anyone can open an issue about parsers, scenarios, collections, or WAF rules, or contribute a change with a pull request (PR) to the [crowdsecurity/hub](https://github.com/crowdsecurity/hub) GitHub repository. You need to be comfortable with git and GitHub to work effectively.

### Find something to work on

Here are some things you can do today to start contributing:

- Help improve existing parsers, scenarios, collections, and WAF rules
- Add support for new services and applications
- Detect and block Web Application attacks via WAF rules
- Help triage issues and review pull requests
- Improve documentation and examples

### Find a good first topic

The hub repository has beginner-friendly issues that are a great place to get started:

- Look for issues labeled `good first issue` - these don't require high-level CrowdSec knowledge
- Issues labeled `help wanted` indicate that community help is particularly welcome

### Prerequisites

Before contributing, make sure you have:

- Basic understanding of YAML syntax
- Familiarity with grok patterns (for parsers) and HTTP request basics (for WAF rules)
- Git and GitHub knowledge
- A local CrowdSec installation for testing

### Contribution Workflow

The basic workflow for contributing:

1. Have a look at open [issues](https://github.com/crowdsecurity/hub/issues) and [pull requests](https://github.com/crowdsecurity/hub/pulls)
2. Fork and clone the hub repository
3. Create/Modify parsers/scenarios/collections/AppSec rules
4. Create/Modify tests to ensure proper coverage
5. Open a pull request

## Parsers and scenarios

Use the dedicated creation guides for full walkthroughs and keep these must-haves in mind:

- Parsers: follow [parsers creation](/log_processor/parsers/create.md); add cscli hubtest coverage and a short `.md` describing purpose/setup.
- Scenarios: follow [scenarios creation](/log_processor/scenarios/create.md); fill the required `labels`, cover the scenario with cscli hubtest, and add a `.md` doc.

## AppSec rules

Follow [AppSec rule creation](/appsec/create_rules.md) for the detailed flow. Essentials:

- Tests: create a cscli hubtest with `--appsec` and provide the nuclei template plus assertions as described in the guide.
- Rule metadata: complete the required labels/fields so CI passes.

## Collections

Use [collections format](/log_processor/collections/format.md); bundle tested parsers, scenarios, and WAF rules. Add a markdown page that states the collection goal plus the acquisition example to ingest the logs.

## Testing

Before submitting, ensure proper testing with `cscli hubtest`. Follow the dedicated creation guides for step-by-step instructions instead of duplicating them here:
- Parser tests: [parsers creation](/log_processor/parsers/create.md#create-our-test)
- Scenario tests: [scenarios creation](/log_processor/scenarios/create.md#create-our-test)
- AppSec tests (with nuclei templates): [AppSec rule creation](/appsec/create_rules.md#create-our-test)
- CLI reference and options: [cscli hubtest](/cscli/cscli_hubtest.md)

### CI/CD Testing

The hub repository uses GitHub Actions for automated testing of parsers, scenarios, and AppSec rules when you open a PR. Make sure local tests pass before requesting review.

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

## Guidelines

### YAML Best Practices

When creating parsers, scenarios, and collections, follow these YAML guidelines:

#### Avoid YAML Anchors

**❌ Don't use YAML anchors** - they make YAML files harder to maintain and understand:

### AI-Assisted Generation

We do allow AI-assisted generation of parsers, scenarios, collections, and AppSec rules, but with important requirements:

- **Follow all guidelines**: AI-generated code must still follow all the guidelines in this document
- **Include comprehensive tests**: A pull request with AI-generated code but no tests will be immediately closed
- **Proper documentation**: Include complete documentation and examples as required

#### Disclosure Requirement

**Important**: When submitting AI-assisted contributions, you must check the "AI was used to generate any/all content of this PR" box in the PR template. You must understand and be able to explain yourself what was generated. AI-generated code will receive additional scrutiny to ensure quality and correctness.

#### What We Expect

- Test coverage using `cscli hubtest`
- Proper error handling and edge cases
- Clear documentation and examples
- Adherence to CrowdSec patterns and conventions
- Human review and validation of the AI output

### Technical Documentation

The following explains how to create and test:

- [parsers](/log_processor/parsers/create.md)
- [scenarios](/log_processor/scenarios/create.md)
- [AppSec rules](/appsec/create_rules.md)

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

## Preparing your contribution

Before asking for a review of your PR, please ensure you have the following:

### Tests

Test creation is covered in [parsers creation](/log_processor/parsers/create.md), [scenarios creation](/log_processor/scenarios/create.md), and [AppSec rule creation](/appsec/create_rules.md). Ensure that each component is properly tested:

- **Parser tests**: Include sample log files that cover various scenarios (success, failure, edge cases)
- **Scenario tests**: Test with different input data to ensure proper triggering and no false positives
- **AppSec tests**: Provide nuclei templates and expected outcomes for your rule
- **Integration tests**: Verify that your components work well with existing parsers/scenarios

### Documentation

Please provide a `.md` file with the same name as each of your parser, scenario, collection, or WAF rule. The markdown is rendered in the [hub](https://hub.crowdsec.net).

#### Collection Documentation

State the collection goal and, if you're targeting a specific log file, provide an acquisition example:

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

### Getting Help

If you encounter issues:

1. Check existing [GitHub Issues](https://github.com/crowdsecurity/hub/issues) for similar problems
2. Ask for help on [Discord](https://discord.gg/crowdsec) or [Discourse](https://discourse.crowdsec.net/)
3. Open a new issue with detailed information about your problem

### Useful Resources

- [Parser Creation Guide](/log_processor/parsers/create.md)
- [Scenario Creation Guide](/log_processor/scenarios/create.md)
- [AppSec Rule Creation](/appsec/create_rules.md)
- [Collection Format](/log_processor/collections/format.md)
- [Expression Language Documentation](/expr/intro.md)
- [cscli hubtest Documentation](/cscli/cscli_hubtest.md)
- [Hub Website](https://hub.crowdsec.net)
