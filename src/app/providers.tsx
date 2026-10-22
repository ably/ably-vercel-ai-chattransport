'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import * as Ably from 'ably';
import { LiveObjects } from 'ably/liveobjects';
import { AblyProvider } from 'ably/react';

const AblyReadyContext = createContext(false);

export function useAblyReady() {
  return useContext(AblyReadyContext);
}

export function Providers({
  channelName,
  clientId,
  children,
}: {
  channelName: string;
  clientId?: string;
  children: ReactNode;
}) {
  const [client, setClient] = useState<Ably.Realtime | null>(null);

  useEffect(() => {
    // The token endpoint scopes each token to this one channel.
    const authParams = new URLSearchParams({ channel: channelName });
    if (clientId) authParams.set('clientId', clientId);
    // `NEXT_PUBLIC_ABLY_ENDPOINT` lets the e2e tests point the browser client at
    // the Ably sandbox (`nonprod:sandbox`); unset in normal use, so it defaults
    // to production. It must match the endpoint the agent connects to.
    const endpoint = process.env.NEXT_PUBLIC_ABLY_ENDPOINT;
    const ably = new Ably.Realtime({
      authCallback: async (_tokenParams, callback) => {
        try {
          const response = await fetch(`/api/auth/ably-token?${authParams}`);
          const body = await response.text();
          if (!response.ok) {
            callback(`token request failed (${response.status}): ${body}`, null);
            return;
          }
          callback(null, body);
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          callback(message, null);
        }
      },
      // The checklist state lives in LiveObjects, which is an ably-js plugin —
      // without it, `session.object` throws.
      plugins: { LiveObjects },
      ...(endpoint ? { endpoint } : {}),
    });
    setClient(ably);
    return () => {
      ably.close();
    };
  }, [channelName, clientId]);

  if (!client) {
    return <AblyReadyContext.Provider value={false}>{children}</AblyReadyContext.Provider>;
  }

  return (
    <AblyProvider client={client}>
      <AblyReadyContext.Provider value={true}>{children}</AblyReadyContext.Provider>
    </AblyProvider>
  );
}
