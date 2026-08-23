/**
 * Simulates realistic network latency for the mock service layer so
 * loading states, skeletons, and optimistic UI can be built and tested
 * against real-feeling async behavior before a backend exists.
 */
export function withLatency<T>(value: T, ms = 380): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms);
  });
}

export class ServiceError extends Error {}
