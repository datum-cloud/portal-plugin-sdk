# @datum-cloud/portal-plugin-sdk

## 1.1.0

### Minor Changes

- 488e5cc: Add `useResourceQuota` and `useRequestQuotaIncrease`, so a plugin can check a
  quota before a create and open the portal's quota increase request when it's
  used up. Both are new host bindings: a plugin that uses them must declare
  `sdk.range: "^1.1.0"` so an older portal marks it `Compatible=False` instead
  of loading it. `SDK_VERSION` is now `1.1.0`.

### Patch Changes

- 669ed1c: Pin patched versions of vulnerable transitive dependencies (vite, undici, brace-expansion, @vitest/mocker) to clear open security advisories.
- 9a0ef33: Initial npm-registry publish. Plugin consumers (e.g. the assistant repo's
  `ui/consumer`) were installing this as a `git+ssh://` dependency, which
  private-repo CI runners without an SSH deploy key can't clone — publishing
  to the registry fixes that and matches how `@datum-cloud/datum-ui` is
  already consumed.
