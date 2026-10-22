/**
 * Ably JWT token endpoint.
 *
 * Issues short-lived JWTs signed with the Ably API key secret.
 * The client connects to Ably with an `authCallback` that fetches from here.
 *
 * This endpoint does not authenticate the caller: the template has no user
 * accounts, so the `clientId` is whatever the browser asks for. In a real app,
 * authenticate the request first and take the `clientId` from the signed-in
 * user instead of the query string.
 *
 * See: https://ably.com/docs/ai-transport/sessions-identity/identifying-users-and-agents
 */

import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

import { generateClientName, isSessionChannel, isValidClientId } from '../../../lib/channel-name';

export async function GET(req: Request) {
  const apiKey = process.env.ABLY_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'ABLY_API_KEY not set' }, { status: 500 });
  }

  const [keyName, keySecret] = apiKey.split(':');

  const url = new URL(req.url);

  // The token is scoped to the one session channel the client asks for, not
  // to the whole namespace, so it grants nothing on any other session.
  const channel = url.searchParams.get('channel');
  if (!channel || !isSessionChannel(channel)) {
    return NextResponse.json({ error: 'channel must be a session channel in the configured namespace' }, { status: 400 });
  }

  // Use clientId from query param, or generate a random one.
  const clientId = url.searchParams.get('clientId') ?? generateClientName();
  if (!isValidClientId(clientId)) {
    return NextResponse.json({ error: 'invalid clientId' }, { status: 400 });
  }

  // The checklist state lives in LiveObjects, so the token must also permit
  // the object operations — without them the server grants the channel's
  // object modes as an empty subset and object reads/writes fail.
  const capability = ['publish', 'subscribe', 'presence', 'history', 'object-subscribe', 'object-publish'];

  const token = jwt.sign(
    {
      'x-ably-clientId': clientId,
      'x-ably-capability': JSON.stringify({ [channel]: capability }),
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
