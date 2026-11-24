---
"@datum-cloud/portal-plugin-sdk": minor
---

Add `useResourceQuota` and `useRequestQuotaIncrease`, so a plugin can check a
quota before a create and open the portal's quota increase request when it's
used up. Both are new host bindings: a plugin that uses them must declare
`sdk.range: "^1.1.0"` so an older portal marks it `Compatible=False` instead
of loading it. `SDK_VERSION` is now `1.1.0`.
