import { useHostBindings } from './use-host-bindings';
import type { RequestQuotaIncrease } from '../types';

/**
 * Returns an action that opens the portal's quota increase request (the
 * same prefilled support message portal pages open), for a resource type
 * and scope. Pair it with `useResourceQuota` to offer "Request more" when
 * the quota is used up.
 *
 * Requires SDK 1.1.0 — declare `sdk.range: "^1.1.0"` in the plugin manifest.
 */
export function useRequestQuotaIncrease(): RequestQuotaIncrease {
  return useHostBindings('useRequestQuotaIncrease').useRequestQuotaIncrease();
}
