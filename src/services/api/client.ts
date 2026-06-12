import axios from 'axios';

// Create a mock Axios instance since we don't have a real backend yet.
// In a production app, replace baseURL with the actual API URL.
export const apiClient = axios.create({
  baseURL: 'https://api.mocksalon.com/v1',
  timeout: 10000,
});

// Request Interceptor: Add Auth Token
apiClient.interceptors.request.use(
  async (config) => {
    // const token = await getToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Simulate network delay & mock responses
apiClient.interceptors.response.use(
  async (response) => {
    // Simulate latency
    await new Promise(resolve => setTimeout(() => resolve(undefined), 800));
    return response;
  },
  async (error) => {
    // Simulate latency on errors too
    await new Promise(resolve => setTimeout(() => resolve(undefined), 800));
    
    // Custom error normalization
    if (!error.response) {
      return Promise.reject({
        code: 'NETWORK_ERROR',
        message: 'Unable to connect to server. Please check your internet connection.',
      });
    }
    
    return Promise.reject({
      code: error.response.status,
      message: error.response.data?.message || 'An unexpected error occurred.',
    });
  }
);

export default apiClient;
