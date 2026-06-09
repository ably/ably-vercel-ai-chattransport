# Contributing

Thanks for your interest in contributing. Please read our [Code of Conduct](./CODE_OF_CONDUCT.md) to help keep this community welcoming and respectable.

## Where changes belong

This repository is a Vercel deployment template. Its application code under `src/app` mirrors the `useChat` demo in the Ably AI Transport SDK, [ably/ably-ai-transport-js](https://github.com/ably/ably-ai-transport-js) (under `demo/vercel/react/use-chat`). To keep the two in sync, please send changes to the right place:

- **Chat app behaviour** (components, hooks, API routes, transport usage) belongs in the SDK demo at [ably/ably-ai-transport-js](https://github.com/ably/ably-ai-transport-js). Changes there flow back into this template.
- **Template and packaging** (deployment config, environment setup, README, dependency versions) belongs here.

If you are unsure, open an issue first and we will help route it.

## Reporting issues

Before opening a [new issue](https://github.com/ably/ably-vercel-ai-chattransport/issues/new), [search existing issues](https://github.com/ably/ably-vercel-ai-chattransport/issues) to avoid duplicates. Include enough detail to reproduce the problem: what you expected, what happened, and the relevant environment (Node version, browser, and deployment target).

## Making changes

1. Fork the repository and create a branch from `main`.
2. Make your changes. See the [README](./README.md) for local setup (`npm install`, `cp .env.example .env.local`, then `npm run dev`).
3. Confirm the project builds and type-checks: `npm run build` and `npm run typecheck`.
4. Open a pull request against `main`, describing the change and linking any related issue.

A maintainer will review your pull request. We may ask for changes before merging.

## License

By contributing, you agree that your contributions will be licensed under the [Apache License 2.0](./LICENSE).
