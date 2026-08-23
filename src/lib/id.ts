let counter = 0;

/** Deterministic-enough id generator for mock data and optimistic client records. */
export function createId(prefix: string): string {
  counter += 1;
  return `${prefix}_${Date.now().toString(36)}${counter.toString(36)}`;
}
