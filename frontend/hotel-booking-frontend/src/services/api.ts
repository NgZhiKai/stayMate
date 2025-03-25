// src/services/api.ts
import axios from 'axios';
import { SearchFilters } from '../types/Hotels';

const API_BASE_URL = 'http://localhost:8080/hotels';

export const fetchHotels = async (filters: SearchFilters) => {
  const response = await axios.get(`${API_BASE_URL}/search`, { params: filters });
  return response.data;
};