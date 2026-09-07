import { vi } from "vitest";

// `vi.mock` is itself hoisted to the top of the importing file, so it must
// not be nested inside `vi.hoisted()` — Vitest 4 rejects that as ambiguous
// (both are hoisted independently, so the nesting can't reflect real
// call order). Importing this module first is what gives the mock priority
// in the consuming test file.
vi.mock("next/cache", () => ({
  unstable_cache: (fn: (...args: unknown[]) => unknown) => {
    const cacheStore = new Map<string, unknown>();
    return async (...args: unknown[]) => {
      const key = JSON.stringify(args);
      if (cacheStore.has(key)) {
        return cacheStore.get(key);
      }
      const result = await fn(...args);
      cacheStore.set(key, result);
      return result;
    };
  },
}));

export const mockUnstableCache = true;
