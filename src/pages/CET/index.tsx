import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, Tab, Box, CircularProgress } from '@mui/material';
import CaseCard from '../../components/CaseCard';

interface CustomerCase {
  id: string;
  customerName: string;
  status: 'assigned' | 'draft' | 'submitted';
  assignedTo: string;
  loanAmount: number;
  timestamp: string;
  details: {
    basics: {
      name: string;
      age: number;
      annualIncome: number;
      occupation: string;
      businessType: string;
      yearsInBusiness: number;
      establishmentYear: number;
      };
    banking: {
      bankName: string;
      accountNumber: string;
      averageBalance: number;
      transactions: {
        date: string;
        amount: number;
        type: string;
      }[];
    };
    bureau: {
      creditScore: number;
      reportDate: string;
    };
    financials: {
      monthlyIncome: number;
      monthlyExpenses: number;
      profitMargin: number;
    };
    pdDetails: {
      probabilityOfDefault: number;
      riskScore: number;
      riskCategory: string;
    };
    additional: {
      notes: string;
      documentsUploaded: number;
      completionStatus: number;
    };
  };
}

const CETPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [cases, setCases] = useState<CustomerCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/cases');
      if (!response.ok) {
        throw new Error('Failed to fetch cases');
      }
      const data = await response.json();
      setCases(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching cases:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleCaseClick = (customerCase: CustomerCase) => {
    navigate(`/case/${customerCase.id}`);
  };

  const filterCases = (status: string): CustomerCase[] => {
    return cases.filter(c => c.status === status);
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-full">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Failed to load cases: {error}</p>
          <button 
            onClick={fetchCases}
            className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const renderCaseList = (status: 'assigned' | 'draft' | 'submitted') => {
    const filteredCases = filterCases(status);
    
    return filteredCases.length > 0 ? (
      filteredCases.map(customerCase => (
        <CaseCard
          key={customerCase.id}
          case={customerCase}
          onClick={() => handleCaseClick(customerCase)}
        />
      ))
    ) : (
      <div className="text-center py-10 text-gray-500">
        No {status} cases found.
      </div>
    );
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Credit Evaluation Tool</h1>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Assigned" />
          <Tab label="Drafts" />
          <Tab label="Submitted" />
        </Tabs>
      </Box>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="space-y-3"
        >
          {activeTab === 0 && renderCaseList('assigned')}
          {activeTab === 1 && renderCaseList('draft')}
          {activeTab === 2 && renderCaseList('submitted')}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CETPage;