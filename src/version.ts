/**
 * Identity the host and a plugin's manifest both refer to. `SDK_VERSION`
 * follows the semver discipline from docs/enhancements/portal-plugin-system.md:
 * additive changes (new hook, new optional field) are minor releases;
 * removing an extension point or a hook is major, with a deprecation window.
 * The host compares its own advertised version against a plugin manifest's
 * `sdk.range` and refuses to load on a mismatch (`Compatible=False`) — this
 * constant is that source of truth on the SDK side.
 */
export const SDK_NAME = '@datum-cloud/portal-plugin-sdk';
export const SDK_VERSION = '1.0.0';
