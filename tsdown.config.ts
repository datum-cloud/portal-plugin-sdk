import { defineConfig } from 'tsdown';

// Two entry points mirror the two-audience export surface: `.` is the
// plugin-facing hooks + types (what a service team's plugin bundles), and
// `./host` is the cloud-portal-only wiring (PortalPluginHostProvider). Both
// compile from the same package so the React Context they share is the exact
// same module instance — see src/context.ts for why that identity matters
// across the Module Federation boundary.
export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'host/index': 'src/host/index.tsx',
  },
  format: ['esm'],
  dts: true,
  clean: true,
  platform: 'browser',
  deps: { neverBundle: ['react', 'react-dom'] },
});
