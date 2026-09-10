import { useHostBindings } from './use-host-bindings';
import type { PluginFetch } from '../types';

/**
 * A `fetch` pre-scoped to the current project's control plane and mediated
 * through the portal's authenticated Milo proxy. This is the only data path
 * a plugin gets — every API call a plugin issues, including calls to a
 * service's own aggregated apiserver, must go through it. There is no
 * plugin-declared backend.
 */
export function usePluginFetch(): PluginFetch {
  return useHostBindings('usePluginFetch').usePluginFetch();
}
