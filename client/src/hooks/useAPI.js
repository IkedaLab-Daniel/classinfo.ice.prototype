// Custom hooks for data fetching and state management
import { useState, useEffect, useCallback } from 'react';
import { scheduleAPI, instructorAPI, departmentAPI } from '../services/api';

// Generic hook for API calls with loading and error states
export const useAPI = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall();
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Hook for schedules
export const useSchedules = (params = {}) => {
  return useAPI(() => scheduleAPI.getAll(params), [JSON.stringify(params)]);
};

// Hook for today's schedules
export const useTodaySchedules = () => {
  return useAPI(() => scheduleAPI.getToday(), []);
};

// Hook for schedules by date
export const useSchedulesByDate = (date) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!date) {
      setData([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await scheduleAPI.getByDateRange(date, date);
      setData(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Hook for weekly schedules
export const useWeeklySchedules = (startDate, endDate) => {
  return useAPI(() => scheduleAPI.getByDateRange(startDate, endDate), [startDate, endDate]);
};

// Hook for instructors
export const useInstructors = (params = {}) => {
  return useAPI(() => instructorAPI.getAll(params), [JSON.stringify(params)]);
};

// Hook for instructor's schedule
export const useInstructorSchedule = (instructorId) => {
  return useAPI(() => instructorAPI.getSchedule(instructorId), [instructorId]);
};

// Hook for departments
export const useDepartments = (params = {}) => {
  return useAPI(() => departmentAPI.getAll(params), [JSON.stringify(params)]);
};

// Hook for creating/updating data
export const useAPIAction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (apiCall) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall();
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return { execute, loading, error };
};
