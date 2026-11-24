import { a as PluginQuotaScope, d as ResourceQuotaVerdict, f as UseResourceQuotaOptions, i as PluginProjectContextValue, l as QuotaIncreaseRequest, m as UseResourceWatchResult, n as PluginOrganization, o as PluginWatchEvent, p as UseResourceWatchOptions, r as PluginProject, s as PluginWatchEventType, t as PluginFetch, u as RequestQuotaIncrease } from "./types-DUi47Z6F.js";
//#region src/hooks/use-project-context.d.ts
/**
 * The current project and organization the plugin is mounted under. Backed
 * by the host's own project-resolution state (session, route params, and the
 * project/org fetch) — a plugin never resolves this itself.
 */
declare function useProjectContext(): PluginProjectContextValue;
//#endregion
//#region src/hooks/use-plugin-fetch.d.ts
/**
 * A `fetch` pre-scoped to the current project's control plane and mediated
 * through the portal's authenticated Milo proxy. This is the only data path
 * a plugin gets — every API call a plugin issues, including calls to a
 * service's own aggregated apiserver, must go through it. There is no
 * plugin-declared backend.
 */
declare function usePluginFetch(): PluginFetch;
//#endregion
//#region src/hooks/use-resource-watch.d.ts
/**
 * Live updates for a resource in the current project's control plane,
 * through the portal's existing watch stream (the same multiplexed SSE
 * connection built-in pages use — a plugin never opens its own watch
 * connection to Kubernetes).
 */
declare function useResourceWatch<T = unknown>(options: UseResourceWatchOptions<T>): UseResourceWatchResult<T>;
//#endregion
//#region src/hooks/use-resource-quota.d.ts
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
declare function useResourceQuota(options: UseResourceQuotaOptions): ResourceQuotaVerdict;
//#endregion
//#region src/hooks/use-request-quota-increase.d.ts
/**
 * Returns an action that opens the portal's quota increase request (the
 * same prefilled support message portal pages open), for a resource type
 * and scope. Pair it with `useResourceQuota` to offer "Request more" when
 * the quota is used up.
 *
 * Requires SDK 1.1.0 — declare `sdk.range: "^1.1.0"` in the plugin manifest.
 */
declare function useRequestQuotaIncrease(): RequestQuotaIncrease;
//#endregion
//#region src/version.d.ts
/**
 * Identity the host and a plugin's manifest both refer to. `SDK_VERSION`
 * follows the semver discipline from docs/enhancements/portal-plugin-system.md:
 * additive changes (new hook, new optional field) are minor releases;
 * removing an extension point or a hook is major, with a deprecation window.
 * The host compares its own advertised version against a plugin manifest's
 * `sdk.range` and refuses to load on a mismatch (`Compatible=False`) — this
 * constant is that source of truth on the SDK side.
 */
declare const SDK_NAME = "@datum-cloud/portal-plugin-sdk";
declare const SDK_VERSION = "1.1.0";
//#endregion
export { type PluginFetch, type PluginOrganization, type PluginProject, type PluginProjectContextValue, type PluginQuotaScope, type PluginWatchEvent, type PluginWatchEventType, type QuotaIncreaseRequest, type RequestQuotaIncrease, type ResourceQuotaVerdict, SDK_NAME, SDK_VERSION, type UseResourceQuotaOptions, type UseResourceWatchOptions, type UseResourceWatchResult, usePluginFetch, useProjectContext, useRequestQuotaIncrease, useResourceQuota, useResourceWatch };
//# sourceMappingURL=index.d.ts.map
