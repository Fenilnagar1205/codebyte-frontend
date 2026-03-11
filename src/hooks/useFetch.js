import { useState, useEffect, useCallback } from "react";

export function useFetch(fetchFn, immediate = true) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError]     = useState("");

  const run = useCallback(async () => {
    setLoading(true); setError("");
    try   { setData(await fetchFn()); }
    catch (err) { setError(err.message); }
    finally     { setLoading(false); }
  }, [fetchFn]);

  useEffect(() => { if (immediate) run(); }, [immediate, run]);

  return { data, loading, error, refetch: run };
}
