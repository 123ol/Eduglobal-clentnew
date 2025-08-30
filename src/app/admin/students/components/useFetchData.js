import { useState, useEffect, useCallback } from 'react';
import { getAllStudents } from './data';

const useFetchData = (search = '') => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const students = await getAllStudents(search);
      setData(students);
    } catch (err) {
      console.error('useFetchData error:', err.message);
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error };
};

export { useFetchData };