import { t as PortalPluginHostContext } from "./context-Cl6RRw0h.js";
import { useContext } from "react";
//#region src/hooks/use-host-bindings.ts
/**
* Every plugin-facing hook delegates to the host's real implementation rather
* than containing any logic itself — the SDK is a contract, not a client
* library. This throws with a specific, actionable message rather than
* silently returning defaults, because a missing binding here almost always
* means the MF shared-singleton wiring is wrong, not that the plugin did
* something incorrectly.
*/
function useHostBindings(hookName) {
	const bindings = useContext(PortalPluginHostContext);
	if (!bindings) throw new Error(`${hookName}() was called outside the portal host's PortalPluginHostProvider. This usually means @datum-cloud/portal-plugin-sdk is not registered as a Module Federation shared singleton on the host, so the plugin's import resolved to a separate, unbound copy of this package instead of the host's — see @datum-cloud/portal-plugin-sdk/host.`);
	return bindings;
}
//#endregion
//#region src/hooks/use-project-context.ts
/**
* The current project and organization the plugin is mounted under. Backed
* by the host's own project-resolution state (session, route params, and the
* project/org fetch) — a plugin never resolves this itself.
*/
function useProjectContext() {
	return useHostBindings("useProjectContext").useProjectContext();
}
//#endregion
//#region src/hooks/use-plugin-fetch.ts
/**
* A `fetch` pre-scoped to the current project's control plane and mediated
* through the portal's authenticated Milo proxy. This is the only data path
* a plugin gets — every API call a plugin issues, including calls to a
* service's own aggregated apiserver, must go through it. There is no
* plugin-declared backend.
*/
function usePluginFetch() {
	return useHostBindings("usePluginFetch").usePluginFetch();
}
//#endregion
//#region src/hooks/use-resource-watch.ts
/**
* Live updates for a resource in the current project's control plane,
* through the portal's existing watch stream (the same multiplexed SSE
* connection built-in pages use — a plugin never opens its own watch
* connection to Kubernetes).
*/
function useResourceWatch(options) {
	return useHostBindings("useResourceWatch").useResourceWatch(options);
}
//#endregion
//#region src/version.ts
/**
* Identity the host and a plugin's manifest both refer to. `SDK_VERSION`
* follows the semver discipline from docs/enhancements/portal-plugin-system.md:
* additive changes (new hook, new optional field) are minor releases;
* removing an extension point or a hook is major, with a deprecation window.
* The host compares its own advertised version against a plugin manifest's
* `sdk.range` and refuses to load on a mismatch (`Compatible=False`) — this
* constant is that source of truth on the SDK side.
*/
const SDK_NAME = "@datum-cloud/portal-plugin-sdk";
const SDK_VERSION = "1.0.0";
//#endregion
export { SDK_NAME, SDK_VERSION, usePluginFetch, useProjectContext, useResourceWatch };

//# sourceMappingURL=index.js.map
