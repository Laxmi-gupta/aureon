/**
 * Thin fetch wrapper matching the shape the .NET 8 Web API is expected to
 * expose. Not wired into any service yet — the app currently runs entirely
 * on the mock service implementations in `services/*.service.ts`.
 *
 * To connect the real backend later:
 *   1. Set VITE_API_BASE_URL in the environment.
 *   2. Implement a `Rest*Service` class per domain against this client,
 *      matching the existing service interface (e.g. `ProjectsService`).
 *   3. Swap the export in the relevant `*.service.ts` file from the mock
 *      instance to the REST instance. No consuming component changes.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal;
}

class ApiClient {
  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: options.method ?? 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: options.signal,
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status} ${response.statusText}`);
    }

    if (response.status === 204) return undefined as T;
    return (await response.json()) as T;
  }
}

export const apiClient = new ApiClient();
