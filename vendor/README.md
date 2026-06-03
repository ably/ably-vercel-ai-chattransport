# Vendored SDK — temporary

`ably-ai-transport-0.1.0.tgz` is a **prebuilt snapshot** of the `@ably/ai-transport`
SDK, vendored here so this template installs and deploys today.

## Why this exists

This app uses SDK APIs (`createAgentSession`, `Invocation`, view branching,
`vercelRunEndReason`, the `session` handle, etc.) that are present in the SDK's
source but **not yet in the published npm release** (`@ably/ai-transport@0.1.0`
on npm predates them). To avoid blocking on a release, the SDK was built from
source and packed into the tarball referenced by `package.json`:

```json
"@ably/ai-transport": "file:vendor/ably-ai-transport-0.1.0.tgz"
```

- Built from: https://github.com/ably/ably-ai-transport-js commit `cf235b3`
- Built with: `pnpm install && pnpm run build` then `pnpm pack`

## TODO: switch to the npm release

A proper npm release that includes these APIs is expected shortly (~1 day as of
2026-06-03). Once it's out:

1. Set the dependency back to the published range, e.g.
   `"@ably/ai-transport": "^0.2.0"` (use the actual released version).
2. Delete this `vendor/` directory.
3. Run `npm install` and re-run `npm run build` to confirm it still builds.
