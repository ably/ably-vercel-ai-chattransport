---
name: Ably Chat Transport for the Vercel AI SDK
slug: ably-vercel-ai-chattransport
publisher: Ably
description: A Next.js chat app that routes Vercel AI SDK useChat traffic over Ably for resumable, multi-device realtime streaming.
framework:
  - Next.js
type:
  - AI
  - Realtime Apps
  - Starter
css:
  - Tailwind
githubUrl: https://github.com/ably/ably-vercel-ai-chattransport
demoUrl: https://ably-vercel-ai-chattransport.vercel.app
relatedTemplates:
  - nextjs-ai-chatbot
  - ably-nextjs-starter-kit
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/ably/ably-vercel-ai-chattransport&project-name=ably-vercel-ai-chattransport&repository-name=ably-vercel-ai-chattransport&env=ABLY_API_KEY,ANTHROPIC_API_KEY&envDescription=An%20Ably%20API%20key%20for%20realtime%20transport%20and%20an%20AI%20provider%20key&envLink=https://github.com/ably/ably-vercel-ai-chattransport/blob/main/.env.example
---

# Ably Chat Transport for the Vercel AI SDK

A Next.js chat app that plugs [Ably AI Transport](https://ably.com/docs/ai-transport) into the [Vercel AI SDK](https://ai-sdk.dev)'s [`useChat`](https://ai-sdk.dev/docs/reference/ai-sdk-ui/use-chat) hook. Instead of streaming model output over a single HTTP response, the response is published over an Ably channel — so streams are resumable, sync across devices and browser tabs, and survive reconnects.

It demonstrates server-side tools, client-side tools (browser geolocation), approval-gated tools, multi-client sync, edit/regenerate branching, mid-stream cancellation, and a live debug pane showing the raw Ably messages.

## Demo

https://ably-vercel-ai-chattransport.vercel.app

## How it works

- **Client** (`src/app/providers.tsx`) connects to Ably using token auth — it requests a short-lived JWT from `/api/auth/ably-token`, so your Ably API key never reaches the browser.
- **Auth route** (`src/app/api/auth/ably-token/route.ts`) signs a short-lived JWT server-side from `ABLY_API_KEY`, scoped to the connecting client's `clientId`.
- **Chat route** (`src/app/api/chat/route.ts`) receives the user's message, runs the model with `streamText`, and pipes the response back over Ably via the AI Transport SDK.
- **Model selection** (`src/app/api/chat/model.ts`) is driven by environment variables — set one provider's key and the app uses it.

The Ably API key reaches the server purely through the `ABLY_API_KEY` environment variable — set in `.env.local` locally, or via the Vercel deploy prompt (`&env=ABLY_API_KEY` on the deploy URL). This is the same key-into-server approach used by the [Ably Next.js fundamentals kit](https://github.com/ably-labs/ably-nextjs-fundamentals-kit).

## Environment variables

| Variable           | Required | Description                                                                 |
| ------------------ | -------- | --------------------------------------------------------------------------- |
| `ABLY_API_KEY`     | Yes      | Ably API key. Used server-side to mint token requests and publish messages. |
| `ANTHROPIC_API_KEY`| One of   | Anthropic key. Provider priority: Anthropic > AI Gateway > OpenAI.          |
| `AI_GATEWAY_API_KEY` | One of | Vercel AI Gateway key.                                                      |
| `OPENAI_API_KEY`   | One of   | OpenAI (or OpenAI-compatible) key.                                          |

Model name and endpoint overrides (`ANTHROPIC_MODEL`, `AI_GATEWAY_MODEL`, `OPENAI_MODEL`, `OPENAI_BASE_URL`) and the channel namespace (`NEXT_PUBLIC_ABLY_CHANNEL_NAMESPACE`) are optional — see [`.env.example`](./.env.example) for the full list and defaults.

## How to use

### One-click deploy

Deploy with [Vercel](https://vercel.com). You'll be prompted for `ABLY_API_KEY` and `ANTHROPIC_API_KEY`:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ably/ably-vercel-ai-chattransport&project-name=ably-vercel-ai-chattransport&repository-name=ably-vercel-ai-chattransport&env=ABLY_API_KEY,ANTHROPIC_API_KEY)

### Run locally

#### Prerequisites

- Node.js >= 20
- An [Ably API key](https://ably.com/accounts)
- One AI provider key: Anthropic, OpenAI, or a Vercel AI Gateway key

#### Setup

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# then set ABLY_API_KEY + one AI provider key

# Run the dev server
npm run dev
```

Open <http://localhost:3000>. Each fresh visit opens a new channel; append `?channel=<name>` to pin a specific one, or click **open in new tab** in the header to join the same channel as a second client.

## Learn more

- [Ably AI Transport docs](https://ably.com/docs/ai-transport)
- [Ably AI Transport SDK](https://github.com/ably/ably-ai-transport-js)
- [Vercel AI SDK docs](https://ai-sdk.dev)
