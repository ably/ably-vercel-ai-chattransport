/**
 * Ably JWT token endpoint.
 *
 * Issues short-lived JWTs signed with the Ably API key secret.
 * The client connects to Ably with `authUrl` pointing here.
 *
 * See: https://ably.com/docs/ai-transport/sessions-identity/identifying-users-and-agents
 */

import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const apiKey = process.env.ABLY_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'ABLY_API_KEY not set' }, { status: 500 });
  }

  const [keyName, keySecret] = apiKey.split(':');

  // Use clientId from query param, or generate a random one.
  const url = new URL(req.url);
  const clientId = url.searchParams.get('clientId') ?? `user-${crypto.randomUUID().slice(0, 8)}`;

  // Scope the token to the channel namespace (least privilege) rather than
  // granting '*' across the whole Ably app. Channels are named
  // `<namespace><slug>` (see src/app/lib/channel-name.ts), so `<namespace>*`
  // covers every session channel. Consequence: pinning a channel via
  // ?channel=<name> only works if that name falls under this namespace.
  const namespace = process.env.NEXT_PUBLIC_ABLY_CHANNEL_NAMESPACE ?? 'ai:';
  const capability = { [`${namespace}*`]: ['publish', 'subscribe', 'history'] };

  const token = jwt.sign(
    {
      'x-ably-clientId': clientId,
      'x-ably-capability': JSON.stringify(capability),
    },
    keySecret,
    {
      algorithm: 'HS256',
      keyid: keyName,
      expiresIn: '1h',
    },
  );

  return new NextResponse(token, {
    headers: { 'Content-Type': 'application/jwt' },
  });
}
