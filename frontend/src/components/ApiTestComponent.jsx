import React from 'react';
import { apiService } from '../services/api';

// Simple test component to verify API client functionality
// This can be removed once real components are using the API

const ApiTestComponent = () => {
  const testApiConnection = async () => {
    try {
      // This will test the base API connection and interceptors
      const response = await apiService.auth.refresh();
      // In development you can log the response
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log('API test successful:', response);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log(
          'API test failed (expected for unauthenticated requests):',
          error.message
        );
      }
    }
  };

  const testTokenRefresh = async () => {
    try {
      // Simulate a 401 error by calling a protected endpoint without token
      const response = await apiService.user.getProfile();
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log('Profile fetch successful:', response.data);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log(
          'Profile fetch failed (expected without token):',
          error.message
        );
      }
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>API Client Test Component</h3>
      <p>This component is for testing the API client functionality.</p>

      <button
        onClick={testApiConnection}
        style={{ margin: '5px', padding: '10px' }}
      >
        Test API Connection
      </button>

      <button
        onClick={testTokenRefresh}
        style={{ margin: '5px', padding: '10px' }}
      >
        Test Protected Endpoint
      </button>

      <p>
        <small>Check browser console for results</small>
      </p>
    </div>
  );
};

export default ApiTestComponent;
