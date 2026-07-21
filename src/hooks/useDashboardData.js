import { useState, useEffect, useCallback } from 'react';
import { fetchGoogleSheetData, transformDashboardData } from '../services/googleSheetsService';

const UPDATE_INTERVAL = 4 * 60 * 60 * 1000; // 4 hours

export const useDashboardData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching data...');
      const rawData = await fetchGoogleSheetData();
      console.log('Raw data:', rawData);
      const transformedData = transformDashboardData(rawData);
      console.log('Transformed data:', transformedData);
      setData(transformedData);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchData();
    }, UPDATE_INTERVAL);

    return () => clearInterval(intervalId);
  }, [fetchData]);

  return { data, loading, error, lastUpdated, refetch: fetchData };
};