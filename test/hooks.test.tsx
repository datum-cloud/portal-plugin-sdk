import { PortalPluginHostProvider } from '../src/host';
import {
  usePluginFetch,
  useProjectContext,
  useRequestQuotaIncrease,
  useResourceQuota,
  useResourceWatch,
} from '../src/index';
import type { PortalPluginHostBindings } from '../src/types';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

function makeBindings(overrides: Partial<PortalPluginHostBindings> = {}): PortalPluginHostBindings {
  return {
    useProjectContext: () => ({
      project: { name: 'project-a', displayName: 'Project A' },
      org: { name: 'org-a' },
      isLoading: false,
      error: null,
    }),
    usePluginFetch: () => async (path: string, init?: RequestInit) => fetch(path, init),
    useResourceWatch: () => ({ lastEvent: null, isConnected: true, error: null }),
    useResourceQuota: () => ({ isLoading: false, isUnknown: false, denied: false }),
    useRequestQuotaIncrease: () => () => {},
    ...overrides,
  };
}

function ProbeComponent() {
  const { project } = useProjectContext();
  usePluginFetch();
  const watch = useResourceWatch({ resourceType: 'compute.miloapis.com/v1alpha1/workloads' });
  return (
    <div>
      <span data-testid="project">{project?.name}</span>
      <span data-testid="connected">{String(watch.isConnected)}</span>
    </div>
  );
}

describe('plugin-facing hooks', () => {
  it('read through the host-supplied bindings when wrapped in the provider', () => {
    render(
      <PortalPluginHostProvider bindings={makeBindings()}>
        <ProbeComponent />
      </PortalPluginHostProvider>
    );

    expect(screen.getByTestId('project').textContent).toBe('project-a');
    expect(screen.getByTestId('connected').textContent).toBe('true');
  });

  it('throw a specific error when rendered outside the host provider', () => {
    // React logs the thrown render error to console.error; suppress the noise
    // for this expected-failure assertion.
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<ProbeComponent />)).toThrow(/PortalPluginHostProvider/);
    spy.mockRestore();
  });

  it('pass quota options to the host and return its verdict', () => {
    const useQuota = vi.fn(() => ({
      isLoading: false,
      isUnknown: false,
      denied: true,
      deniedReason: 'Used up',
      limit: 1,
      allocated: 1,
      available: 0,
    }));

    function QuotaProbe() {
      const verdict = useResourceQuota({
        resourceType: 'ipam.miloapis.com/public-ipv4claims',
        scope: 'project',
      });
      return <span data-testid="reason">{verdict.denied ? verdict.deniedReason : 'ok'}</span>;
    }

    render(
      <PortalPluginHostProvider bindings={makeBindings({ useResourceQuota: useQuota })}>
        <QuotaProbe />
      </PortalPluginHostProvider>
    );

    expect(useQuota).toHaveBeenCalledWith({
      resourceType: 'ipam.miloapis.com/public-ipv4claims',
      scope: 'project',
    });
    expect(screen.getByTestId('reason').textContent).toBe('Used up');
  });

  it('return the host action for requesting a quota increase', () => {
    const request = vi.fn();
    let action: ReturnType<typeof useRequestQuotaIncrease> | undefined;

    function RequestProbe() {
      action = useRequestQuotaIncrease();
      return null;
    }

    render(
      <PortalPluginHostProvider
        bindings={makeBindings({ useRequestQuotaIncrease: () => request })}
      >
        <RequestProbe />
      </PortalPluginHostProvider>
    );

    action?.({
      resourceType: 'ipam.miloapis.com/public-ipv4claims',
      scope: 'project',
      context: 'Public IPv4 for a network load balancer.',
    });
    expect(request).toHaveBeenCalledWith({
      resourceType: 'ipam.miloapis.com/public-ipv4claims',
      scope: 'project',
      context: 'Public IPv4 for a network load balancer.',
    });
  });
});
