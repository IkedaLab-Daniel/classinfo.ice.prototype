// API service for communicating with the server
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Schedule API calls
export const scheduleAPI = {
  // Get all schedules with optional filtering
  getAll: (params = {}) => api.get('/schedules', { params }),
  
  // Get schedule by ID
  getById: (id) => api.get(`/schedules/${id}`),
  
  // Get today's schedules
  getToday: () => api.get('/schedules/filter/today'),
  
  // Get schedules in date range
  getByDateRange: (startDate, endDate) => api.get(`/schedules/range/${startDate}/${endDate}`),
  
  // Get schedules by instructor
  getByInstructor: (instructorName) => api.get(`/schedules/instructor/${instructorName}`),
  
  // Create new schedule
  create: (scheduleData) => api.post('/schedules', scheduleData),
  
  // Update schedule
  update: (id, scheduleData) => api.put(`/schedules/${id}`, scheduleData),
  
  // Delete schedule
  delete: (id) => api.delete(`/schedules/${id}`),
};

// Instructor API calls
export const instructorAPI = {
  // Get all instructors with optional filtering
  getAll: (params = {}) => api.get('/instructors', { params }),
  
  // Get instructor by ID
  getById: (id) => api.get(`/instructors/${id}`),
  
  // Get instructor's schedule
  getSchedule: (id) => api.get(`/instructors/${id}/schedule`),
  
  // Get instructors by department
  getByDepartment: (departmentName) => api.get(`/instructors/department/${departmentName}`),
  
  // Create new instructor
  create: (instructorData) => api.post('/instructors', instructorData),
  
  // Update instructor
  update: (id, instructorData) => api.put(`/instructors/${id}`, instructorData),
  
  // Delete instructor
  delete: (id) => api.delete(`/instructors/${id}`),
};

// Department API calls
export const departmentAPI = {
  // Get all departments with optional filtering
  getAll: (params = {}) => api.get('/departments', { params }),
  
  // Get department by ID
  getById: (id) => api.get(`/departments/${id}`),
  
  // Get department statistics
  getStats: (id) => api.get(`/departments/${id}/stats`),
  
  // Get department's instructors
  getInstructors: (id) => api.get(`/departments/${id}/instructors`),
  
  // Get department's schedule
  getSchedule: (id) => api.get(`/departments/${id}/schedule`),
  
  // Create new department
  create: (departmentData) => api.post('/departments', departmentData),
  
  // Update department
  update: (id, departmentData) => api.put(`/departments/${id}`, departmentData),
  
  // Delete department
  delete: (id) => api.delete(`/departments/${id}`),
};

// Health check
export const healthCheck = () => api.get('/health', { baseURL: 'http://localhost:5001' });

export default api;
