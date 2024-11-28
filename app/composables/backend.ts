import { createActor } from '#decs/backend';

export function useBackend() {
  const config = useRuntimeConfig();

  return createActor(config.public.canisterId, {
    agentOptions: {
      host: import.meta.dev ? 'http://127.0.0.1:4943' : undefined, // Required for local dev server
    },
  });
}
