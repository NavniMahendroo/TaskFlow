import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/tasks';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchTasks = async () => {
  const response = await apiClient.get('/');
  return response.data.data;
};

export const createTask = async (taskData) => {
  const response = await apiClient.post('/', taskData);
  return response.data.data;
};

export const updateTask = async ({ id, ...updatedData }) => {
  const response = await apiClient.put(`/${id}`, updatedData);
  return response.data.data;
};

export const deleteTask = async (id) => {
  const response = await apiClient.delete(`/${id}`);
  return response.data;
};
