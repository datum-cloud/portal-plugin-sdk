//#region src/types.d.ts
/**
 * Plugin-facing contract types. Kept dependency-free (no react-query, no
 * axios, no k8s client) so the SDK's own footprint never forces a version on
 * a plugin's toolchain — the host is free to implement these hooks with
 * whatever internal machinery it likes; only these shapes are the contract.
 */
interface PluginProject {
  /** Kubernetes resource name for the project; also its control-plane namespace. */
  name: string;
  displayName?: string;
}
interface PluginOrganization {
  name: string;
  displayName?: string;
}
interface PluginProjectContextValue {
  project: PluginProject | undefined;
  org: PluginOrganization | undefined;
  isLoading: boolean;
  error: Error | null;
}
/**
 * A `fetch`-like function pre-scoped to the current project's control plane
 * and already authenticated through the portal's session. `path` is just the
 * Kubernetes API path (e.g. `/apis/compute.miloapis.com/v1alpha1/namespaces/
 * default/workloads`) — the host prepends the project-scoped proxy prefix and
 * injects the session's auth. This is the only data path a plugin gets: there
 * is no plugin-declared backend, and a plugin never picks a base URL or auth
 * strategy itself.
 */
type PluginFetch = (path: string, init?: RequestInit) => Promise<Response>;
type PluginWatchEventType = 'ADDED' | 'MODIFIED' | 'DELETED' | 'BOOKMARK' | 'ERROR';
interface PluginWatchEvent<T = unknown> {
  type: PluginWatchEventType;
  object: T;
}
interface UseResourceWatchOptions<T = unknown> {
  /** e.g. `compute.miloapis.com/v1alpha1/workloads`. Scoped to the current project. */
  resourceType: string;
  /** Watch a single named resource instead of a list. */
  name?: string;
  /** K8s namespace within the project's control plane. Defaults to `default`. */
  namespace?: string;
  labelSelector?: string;
  fieldSelector?: string;
  /** Set false to pause the subscription without unmounting. @default true */
  enabled?: boolean;
  /** Transform the raw watched object before it reaches `lastEvent`/`onEvent`. */
  transform?: (raw: unknown) => T;
  /** Imperative event handler, called for every event in addition to the returned state. */
  onEvent?: (event: PluginWatchEvent<T>) => void;
}
interface UseResourceWatchResult<T = unknown> {
  /** Most recently received event, or `null` before the first one arrives. */
  lastEvent: PluginWatchEvent<T> | null;
  /** Whether the underlying watch stream is currently connected. */
  isConnected: boolean;
  error: Error | null;
}
/**
 * The real implementations the host supplies behind the plugin-facing hooks.
 * Never imported by a plugin — only by cloud-portal, via `./host`. Shaped as
 * a bag of hooks (not a single fetch/watch pair) so the host can freely use
 * its own React Query / watch-manager internals in each implementation.
 */
interface PortalPluginHostBindings {
  useProjectContext(): PluginProjectContextValue;
  usePluginFetch(): PluginFetch;
  useResourceWatch<T = unknown>(options: UseResourceWatchOptions<T>): UseResourceWatchResult<T>;
}
//#endregion
export { PluginWatchEvent as a, UseResourceWatchOptions as c, PluginProjectContextValue as i, UseResourceWatchResult as l, PluginOrganization as n, PluginWatchEventType as o, PluginProject as r, PortalPluginHostBindings as s, PluginFetch as t };
//# sourceMappingURL=types-CvoOm66Q.d.ts.map