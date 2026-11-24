import { useHostBindings } from './use-host-bindings';
import type { ResourceQuotaVerdict, UseResourceQuotaOptions } from '../types';

/**
 * Whether the current project (or its organization) has quota left for a
 * resource, so a plugin can disable a create action before the API refuses
 * it. Stays live: the verdict updates when the allowance bucket changes.
 *
 * The verdict fails open (`isUnknown: true, denied: false`) when the host
 * can't read the quota. For resources that default to zero, such as public
 * IPv4, gate on `denied || isUnknown` instead of `denied` alone.
 *
 * Requires SDK 1.1.0 — declare `sdk.range: "^1.1.0"` in the plugin manifest.
 */
export function useResourceQuota(options: UseResourceQuotaOptions): ResourceQuotaVerdict {
  return useHostBindings('useResourceQuota').useResourceQuota(options);
}
