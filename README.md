# @datum-cloud/portal-plugin-sdk

The host-contract package for cloud-portal's [Portal Plugin
System](https://github.com/datum-cloud/cloud-portal/blob/main/docs/enhancements/portal-plugin-system.md).
A service team's plugin imports this package to reach the three things the
host provides — never a plugin-declared backend, and never a hand-rolled
stand-in.

```tsx
import { useProjectContext, usePluginFetch, useResourceWatch } from '@datum-cloud/portal-plugin-sdk';

function InstanceList() {
  const { project } = useProjectContext();
  const pluginFetch = usePluginFetch();
  const { lastEvent } = useResourceWatch({
    resourceType: 'compute.miloapis.com/v1alpha1/workloads',
  });

  // pluginFetch is pre-scoped to `project`'s control plane and already
  // authenticated — the path below is just the K8s API path.
  // await pluginFetch('/apis/compute.miloapis.com/v1alpha1/namespaces/default/workloads')

  return <div>{project?.displayName}</div>;
}
```

## Why a singleton, not a normal npm dependency

Plugins are loaded via Module Federation, in the host's own JavaScript realm.
If a plugin bundled its own copy of this package, its `useContext()` calls
would read from its own private Context — never the host's. The host
registers `@datum-cloud/portal-plugin-sdk` as an **eager singleton** shared
module (see cloud-portal's `federation-host.ts`), the same way it shares
`react` and `react-router`, so every plugin resolves the host's exact module
instance at runtime regardless of what version it was built against.

## Two entry points, two audiences

- `@datum-cloud/portal-plugin-sdk` — the plugin-facing surface: `useProjectContext`,
  `usePluginFetch`, `useResourceWatch`, and their result types. This is the
  package a plugin repository actually calls.
- `@datum-cloud/portal-plugin-sdk/host` — host-only wiring
  (`PortalPluginHostProvider`), imported by cloud-portal to supply the real
  implementations behind those three hooks. A plugin should never import this.

## Versioning

The host advertises its SDK version; a plugin manifest whose `sdk.range`
doesn't match is not loaded (`Compatible=False`). Per the enhancement doc:
additive changes (a new optional field, a new hook) are **minor**; removing a
hook or a required field is **major**, with a deprecation window. Both entry
points are part of that same contract — a breaking change to either is a
major bump.

## Development

```bash
pnpm install
pnpm build
pnpm test
pnpm typecheck
```
