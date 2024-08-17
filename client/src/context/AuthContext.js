import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    user: null,
    token: null
  });

  // Memoized function to fetch user data
  const fetchUserData = useCallback(async () => {
    if (authData.token) {
      try {
        const response = await axios.get('/user/profile', {
          headers: {
            Authorization: `Bearer ${authData.token}`
          }
        });
        setAuthData(prevData => ({ ...prevData, user: response.data }));
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setAuthData(prevData => ({ ...prevData, user: null }));
      }
    }
  }, [authData.token]);

  // Use useEffect to call fetchUserData when the token changes
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return (
    <AuthContext.Provider value={{ authData, setAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};
