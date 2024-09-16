import axios from 'axios';

const API_URL = 'api/auth'; // Update with your backend URL

export const signup = async (userData) => {
  return axios.post(`${API_URL}/`, userData);
};

export const login = async (credentials) => {
  return axios.post(`${API_URL}/`, credentials);
};

