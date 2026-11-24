/**
 * Host-only wiring — imported by cloud-portal, never by a plugin.
 *
 * Wrap the tree that mounts plugin components (the project layout, or at
 * minimum the plugin catch-all mount) in `<PortalPluginHostProvider>`, and
 * pass real implementations for every hook in `PortalPluginHostBindings`. Because this package is
 * registered as an eager, singleton Module Federation share (see
 * federation-host.ts's `hostShared()`), a plugin's `useProjectContext()` /
 * `usePluginFetch()` / `useResourceWatch()` / `useResourceQuota()` /
 * `useRequestQuotaIncrease()` calls resolve to this exact
 * Provider's value, even though the plugin bundle never imports this module.
 */
import { PortalPluginHostContext } from '../context';
import type { PortalPluginHostBindings } from '../types';
import type { ReactElement, ReactNode } from 'react';

export function PortalPluginHostProvider({
  bindings,
  children,
}: {
  bindings: PortalPluginHostBindings;
  children: ReactNode;
}): ReactElement {
  return (
    <PortalPluginHostContext.Provider value={bindings}>{children}</PortalPluginHostContext.Provider>
  );
}

export type { PortalPluginHostBindings } from '../types';
