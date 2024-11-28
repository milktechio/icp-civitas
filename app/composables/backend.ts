import { createActor } from '#decs/backend';

export function useBackend() {
  const config = useRuntimeConfig();

  return createActor(config.public.canisterId);
}
