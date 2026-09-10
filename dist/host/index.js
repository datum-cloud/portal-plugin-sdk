import { t as PortalPluginHostContext } from "../context-Cl6RRw0h.js";
import { jsx } from "react/jsx-runtime";
//#region src/host/index.tsx
/**
* Host-only wiring — imported by cloud-portal, never by a plugin.
*
* Wrap the tree that mounts plugin components (the project layout, or at
* minimum the plugin catch-all mount) in `<PortalPluginHostProvider>`, and
* pass real implementations for the three hooks. Because this package is
* registered as an eager, singleton Module Federation share (see
* federation-host.ts's `hostShared()`), a plugin's `useProjectContext()` /
* `usePluginFetch()` / `useResourceWatch()` calls resolve to this exact
* Provider's value, even though the plugin bundle never imports this module.
*/
function PortalPluginHostProvider({ bindings, children }) {
	return /* @__PURE__ */ jsx(PortalPluginHostContext.Provider, {
		value: bindings,
		children
	});
}
//#endregion
export { PortalPluginHostProvider };

//# sourceMappingURL=index.js.map
