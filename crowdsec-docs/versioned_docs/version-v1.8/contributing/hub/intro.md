---
id: intro
title: "Contributing to the Hub"
sidebar_label: "Overview"
description: "The shared workflow for contributing parsers, scenarios, AppSec rules, collections and bot detections to the CrowdSec hub: prerequisites, guidelines, testing and the pull request process."
---

Parsers, Scenarios, Collections, and WAF rules allow the CrowdSec `Security Engine` to detect and block malevolent behavior. Supporting new services or improving detection capabilities is a great way to contribute to the CrowdSec ecosystem.

Sharing your parsers, scenarios, waf rules and collections on the hub allows other users to use them to protect themselves.

## Communication

The main communication channels for hub contributions are:

- [Discord](https://discord.gg/crowdsec): Best for live interactions and quick questions about hub development
- [GitHub Issues](https://github.com/crowdsecurity/hub/issues): Use for bug reports and feature requests. Also great for discussing ideas, suggesting improvements, or asking detailed questions

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

## What are you contributing?

This page covers the workflow shared by every hub contribution. Each type also has its own page:

- [Parsers and scenarios](parsers_scenarios.md)
- [AppSec rules](appsec_rules.md)
- [Bot detections](bot_detections.md)

## Testing

Most contributions need [`cscli hubtest`](/cscli/cscli_hubtest.md) coverage; each per-type page says what applies. To run tests locally, [create a test environment](../engine/test_env.md). GitHub Actions runs them on every pull request.

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

```yaml
_common: &common
  service: nginx
  remediation: true
labels:
  <<: *common
  confidence: 3
```

**✅ Write the values out instead:**

```yaml
labels:
  service: nginx
  remediation: true
  confidence: 3
```

Anchors make the reader look elsewhere in the file to know what a rule does.

### AI-assisted generation

The [rules for AI tools](/contributing/getting_started.md#using-ai-tools) apply. On the hub, also tick the "AI was used to generate any/all content of this PR" box in the PR template, and be ready to explain what was generated. A PR with generated content and no tests is closed.

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

Each type has its own expectations, covered on [parsers and scenarios](parsers_scenarios.md), [AppSec rules](appsec_rules.md) and [bot detections](bot_detections.md). Also check that your items work with the existing ones they interact with.

### Documentation

Please provide a `.md` file with the same name as each of your parsers, scenarios, collections, or WAF rules. The markdown is rendered in the [hub](https://hub.crowdsec.net).

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
2. Ask for help on [Discord](https://discord.gg/crowdsec)
3. Open a new issue with detailed information about your problem

### Useful Resources

- [Parsers and scenarios](parsers_scenarios.md), [AppSec rules](appsec_rules.md), [bot detections](bot_detections.md)
- [Collection Format](/log_processor/collections/format.md)
- [Expression Language Documentation](/expr/intro.md)
- [cscli hubtest Documentation](/cscli/cscli_hubtest.md)
- [Hub Website](https://hub.crowdsec.net)
