---
"@datum-cloud/portal-plugin-sdk": patch
---

Initial npm-registry publish. Plugin consumers (e.g. the assistant repo's
`ui/consumer`) were installing this as a `git+ssh://` dependency, which
private-repo CI runners without an SSH deploy key can't clone — publishing
to the registry fixes that and matches how `@datum-cloud/datum-ui` is
already consumed.
