---
id: contributing_doc
title: Documentation
sidebar_position: 2
---

# Contributing basics

- Write Crowdsec documentation in Markdown and build the Crowdsec documentation using [docusaurus](https://docusaurus.io/)
- Docusaurus uses [markdown](https://docusaurus.io/docs/markdown-features) and [MDX](https://docusaurus.io/docs/markdown-features/react)
- The source code is in [GitHub](https://github.com/crowdsecurity/crowdsec-docs)
- The documentation is versioned and changes should be made across the relevant versions

# Tools for contributors

Crowdsec documentation is rendered using [docusaurus](https://docusaurus.io/) :

- Documentation can be rendered locally
- PRs are rendered using amplify to staging env

## Rendering locally

- Clone the github repository

- Run docusaurus locally

```bash
cd crowdsec-docs/
npm run start
```

## Previews

Once you open a pull request on the documentation repository, it will be rendered on a staging environement to facilitate the review process.

# Contributing

Once you have made your local changes, open a pull request (PR).
If your change is small or you're unfamiliar with git, you can [make your changes using Github web editor](https://docs.github.com/en/repositories/working-with-files/managing-files/editing-files).

In both cases, please make sure to include a meaningful description in your PR to facilitate review and triage.

Once your change is accepted or further requested changes are made, it will be merged.
