import { useState, useEffect, useMemo } from 'react';

export const useFetchData = (fetchFn, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoize fetchFn to ensure stable reference
  const memoizedFetchFn = useMemo(() => fetchFn, [fetchFn]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await memoizedFetchFn();
        console.log('useFetchData result:', result);
        setData(result);
      } catch (err) {
        console.error('useFetchData error:', err.message);
        setError(err.message);
        if (options.onError) options.onError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [memoizedFetchFn, options.onError]);

  return { data, loading, error };
};