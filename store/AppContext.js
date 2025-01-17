// store/AppContext.js

import { createContext, useReducer, useContext } from 'react';

const AppContext = createContext();

function appReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, { count: 0 });
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook for child components
export function useAppContext() {
  return useContext(AppContext);
}