import { createContext, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Home, FileText, Users, Settings, BarChart2 } from 'lucide-react';
import { useSidebar as useSidebarHook } from '../hooks/useSidebarContext';

// Create a context to share sidebar state
export const SidebarContext = createContext({
  isExpanded: true,
  toggleSidebar: () => {}
});

export const useSidebar = () => useContext(SidebarContext);

const menuItems = [
  { path: '/', icon: <Home size={24} />, label: 'Dashboard' },
  { path: '/cet', icon: <FileText size={24} />, label: 'CET' },
  { path: '/enginep', icon: <BarChart2 size={24} />, label: 'Engine' }, // Add this line
  { path: '/customers', icon: <Users size={24} />, label: 'Customers' },
  { path: '/settings', icon: <Settings size={24} />, label: 'Settings' },
];

const Sidebar = () => {
  const { 
    isExpanded, 
    toggleSidebar, 
    expandSidebar, 
    collapseSidebar, 
    isHoverMode, 
    setHoverMode 
  } = useSidebarHook();

  const handleToggleClick = () => {
    toggleSidebar();
    // When manually toggling, disable hover mode
    setHoverMode(false);
  };

  const handleMouseEnter = () => {
    expandSidebar();
  };

  const handleMouseLeave = () => {
    collapseSidebar();
  };

  return (
    <motion.div
      initial={{ width: 280 }}
      animate={{ width: isExpanded ? 280 : 80 }}
      className="h-screen bg-gray-900 text-white fixed left-0 top-0 z-50"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center justify-between p-4">
        {isExpanded && (
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-semibold"
          >
            Credit System
          </motion.h1>
        )}
        <button
          onClick={handleToggleClick}
          className="p-2 rounded-full hover:bg-gray-800 transition-colors"
        >
          <motion.div
            animate={{ rotate: isExpanded ? 0 : 180 }}
          >
            <ChevronRight size={24} />
          </motion.div>
        </button>
      </div>

      <nav className="mt-8">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 ${
                isActive ? 'bg-blue-600' : 'hover:bg-gray-800'
              } transition-colors`
            }
          >
            <span className="text-xl">{item.icon}</span>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="ml-4 text-lg"
              >
                {item.label}
              </motion.span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Toggle hover mode button */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        {isExpanded && (
          <button 
            onClick={() => setHoverMode(!isHoverMode)}
            className={`text-xs px-3 py-1 rounded ${isHoverMode ? 'bg-blue-600' : 'bg-gray-700'} transition-colors`}
          >
            {isHoverMode ? 'Hover Mode: ON' : 'Hover Mode: OFF'}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default Sidebar;