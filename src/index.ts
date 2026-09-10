/**
 * @datum-cloud/portal-plugin-sdk — the versioned host contract for cloud-
 * portal's Portal Plugin System (docs/enhancements/portal-plugin-system.md
 * in the cloud-portal repo). Import from here in plugin code.
 *
 * Host wiring (`PortalPluginHostProvider`) lives at `./host` and is not
 * re-exported here — a plugin should never construct or read host bindings
 * directly, only call the hooks below.
 */
export type {
  PluginProject,
  PluginOrganization,
  PluginProjectContextValue,
  PluginFetch,
  PluginWatchEventType,
  PluginWatchEvent,
  UseResourceWatchOptions,
  UseResourceWatchResult,
} from './types';

export { useProjectContext, usePluginFetch, useResourceWatch } from './hooks';

export { SDK_NAME, SDK_VERSION } from './version';
