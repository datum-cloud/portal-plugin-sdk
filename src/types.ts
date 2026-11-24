/**
 * Plugin-facing contract types. Kept dependency-free (no react-query, no
 * axios, no k8s client) so the SDK's own footprint never forces a version on
 * a plugin's toolchain — the host is free to implement these hooks with
 * whatever internal machinery it likes; only these shapes are the contract.
 */

// ═══════════════════════════════════════════════════════════
// useProjectContext()
// ═══════════════════════════════════════════════════════════

export interface PluginProject {
  /** Kubernetes resource name for the project; also its control-plane namespace. */
  name: string;
  displayName?: string;
}

export interface PluginOrganization {
  name: string;
  displayName?: string;
}

export interface PluginProjectContextValue {
  project: PluginProject | undefined;
  org: PluginOrganization | undefined;
  isLoading: boolean;
  error: Error | null;
}

// ═══════════════════════════════════════════════════════════
// usePluginFetch()
// ═══════════════════════════════════════════════════════════

/**
 * A `fetch`-like function pre-scoped to the current project's control plane
 * and already authenticated through the portal's session. `path` is just the
 * Kubernetes API path (e.g. `/apis/compute.miloapis.com/v1alpha1/namespaces/
 * default/workloads`) — the host prepends the project-scoped proxy prefix and
 * injects the session's auth. This is the only data path a plugin gets: there
 * is no plugin-declared backend, and a plugin never picks a base URL or auth
 * strategy itself.
 */
export type PluginFetch = (path: string, init?: RequestInit) => Promise<Response>;

// ═══════════════════════════════════════════════════════════
// useResourceWatch()
// ═══════════════════════════════════════════════════════════

export type PluginWatchEventType = 'ADDED' | 'MODIFIED' | 'DELETED' | 'BOOKMARK' | 'ERROR';

export interface PluginWatchEvent<T = unknown> {
  type: PluginWatchEventType;
  object: T;
}

export interface UseResourceWatchOptions<T = unknown> {
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

export interface UseResourceWatchResult<T = unknown> {
  /** Most recently received event, or `null` before the first one arrives. */
  lastEvent: PluginWatchEvent<T> | null;
  /** Whether the underlying watch stream is currently connected. */
  isConnected: boolean;
  error: Error | null;
}

// ═══════════════════════════════════════════════════════════
// useResourceQuota() / useRequestQuotaIncrease()
// ═══════════════════════════════════════════════════════════

/** Whose quota to read: the current project's, or its organization's. */
export type PluginQuotaScope = 'organization' | 'project';

export interface UseResourceQuotaOptions {
  /**
   * The quota resource type as registered with the quota system, e.g.
   * `ipam.miloapis.com/public-ipv4claims`. This is the quota system's
   * identifier, not a `useResourceWatch` group/version/resource path.
   */
  resourceType: string;
  scope: PluginQuotaScope;
}

/**
 * The host's verdict on one quota for the current project or organization.
 * Same meaning and copy as the portal's own quota-gated pages.
 *
 * The verdict fails open: a missing or unreadable allowance bucket reads as
 * `isUnknown: true, denied: false`, because for most resources the API's 403
 * is the real gate. For a resource that defaults to zero (e.g. public IPv4),
 * treat `isUnknown` as "not allowed" yourself — the SDK doesn't choose.
 */
export interface ResourceQuotaVerdict {
  /** True until the host has read the quota. Never pair with `denied`. */
  isLoading: boolean;
  /** The host couldn't tell (no bucket, read failed, or not a counted resource). */
  isUnknown: boolean;
  /** Definitive "used up": never true while loading or unknown. */
  denied: boolean;
  /** Human-readable reason, set only when `denied`. */
  deniedReason?: string;
  /** Set only when the quota is known. */
  limit?: number;
  allocated?: number;
  available?: number;
}

export interface QuotaIncreaseRequest {
  /** Same identifier as `UseResourceQuotaOptions.resourceType`. */
  resourceType: string;
  scope: PluginQuotaScope;
  /**
   * Optional extra context added to the prefilled request, e.g.
   * "Public IPv4 for a network load balancer."
   */
  context?: string;
}

/** Opens the portal's quota increase request, prefilled for one quota. */
export type RequestQuotaIncrease = (request: QuotaIncreaseRequest) => void;

// ═══════════════════════════════════════════════════════════
// Host binding contract
// ═══════════════════════════════════════════════════════════

/**
 * The real implementations the host supplies behind the plugin-facing hooks.
 * Never imported by a plugin — only by cloud-portal, via `./host`. Shaped as
 * a bag of hooks (not a single fetch/watch pair) so the host can freely use
 * its own React Query / watch-manager internals in each implementation.
 */
export interface PortalPluginHostBindings {
  useProjectContext(): PluginProjectContextValue;
  usePluginFetch(): PluginFetch;
  useResourceWatch<T = unknown>(options: UseResourceWatchOptions<T>): UseResourceWatchResult<T>;
  /** @since 1.1.0 — must stay live: re-render when the allowance bucket changes. */
  useResourceQuota(options: UseResourceQuotaOptions): ResourceQuotaVerdict;
  /** @since 1.1.0 */
  useRequestQuotaIncrease(): RequestQuotaIncrease;
}
