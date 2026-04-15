## Crowdsec documentation

This repository holds the documentation for the [crowdsec project](https://github.com/crowdsecurity/crowdsec).

Online version of this documentation is available here: https://doc.crowdsec.net/

The documentation is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Pre-requisites

- [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager)
- Node.js stable (install via nvm: `nvm install stable && nvm use stable`)
- VSCode with recommended extensions installed (see `.vscode/extensions.json`)

## Installation

```console
nvm use stable
cd crowdsec-docs
npm install
```

## Local Development

```console
nvm use stable
cd crowdsec-docs
npm start
# or equivalently
npx docusaurus start
```

This command starts a local development server at http://localhost:3000. Most changes are reflected live without having to restart the server.

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
