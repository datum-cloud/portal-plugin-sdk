import { useHostBindings } from './use-host-bindings';
import type { UseResourceWatchOptions, UseResourceWatchResult } from '../types';

/**
 * Live updates for a resource in the current project's control plane,
 * through the portal's existing watch stream (the same multiplexed SSE
 * connection built-in pages use — a plugin never opens its own watch
 * connection to Kubernetes).
 */
export function useResourceWatch<T = unknown>(
  options: UseResourceWatchOptions<T>
): UseResourceWatchResult<T> {
  return useHostBindings('useResourceWatch').useResourceWatch(options);
}
