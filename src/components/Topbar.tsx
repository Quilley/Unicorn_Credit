import { motion } from 'framer-motion';
import { Bell, User, Search } from 'lucide-react';
import { useSidebar } from '../hooks/useSidebarContext';

const Topbar = () => {
  const { isExpanded } = useSidebar();
  
  return (
    <motion.header
      className="bg-white shadow-sm fixed top-0 right-0 z-40 h-16 flex items-center px-6"
      initial={{ width: `calc(100% - ${isExpanded ? 280 : 80}px)` }}
      animate={{ width: `calc(100% - ${isExpanded ? 280 : 80}px)` }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between w-full">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-100 relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="h-8 w-px bg-gray-300"></div>
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 rounded-full p-1.5">
              <User size={18} className="text-white" />
            </div>
            <span className="font-medium">Admin User</span>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Topbar;