import { useState, useEffect, useCallback, useRef } from "react";

interface UseDataResult<T> {
  data: T;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Generic hook for async data fetching.
 *
 * @param fn   Async function that returns the data. Can be a service call
 *             or a combined Promise.all(() => ...) for multiple sources.
 * @param initial  Initial value for `data` while loading.
 * @param key  Optional value — when it changes, the hook re-fetches.
 *             Use this for detail pages that depend on a route param (e.g. id).
 *
 * @example Single source
 *   const { data: assets, loading, error, refetch } = useData(getAssets, []);
 *
 * @example Multiple sources
 *   const { data: { assets, incidents }, loading, error, refetch } = useData(
 *     () => Promise.all([getAssets(), getIncidents()])
 *           .then(([assets, incidents]) => ({ assets, incidents })),
 *     { assets: [] as Asset[], incidents: [] as Incident[] }
 *   );
 *
 * @example Detail page (re-fetches when id changes)
 *   const { data: asset, loading, error } = useData(
 *     () => getAssetById(id!), undefined, id
 *   );
 */
export function useData<T>(
  fn: () => Promise<T>,
  initial: T,
  key?: unknown
): UseDataResult<T> {
  const [data, setData] = useState<T>(initial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);

  // Always keep a ref to the latest fn to avoid stale closure issues
  // without requiring the caller to wrap fn in useCallback.
  const fnRef = useRef(fn);
  fnRef.current = fn;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fnRef.current()
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Error inesperado");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
     
  }, [revision, key]);

  const refetch = useCallback(() => setRevision((r) => r + 1), []);

  return { data, loading, error, refetch };
}
