/**
 * The single React Context instance shared by both this package's plugin-
 * facing hooks (`.`) and the host-only Provider (`./host`).
 *
 * Why this matters for Module Federation: a Context object is only ever the
 * same Context to `useContext()` if it is literally the same module instance.
 * If the host and a plugin each bundled their own copy of this package, the
 * plugin's `useProjectContext()` would read from the plugin's own empty
 * Context — never the host's Provider. That's why cloud-portal's federation
 * host must register `@datum-cloud/portal-plugin-sdk` itself as a Module
 * Federation shared singleton (`singleton: true, eager: true`), exactly like
 * `react` and `react-router` — see the host's federation-host.ts. As long as
 * that's true, every consumer (host and every plugin) resolves this same
 * module, so this same `createContext` call.
 */
import { createContext } from 'react';
import type { PortalPluginHostBindings } from './types';

export const PortalPluginHostContext = createContext<PortalPluginHostBindings | null>(null);
