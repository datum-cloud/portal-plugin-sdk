# @datum-cloud/portal-plugin-sdk

The host-contract package for cloud-portal's [Portal Plugin
System](https://github.com/datum-cloud/cloud-portal/blob/main/docs/enhancements/portal-plugin-system.md).
A service team's plugin imports this package to reach what the
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

## Quota-gated actions (SDK 1.1.0+)

`useResourceQuota` gives the same verdict the portal's own pages use, so a
plugin can disable a create action before the API refuses it.
`useRequestQuotaIncrease` opens the portal's prefilled quota increase request.

```tsx
import { useRequestQuotaIncrease, useResourceQuota } from '@datum-cloud/portal-plugin-sdk';

const IPV4 = 'ipam.miloapis.com/public-ipv4claims';

function AddIPv4Button({ onAdd }: { onAdd: () => void }) {
  const quota = useResourceQuota({ resourceType: IPV4, scope: 'project' });
  const requestIncrease = useRequestQuotaIncrease();

  if (quota.isLoading) return <button disabled>Add IPv4 address</button>;

  // Public IPv4 defaults to 0, so "unknown" means "not allowed" here.
  if (quota.denied || quota.isUnknown) {
    return (
      <button
        onClick={() =>
          requestIncrease({
            resourceType: IPV4,
            scope: 'project',
            context: 'Public IPv4 for a network load balancer.',
          })
        }
      >
        Request IPv4 address
      </button>
    );
  }
  return <button onClick={onAdd}>Add IPv4 address</button>;
}
```

The verdict **fails open**: when the host can't read the quota it returns
`isUnknown: true, denied: false`, because for most resources the API's 403 is
the real gate. Gate on `denied` alone for those, and on `denied || isUnknown`
for resources that default to zero. The API remains the final check either
way.

A plugin that calls these hooks must declare `sdk.range: "^1.1.0"`.

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
  `usePluginFetch`, `useResourceWatch`, `useResourceQuota`,
  `useRequestQuotaIncrease`, and their result types. This is the
  package a plugin repository actually calls.
- `@datum-cloud/portal-plugin-sdk/host` — host-only wiring
  (`PortalPluginHostProvider`), imported by cloud-portal to supply the real
  implementations behind those hooks. A plugin should never import this.

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
