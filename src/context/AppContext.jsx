import React, { useState, createContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

console.log("AppContext.jsx loaded.");

// --- Global Context for App State ---
export const AppContext = createContext(); // AppContext is defined and exported HERE

export const AppProvider = ({ children }) => {
  const [userId, setUserId] = useState(crypto.randomUUID());
  const [appInitialized, setAppInitialized] = useState(false);

  useEffect(() => {
    setAppInitialized(true);
    console.log("App context initialized. User ID:", userId);
  }, [userId]);

  return (
    <AppContext.Provider value={{ userId, appInitialized }}>
      {children}
    </AppContext.Provider>
  );
};