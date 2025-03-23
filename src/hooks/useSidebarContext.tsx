import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SidebarContextType {
  isExpanded: boolean;
  toggleSidebar: () => void;
  expandSidebar: () => void;
  collapseSidebar: () => void;
  isHoverMode: boolean;
  setHoverMode: (value: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType>({
  isExpanded: true,
  toggleSidebar: () => {},
  expandSidebar: () => {},
  collapseSidebar: () => {},
  isHoverMode: false,
  setHoverMode: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isHoverMode, setIsHoverMode] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const expandSidebar = () => {
    if (isHoverMode) {
      setIsExpanded(true);
    }
  };

  const collapseSidebar = () => {
    if (isHoverMode) {
      setIsExpanded(false);
    }
  };

  const setHoverMode = (value: boolean) => {
    setIsHoverMode(value);
  };

  return (
    <SidebarContext.Provider 
      value={{ 
        isExpanded, 
        toggleSidebar, 
        expandSidebar, 
        collapseSidebar, 
        isHoverMode, 
        setHoverMode 
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};