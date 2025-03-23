import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SidebarProvider } from './hooks/useSidebarContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import CETPage from './pages/CET';
import CaseDetails from './pages/CaseDetails';
import { useSidebar } from './hooks/useSidebarContext';

// Component to wrap our Routes and handle the dynamic margins
const MainContent = () => {
  const { isExpanded } = useSidebar();
  
  return (
    <motion.main 
      className="bg-gray-100 min-h-screen pt-16 w-full" // Added w-full
      initial={{ 
        marginLeft: isExpanded ? 280 : 80,
      }}
      animate={{ 
        marginLeft: isExpanded ? 280 : 80,
      }}
      transition={{ duration: 0.2 }}
    >
      <Routes>
        <Route path="/" element={<div className="p-8"><h1 className="text-2xl font-bold">Dashboard</h1></div>} />
        <Route path="/cet" element={<CETPage />} />
        <Route path="/case/:caseId" element={<CaseDetails />} />
        <Route path="/customers" element={<div className="p-8"><h1 className="text-2xl font-bold">Customers</h1></div>} />
        <Route path="/settings" element={<div className="p-8"><h1 className="text-2xl font-bold">Settings</h1></div>} />
      </Routes>
    </motion.main>
  );
};

function App() {
  return (
    <Router>
      <SidebarProvider>
        <div className="flex">
          <Sidebar />
          <Topbar />
          <MainContent />
        </div>
      </SidebarProvider>
    </Router>
  );
}

export default App;