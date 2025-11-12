import { createContext, useContext, useState, useCallback } from "react";

const DashboardContext = createContext();

export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider = ({ children }) => {
  const [sidebarKey, setSidebarKey] = useState(0);

  const refreshSidebar = useCallback(() => {
    setSidebarKey((prev) => prev + 1); // força re-render do sidebar
  }, []);

  return (
    <DashboardContext.Provider value={{ sidebarKey, refreshSidebar }}>
      {children}
    </DashboardContext.Provider>
  );
};
