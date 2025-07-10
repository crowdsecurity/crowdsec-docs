## Crowdsec documentation

This repository holds the documentation for the [crowdsec project](https://github.com/crowdsecurity/crowdsec).

Online version of this documentation is available here: https://doc.crowdsec.net/

The documentation is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Pre-requisites

- Node.js (version 20 or later)
- npm (Node package manager)
- VSCode with recommended extensions installed (see `.vscode/extensions.json`)

## Installation

```console
npm install
```

## Local Development

```console
npm run start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```console
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.
you can also use the `npm run serve` command to test the build locally.

## Linting and Formatting

This project uses [Biomes](https://biomejs.dev/) for linting and formatting. You can run the following commands:

```console
npm run lint
npm run format
```
