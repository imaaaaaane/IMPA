import React, { createContext, useContext, useState } from 'react';

// Create Context
const GlobalContext = createContext();

// Create a custom hook to use the GlobalContext
export const useGlobalContext = () => useContext(GlobalContext);

// Create the Provider component
export const GlobalProvider = ({ children }) => {
  // Global state definitions
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(null); // null means unauthenticated
  const [logoUrl, setLogoUrl] = useState('/logo.svg');

  // Any global actions/methods
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  // Value object to be passed to consuming components
  const value = {
    theme,
    toggleTheme,
    user,
    login,
    logout,
    logoUrl,
    setLogoUrl,
  };

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
};
