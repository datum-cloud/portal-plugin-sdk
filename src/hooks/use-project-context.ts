import { useHostBindings } from './use-host-bindings';
import type { PluginProjectContextValue } from '../types';

/**
 * The current project and organization the plugin is mounted under. Backed
 * by the host's own project-resolution state (session, route params, and the
 * project/org fetch) — a plugin never resolves this itself.
 */
export function useProjectContext(): PluginProjectContextValue {
  return useHostBindings('useProjectContext').useProjectContext();
}
