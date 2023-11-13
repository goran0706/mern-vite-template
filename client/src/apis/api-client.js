import axios, { CanceledError } from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

export default axios.create({
  baseURL: BASE_URL,
});

export { CanceledError };
