import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Utility function to clear localStorage data
export const clearAppData = () => {
  try {
    // Clear application data from localStorage
    localStorage.removeItem('mock_departments');
    localStorage.removeItem('mock_courses');
    localStorage.removeItem('mock_students');
    
    console.log('All application data has been cleared from localStorage');
    return true;
  } catch (error) {
    console.error('Error clearing application data:', error);
    return false;
  }
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    if (response) {
      // Handle specific error statuses
      switch (response.status) {
        case 400:
          console.error('Bad Request:', response.data);
          break;
        case 401:
          console.error('Unauthorized:', response.data);
          break;
        case 403:
          console.error('Forbidden:', response.data);
          break;
        case 404:
          console.error('Not Found:', response.data);
          break;
        case 500:
          console.error('Server Error:', response.data);
          break;
        default:
          console.error(`Error ${response.status}:`, response.data);
      }
    } else {
      // Network errors or other issues where response isn't available
      console.error('Network Error or Server is not responding');
    }
    
    return Promise.reject(error);
  }
);

export default api; 