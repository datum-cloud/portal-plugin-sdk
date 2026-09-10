import { a as PluginWatchEvent, c as UseResourceWatchOptions, i as PluginProjectContextValue, l as UseResourceWatchResult, n as PluginOrganization, o as PluginWatchEventType, r as PluginProject, t as PluginFetch } from "./types-CvoOm66Q.js";
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
declare const SDK_VERSION = "1.0.0";
//#endregion
export { type PluginFetch, type PluginOrganization, type PluginProject, type PluginProjectContextValue, type PluginWatchEvent, type PluginWatchEventType, SDK_NAME, SDK_VERSION, type UseResourceWatchOptions, type UseResourceWatchResult, usePluginFetch, useProjectContext, useResourceWatch };
//# sourceMappingURL=index.d.ts.map
