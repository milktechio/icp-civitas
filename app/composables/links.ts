import type { NuxtLinkProps } from '#app';
import type { RouteLocationRaw } from '#vue-router';

import { isEqual } from 'ohash';

/** Options allowed by the useLinkState composable */
export interface UseLinkStateOptions {
  /** Override active state */
  isActive?: MaybeRefOrGetter<boolean | undefined>;
  /** List of paths to include the "active" state. Has lower priority than excludePaths */
  includePaths?: string[];
  /** List of paths to exclude the "active" state. Has higher priority than includePaths */
  excludePaths?: string[];
  /** Require the exact link path to be active */
  exact?: boolean;
  /** Require the link's query to be an exact match to be active */
  exactQuery?: boolean;
  /** Require the link's hash to be an exact match to be active */
  exactHash?: boolean;
}

function isRouteLocation(route: unknown): route is RouteLocationRaw {
  return (typeof route === 'string' && !route.startsWith('http')) || (!!route && typeof route === 'object');
}

/**
 * Composable to have more control over link active/inactive states.
 */
export function useLinkState(linkProps: MaybeRefOrGetter<NuxtLinkProps>, options?: UseLinkStateOptions) {
  const $linkProps = toRef(linkProps);

  const router = useRouter();
  const currentRoute = useRoute();

  const resolvedRoute = computed(() => {
    if ($linkProps.value.external || !isRouteLocation($linkProps.value.to)) return null;
    return router.resolve($linkProps.value.to);
  });

  const isPathActive = computed<boolean>(() =>
    !resolvedRoute.value ? false : currentRoute.path.startsWith(resolvedRoute.value.path),
  );

  const isLinkActive = computed<boolean>(() => {
    if (!options) return isPathActive.value;

    const activeOverride = toValue(options.isActive);
    if (activeOverride !== undefined) return activeOverride;

    if (!resolvedRoute.value) return false;

    if (options.exact)
      return (
        currentRoute.name === resolvedRoute.value.name && // Same route name
        isEqual(resolvedRoute.value.query, currentRoute.query) && // Same query
        resolvedRoute.value.hash === currentRoute.hash // Same hash
      );

    if (options.exactQuery && !isEqual(resolvedRoute.value.query, currentRoute.query)) return false;

    if (options.exactHash && resolvedRoute.value.hash !== currentRoute.hash) return false;

    // Excluded paths have higher priority than included ones
    if (options.excludePaths?.length) {
      for (const excludedPath of options.excludePaths) {
        if (currentRoute.path.startsWith(excludedPath)) return false;
      }
    }

    // Check if the current route is included to be highlighted
    if (options.includePaths?.length) {
      for (const includedPath of options.includePaths) {
        if (currentRoute.path.startsWith(includedPath)) return true;
      }
    }

    return isPathActive.value;
  });

  return { isLinkActive };
}
