import { PortalPluginHostContext } from '../context';
import type { PortalPluginHostBindings } from '../types';
import { useContext } from 'react';

/**
 * Every plugin-facing hook delegates to the host's real implementation rather
 * than containing any logic itself — the SDK is a contract, not a client
 * library. This throws with a specific, actionable message rather than
 * silently returning defaults, because a missing binding here almost always
 * means the MF shared-singleton wiring is wrong, not that the plugin did
 * something incorrectly.
 */
export function useHostBindings(hookName: string): PortalPluginHostBindings {
  const bindings = useContext(PortalPluginHostContext);
  if (!bindings) {
    throw new Error(
      `${hookName}() was called outside the portal host's PortalPluginHostProvider. ` +
        'This usually means @datum-cloud/portal-plugin-sdk is not registered as a Module ' +
        "Federation shared singleton on the host, so the plugin's import resolved to a " +
        "separate, unbound copy of this package instead of the host's — see " +
        '@datum-cloud/portal-plugin-sdk/host.'
    );
  }
  return bindings;
}
