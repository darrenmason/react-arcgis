import React, { createContext, useContext } from 'react';
import type { ViewContext } from '../types';

const ViewContextProvider = createContext<ViewContext>({
  view: null,
  map: null
});

export const useView = () => {
  const context = useContext(ViewContextProvider);
  if (!context) {
    throw new Error('useView must be used within a View component');
  }
  return context;
};

export const ViewProvider = ViewContextProvider.Provider;
export default ViewContextProvider;
