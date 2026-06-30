import { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboard.service';
import { DashboardStats } from '../types/dashboard.types';

export const useDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getDashboardStats();
        setStats(data);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return { loading, stats, error };
};