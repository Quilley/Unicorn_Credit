import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  FileText, 
  User, 
  Building, 
  CreditCard, 
  BarChart2,
  ExternalLink,
  X,
  Plus,
  UserPlus,
  Calendar,
  Check,
  Edit
} from 'lucide-react';
import { CustomerCase } from '../../types';
import { mockCases } from '../../data/mockData';
import FinancialsContentComponent from './FinancialsContent';

const CaseDetails = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState<CustomerCase | null>(null);
  const [activeTab, setActiveTab] = useState('Customers');
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCaseData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/api/cases/${caseId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch case details');
        }
        
        const data = await response.json();
        setCaseData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching case details:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (caseId) {
      fetchCaseData();
    }
  }, [caseId]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error || !caseData) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Failed to load case details: {error || 'Case not found'}</p>
          <button 
            onClick={() => navigate('/cet')}
            className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Return to CET
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 max-w-full" // Changed from p-8 to p-4 and added max-w-full
    >
      {/* Header with back button */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/cet')}
            className="mr-4 p-2 rounded-full hover:bg-gray-200"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              Case {caseData.id} - {caseData.customerName}
            </h1>
            <p className="text-gray-500">
              {caseData.details.basics.occupation} · ₹{caseData.loanAmount.toLocaleString()}
            </p>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center space-x-3">
          <button 
            className="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600"
            title="Add note"
            onClick={() => {
              // Add note toggle functionality
              setShowNoteModal(prev => !(prev));
            }}
          >
            <FileText size={18} />
          </button>
          <button
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium flex items-center transition-colors"
            onClick={() => {
              // Add save functionality
              alert("Case saved successfully!");
            }}
          >
            <Check size={16} className="mr-1.5" />
            Save
          </button>
        </div>
      </div>

      {/* Floating save button for mobile/smaller screens */}
      <div className="fixed bottom-6 right-6 sm:hidden z-40">
        <button
          className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-colors"
          onClick={() => {
            // Add save functionality
            alert("Case saved successfully!");
          }}
        >
          <Check size={22} />
        </button>
      </div>
      
      {/* Case summary cards grid */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        {/* Each SummaryCard remains the same, but the component itself now handles the dialog functionality */}
        <SummaryCard 
          title="Customer" 
          value={caseData.customerName}
          subvalue={`${caseData.details.basics.age} years`}
          icon={<User size={20} className="text-blue-500" />}
        />
        
        <SummaryCard 
          title="Loan Amount" 
          value={`₹${caseData.loanAmount.toLocaleString()}`}
          subvalue={caseData.details.basics.occupation}
          icon={<CreditCard size={20} className="text-green-500" />}
        />
        
        <SummaryCard 
          title="Credit Score" 
          value={caseData.details.bureau.creditScore.toString()}
          subvalue={caseData.details.bureau.creditScore >= 750 ? "Excellent" : 
                    caseData.details.bureau.creditScore >= 700 ? "Good" : 
                    caseData.details.bureau.creditScore >= 650 ? "Fair" : "Poor"}
          icon={<BarChart2 size={20} className="text-purple-500" />}
          valueColor={caseData.details.bureau.creditScore >= 750 ? "text-green-600" : 
                      caseData.details.bureau.creditScore >= 700 ? "text-blue-600" : 
                      caseData.details.bureau.creditScore >= 650 ? "text-yellow-600" : "text-red-600"}
        />
        
        <SummaryCard 
          title="Risk Score" 
          value={`${caseData.details.pdDetails.riskScore}/100`}
          subvalue={caseData.details.pdDetails.riskCategory}
          icon={<BarChart2 size={20} className="text-orange-500" />}
        />
        
        <SummaryCard 
          title="Monthly Income" 
          value={`₹${caseData.details.financials.monthlyIncome.toLocaleString()}`}
          subvalue="Net Income"
          icon={<Building size={20} className="text-indigo-500" />}
        />
        
        <SummaryCard 
          title="Default Probability" 
          value={`${(caseData.details.pdDetails.probabilityOfDefault * 100).toFixed(1)}%`}
          subvalue="Estimated PD"
          icon={<FileText size={20} className="text-red-500" />}
          valueColor={caseData.details.pdDetails.probabilityOfDefault < 0.03 ? "text-green-600" : 
                      caseData.details.pdDetails.probabilityOfDefault < 0.07 ? "text-yellow-600" : "text-red-600"}
        />
      </div>
      
      {/* Tabs for different sections - updated with 10 tabs and new styling */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden w-full">
        {/* Tab navigation - scrollable to handle 10 tabs */}
        <div className="flex border-b w-full overflow-x-auto hide-scrollbar">
          <TabButton 
            isActive={activeTab === 'Customers'} 
            onClick={() => setActiveTab('Customers')}
            icon={<User size={18} />}
            label="Customers"
          />
          <TabButton 
            isActive={activeTab === 'Due diligence'} 
            onClick={() => setActiveTab('Due diligence')}
            icon={<FileText size={18} />}
            label="Due diligence"
          />
          <TabButton 
            isActive={activeTab === 'Banking'} 
            onClick={() => setActiveTab('Banking')}
            icon={<Building size={18} />}
            label="Banking"
          />
          <TabButton 
            isActive={activeTab === 'RTR'} 
            onClick={() => setActiveTab('RTR')}
            icon={<CreditCard size={18} />}
            label="RTR"
          />
          <TabButton 
            isActive={activeTab === 'Financials'} 
            onClick={() => setActiveTab('Financials')}
            icon={<BarChart2 size={18} />}
            label="Financials"
          />
          <TabButton 
            isActive={activeTab === 'PD++'} 
            onClick={() => setActiveTab('PD++')}
            icon={<BarChart2 size={18} />}
            label="PD++"
          />
          <TabButton 
            isActive={activeTab === 'Credit++'} 
            onClick={() => setActiveTab('Credit++')}
            icon={<CreditCard size={18} />}
            label="Credit++"
          />
          <TabButton 
            isActive={activeTab === 'Eligibilty'} 
            onClick={() => setActiveTab('Eligibilty')}
            icon={<FileText size={18} />}
            label="Eligibilty"
          />
          <TabButton 
            isActive={activeTab === 'Deviations'} 
            onClick={() => setActiveTab('Deviations')}
            icon={<FileText size={18} />}
            label="Deviations"
          />
          <TabButton 
            isActive={activeTab === 'Review & Submit'} 
            onClick={() => setActiveTab('Review & Submit')}
            icon={<FileText size={18} />}
            label="Review & Submit"
          />
          
        </div>
        
        <div className="p-6 w-full">
          <AnimatedTabContent active={activeTab === 'Customers'}>
            <BasicsContent data={caseData.details.basics} />
          </AnimatedTabContent>
          
          <AnimatedTabContent active={activeTab === 'Reco'}>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Recommendation</h3>
              <p className="text-gray-600">Recommendation details will be shown here.</p>
            </div>
          </AnimatedTabContent>
          
          <AnimatedTabContent active={activeTab === 'Banking'}>
            <BankingContent data={caseData.details.banking} />
          </AnimatedTabContent>
          
          <AnimatedTabContent active={activeTab === 'RTR'}>
            <RTRContent />
          </AnimatedTabContent>
          
          <AnimatedTabContent active={activeTab === 'Financials'}>
            <FinancialsContentComponent data={caseData.details.financials} pdDetails={caseData.details.pdDetails} />
          </AnimatedTabContent>
          
          <AnimatedTabContent active={activeTab === 'PD++'}>
            <PDPlusContent data={caseData} />
          </AnimatedTabContent>
          
          <AnimatedTabContent active={activeTab === 'Credit++'}>
            <CreditPlusPlusContent />
          </AnimatedTabContent>
          
          <AnimatedTabContent active={activeTab === 'Eligibilty'}>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Eligibility Analysis</h3>
              <p className="text-gray-600">Loan eligibility details will be shown here.</p>
            </div>
          </AnimatedTabContent>
          
          <AnimatedTabContent active={activeTab === 'Deviations'}>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Policy Deviations</h3>
              <p className="text-gray-600">Any policy deviations will be listed here.</p>
            </div>
          </AnimatedTabContent>
          
          <AnimatedTabContent active={activeTab === 'Review & Submit'}>
            <DocumentsContent data={caseData.details.additional} />
          </AnimatedTabContent>
          <AnimatedTabContent active={activeTab === 'Due diligence'}>
            <DueDiligenceContent />
          </AnimatedTabContent>
        </div>
      </div>
      
      {/* Note modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden"
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Add Note</h3>
              <button 
                onClick={() => setShowNoteModal(false)}
                className="p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-4">
              <textarea 
                className="w-full border rounded-lg p-3 min-h-40 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Add notes about this case..."
              />
              
              <div className="flex justify-end mt-4 space-x-3">
                <button
                  onClick={() => setShowNoteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Save note logic here
                    setShowNoteModal(false);
                    alert("Note saved successfully!");
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Note
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

// Helper components
// Update the TabButton component with better styling
const TabButton = ({ isActive, onClick, icon, label }: { 
  isActive: boolean, 
  onClick: () => void,
  icon: React.ReactNode,
  label: string
}) => (
  <button
    className={`flex items-center px-5 py-3.5 min-w-max transition-all duration-200 relative
      ${isActive 
        ? 'text-blue-700 font-medium' 
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      }
    `}
    onClick={onClick}
  >
    <span className={`mr-2 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>{icon}</span>
    {label}
    {isActive && (
      <motion.div 
        layoutId="tab-indicator"
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
    )}
  </button>
);

const AnimatedTabContent = ({ active, children }: { active: boolean, children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ 
      opacity: active ? 1 : 0,
      y: active ? 0 : 20,
      display: active ? 'block' : 'none'
    }}
    transition={{ duration: 0.2 }}
  >
    {children}
  </motion.div>
);

// Update the SummaryCard component to track the button position
const SummaryCard = ({ 
  title, 
  value, 
  subvalue, 
  icon,
  valueColor = "text-gray-800"
}: { 
  title: string, 
  value: string, 
  subvalue?: string,
  icon: React.ReactNode,
  valueColor?: string
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [dialogPosition, setDialogPosition] = useState({ top: 0, left: 0 });

  const handleOpenDialog = () => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      // Position the dialog to the right of the card
      setDialogPosition({
        top: rect.top + window.scrollY,
        left: rect.right + window.scrollX + 10 // 10px gap between card and dialog
      });
      setDialogOpen(true);
    }
  };

  return (
    <div 
      ref={cardRef}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative"
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-gray-500 text-xs uppercase font-medium">{title}</p>
        <div className="p-1.5 rounded-full bg-gray-50">{icon}</div>
      </div>
      <p className={`text-xl font-semibold ${valueColor}`}>{value}</p>
      {subvalue && <p className="text-gray-500 text-xs mt-1">{subvalue}</p>}
      
      {/* Expand toggle button */}
      <button 
        onClick={handleOpenDialog}
        className="absolute bottom-2 right-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        aria-label="Expand details"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
          <path d="M15 3h6v6"></path>
          <path d="M10 14 21 3"></path>
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
        </svg>
      </button>
      
      {/* Dialog for additional information */}
      <AnimatePresence>
        {dialogOpen && (
          <SummaryCardDialog 
            title={title}
            onClose={() => setDialogOpen(false)}
            position={dialogPosition}
            content={
              <div className="p-4">
                <p className="text-gray-600">Additional information for {title} will appear here.</p>
                <p className="text-gray-400 text-sm mt-2">This data is dynamically updated based on the information entered in the tabs below.</p>
              </div>
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Update the dialog component to accept and use the position
const SummaryCardDialog = ({ 
  title, 
  onClose, 
  content,
  position,
}: { 
  title: string, 
  onClose: () => void,
  content: React.ReactNode,
  position: { top: number, left: number },
}) => {
  // Reference to detect clicks outside the dialog
  const dialogRef = React.useRef<HTMLDivElement>(null);
  
  // Handle click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Check if dialog would go off-screen and adjust if needed
  const [finalPosition, setFinalPosition] = useState(position);
  
  useEffect(() => {
    if (dialogRef.current) {
      const dialog = dialogRef.current;
      const dialogRect = dialog.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      let newPosition = {...position};
      
      // Check horizontal position
      if (position.left + dialogRect.width > windowWidth - 20) {
        // If it goes off-screen to the right, position to the left of the card
        newPosition.left = position.left - dialogRect.width - 320; // 320 is approx card width
      }
      
      // Check vertical position
      if (position.top + dialogRect.height > windowHeight + window.scrollY - 20) {
        // If it goes off-screen on the bottom, align to the bottom of the viewport
        newPosition.top = window.scrollY + windowHeight - dialogRect.height - 20;
      }
      
      setFinalPosition(newPosition);
    }
  }, [position, dialogRef]);

  return (
    <>
      {/* Backdrop - lighter and only covers part of the screen for a less intrusive feel */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <motion.div
        ref={dialogRef}
        initial={{ opacity: 0, scale: 0.95, x: -20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.95, x: -20 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="fixed z-50 bg-white rounded-lg shadow-xl w-80 max-w-md overflow-hidden"
        style={{ 
          top: `${finalPosition.top}px`, 
          left: `${finalPosition.left}px`,
          maxHeight: '80vh'
        }}
      >
        {/* Dialog header */}
        <div className="flex justify-between items-center p-3 border-b bg-gray-50">
          <h3 className="text-md font-semibold">{title} Details</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Dialog content */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(80vh - 53px)' }}>
          {content}
        </div>
      </motion.div>
    </>
  );
};

const BasicsContent = ({ data }: { data: CustomerCase['details']['basics'] }) => {
  // Add bureau data from parent component if needed
  const bureau = {
    creditScore: 750 // Default value
  };
  
  // State to track customer entries in the data grid
  const [customers, setCustomers] = useState([
    {
      id: 1,
      selected: true,
      applicantType: "Applicant",
      name: data.name,
      relationship: "Proprietorship",
      shareholding: "100%",
      bureauScore: bureau.creditScore, // Use imported creditScore
      dob: "1985-01-15", // Example date format
      age: data.age,
      ageAtMaturity: data.age + 5, // Assuming 5 year loan term
      mobile: "9876543210", // Add mobile number
      mobileVerified: true, // Add verification status
      mobileVerifiedDate: "2023-11-15T14:30:00", // Add verification date
    }
  ]);

  // Mobile verification dialog state
  const [mobileInfoOpen, setMobileInfoOpen] = useState(false);
  const [mobileInfoCustomer, setMobileInfoCustomer] = useState<any>(null);

  // Function to add a new row
  const addNewCustomer = () => {
    const newId = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1;
    setCustomers([...customers, {
      id: newId,
      selected: false,
      applicantType: "Co-applicant",
      name: "",
      relationship: "Proprietorship",
      shareholding: "",
      bureauScore: 0,
      dob: "",
      age: 0,
      ageAtMaturity: 0,
      mobile: "", // Add empty mobile number
      mobileVerified: false, // Add verification status
      mobileVerifiedDate: "", // Add empty verification date
    }]);
  };

  // Function to toggle customer selection
  const toggleCustomerSelection = (id: number) => {
    setCustomers(customers.map(customer => 
      customer.id === id ? {...customer, selected: !customer.selected} : customer
    ));
  };

  // Function to update a customer field
  const updateCustomerField = (id: number, field: string, value: any) => {
    setCustomers(customers.map(customer => {
      if (customer.id === id) {
        const updatedCustomer = {...customer, [field]: value};
        
        // If DOB was updated, recalculate age
        if (field === 'dob' && value) {
          const birthDate = new Date(value);
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          updatedCustomer.age = age;
          updatedCustomer.ageAtMaturity = age + 5; // Assuming 5 year term
        }
        
        return updatedCustomer;
      }
      return customer;
    }));
  };

  // Add state for addresses
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      customerId: "1", // Link to the first customer by default
      propertyType: "Residential",
      fullAddress: "123 Main Street, Bangalore",
      pincode: "560001",
      usedFor: "Residence",
      verification: "positive" // positive, pending, negative
    }
  ]);

  // Function to add a new address
  const addNewAddress = () => {
    const newId = addresses.length > 0 ? Math.max(...addresses.map(a => a.id)) + 1 : 1;
    setAddresses([...addresses, {
      id: newId,
      customerId: customers.length > 0 ? String(customers[0].id) : "", // Default to first customer if available
      propertyType: "Residential",
      fullAddress: "",
      pincode: "",
      usedFor: "Residence",
      verification: "pending"
    }]);
  };

  // Function to update an address field
  const updateAddressField = (id: number, field: string, value: any) => {
    setAddresses(addresses.map(address => 
      address.id === id ? {...address, [field]: value} : address
    ));
  };

  return (
    <div className="space-y-8">
      {/* Basic Details section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Basic Details</h3>
        
        {/* Customer data grid */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Select
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant Type
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Relationship
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Shareholding
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bureau Score
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mobile
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  DOB/DOI
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age at Maturity
                </th>
                <th scope="col" className="relative px-3 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer.id} className={customer.selected ? "bg-blue-50" : ""}>
                  {/* Selection toggle */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        checked={customer.selected}
                        onChange={() => toggleCustomerSelection(customer.id)}
                      />
                    </label>
                  </td>
                  
                  {/* Applicant Type */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    <select
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={customer.applicantType}
                      onChange={(e) => updateCustomerField(customer.id, 'applicantType', e.target.value)}
                    >
                      <option value="Applicant">Applicant</option>
                      <option value="Co-applicant">Co-applicant</option>
                    </select>
                  </td>
                  
                  {/* Name */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    <input
                      type="text"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={customer.name}
                      onChange={(e) => updateCustomerField(customer.id, 'name', e.target.value)}
                      placeholder="Enter name"
                    />
                  </td>
                  
                  {/* Relationship */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    <select
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={customer.relationship}
                      onChange={(e) => updateCustomerField(customer.id, 'relationship', e.target.value)}
                    >
                      <option value="Proprietorship">Proprietorship</option>
                      <option value="Trust">Trust</option>
                      <option value="Society">Society</option>
                      <option value="Pvt Ltd">Pvt Ltd</option>
                    </select>
                  </td>
                  
                  {/* Shareholding */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    <input
                      type="text"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={customer.shareholding}
                      onChange={(e) => updateCustomerField(customer.id, 'shareholding', e.target.value)}
                      placeholder="e.g. 25%"
                    />
                  </td>
                  
                  {/* Bureau Score */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    <input
                      type="number"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={customer.bureauScore}
                      onChange={(e) => updateCustomerField(customer.id, 'bureauScore', parseInt(e.target.value) || 0)}
                      min="300"
                      max="900"
                    />
                  </td>
                  
                  {/* Mobile */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <input
                        type="text"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={customer.mobile}
                        onChange={(e) => updateCustomerField(customer.id, 'mobile', e.target.value)}
                        placeholder="Enter mobile"
                      />
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          setMobileInfoCustomer(customer);
                          setMobileInfoOpen(true);
                        }}
                        className="ml-2 p-1 text-gray-400 hover:text-blue-500 transition-colors"
                        aria-label="Mobile verification info"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="16" x2="12" y2="12"></line>
                          <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                      </button>
                    </div>
                  </td>
                  
                  {/* DOB/DOI */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    <input
                      type="date"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={customer.dob}
                      onChange={(e) => updateCustomerField(customer.id, 'dob', e.target.value)}
                    />
                  </td>
                  
                  {/* Age - Auto calculated */}
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700">
                    <div className="px-3 py-1.5 bg-gray-100 rounded text-center">
                      {customer.age}
                    </div>
                  </td>
                  
                  {/* Age at Maturity - Auto calculated */}
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700">
                    <div className="px-3 py-1.5 bg-gray-100 rounded text-center">
                      {customer.ageAtMaturity}
                    </div>
                  </td>
                  
                  {/* Delete button */}
                  <td className="px-3 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        if (customers.length > 1) {
                          setCustomers(customers.filter(c => c.id !== customer.id));
                          // Also update any addresses that reference this customer
                          setAddresses(addresses.map(addr => 
                            addr.customerId === String(customer.id) 
                              ? {...addr, customerId: ""} 
                              : addr
                          ));
                        }
                      }}
                      className="text-red-500 hover:text-red-700"
                      disabled={customers.length <= 1}
                    >
                      <X size={16} className={customers.length <= 1 ? "text-gray-300" : ""} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Add new customer button */}
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={addNewCustomer}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Customer
          </button>
        </div>
      </div>

      {/* Address section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Address</h3>
        
        {/* Address data grid */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property Type
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Full Address
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pincode
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Used For
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Verification
                  <span className="ml-1 inline-block" title="Positive: Address verified | Pending: Verification in progress | Negative: Verification failed">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                  </span>
                </th>
                <th scope="col" className="relative px-4 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Add the Customer dropdown in the address table rows */}
              {addresses.map((address) => (
                <tr key={address.id}>
                  {/* Customer Dropdown */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <select
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={address.customerId || ""}
                      onChange={(e) => updateAddressField(address.id, 'customerId', e.target.value)}
                    >
                      <option value="">Select Customer</option>
                      {customers.map(customer => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name || `Customer ${customer.id}`}
                        </option>
                      ))}
                    </select>
                  </td>
                  
                  {/* Property Type */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <select
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={address.propertyType}
                      onChange={(e) => updateAddressField(address.id, 'propertyType', e.target.value)}
                    >
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Industrial">Industrial</option>
                      <option value="Agricultural">Agricultural</option>
                      <option value="Mixed-use">Mixed-use</option>
                    </select>
                  </td>
                  
                  {/* Full Address */}
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={address.fullAddress}
                      onChange={(e) => updateAddressField(address.id, 'fullAddress', e.target.value)}
                      placeholder="Enter full address"
                    />
                  </td>
                  
                  {/* Pincode */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <input
                      type="text"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={address.pincode}
                      onChange={(e) => {
                        // Allow only numbers and limit to 6 digits
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                        updateAddressField(address.id, 'pincode', value);
                      }}
                      placeholder="6-digit pincode"
                      maxLength={6}
                    />
                  </td>
                  
                  {/* Used For */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <select
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={address.usedFor}
                      onChange={(e) => updateAddressField(address.id, 'usedFor', e.target.value)}
                    >
                      <option value="Residence">Residence</option>
                      <option value="Business">Business</option>
                      <option value="Office">Office</option>
                      <option value="Warehouse">Warehouse</option>
                      <option value="Mailing">Mailing Only</option>
                      <option value="Other">Other</option>
                    </select>
                  </td>
                  
                  {/* Verification Toggle */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateAddressField(address.id, 'verification', 'positive')}
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          address.verification === 'positive' 
                            ? 'bg-green-100 text-green-800 ring-1 ring-green-600' 
                            : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        +ve
                      </button>
                      <button
                        onClick={() => updateAddressField(address.id, 'verification', 'pending')}
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          address.verification === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-600' 
                            : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        Pending
                      </button>
                      <button
                        onClick={() => updateAddressField(address.id, 'verification', 'negative')}
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          address.verification === 'negative' 
                            ? 'bg-red-100 text-red-800 ring-1 ring-red-600' 
                            : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        -ve
                      </button>
                    </div>
                  </td>
                  
                  {/* Remove button */}
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setAddresses(addresses.filter(a => a.id !== address.id))}
                      className="text-red-500 hover:text-red-700"
                      disabled={addresses.length <= 1}
                    >
                      <X size={16} className={addresses.length <= 1 ? "text-gray-300" : ""} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Add new address button */}
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={addNewAddress}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Address
          </button>
        </div>
      </div>

      {/* Mobile verification info dialog */}
      {mobileInfoOpen && mobileInfoCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-80 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b bg-gray-50">
              <h3 className="text-md font-semibold">Mobile Verification</h3>
              <button 
                onClick={() => setMobileInfoOpen(false)}
                className="p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Mobile Number</p>
                  <p className="font-medium">{mobileInfoCustomer.mobile || "Not provided"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Verification Status</p>
                  <div className="flex items-center mt-1">
                    {mobileInfoCustomer.mobileVerified ? (
                      <>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Check size={12} className="mr-1" /> Verified
                        </span>
                      </>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Not Verified
                      </span>
                    )}
                  </div>
                </div>
                
                {mobileInfoCustomer.mobileVerified && mobileInfoCustomer.mobileVerifiedDate && (
                  <div>
                    <p className="text-sm text-gray-500">Verified On</p>
                    <p className="font-medium">
                      {new Date(mobileInfoCustomer.mobileVerifiedDate).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                )}
                
                {/* Actions */}
                <div className="pt-3 flex justify-end">
                  <button
                    onClick={() => {
                      // Toggle verification status
                      const updatedCustomers = customers.map(c => 
                        c.id === mobileInfoCustomer.id 
                          ? {
                              ...c, 
                              mobileVerified: !c.mobileVerified,
                              mobileVerifiedDate: !c.mobileVerified ? new Date().toISOString() : c.mobileVerifiedDate
                            } 
                          : c
                      );
                      setCustomers(updatedCustomers);
                      setMobileInfoCustomer({
                        ...mobileInfoCustomer,
                        mobileVerified: !mobileInfoCustomer.mobileVerified,
                        mobileVerifiedDate: !mobileInfoCustomer.mobileVerified ? new Date().toISOString() : mobileInfoCustomer.mobileVerifiedDate
                      });
                    }}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50"
                  >
                    {mobileInfoCustomer.mobileVerified ? "Mark as Unverified" : "Mark as Verified"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const BankingContent = ({ data }: { data: CustomerCase['details']['banking'] }) => (
  <div className="space-y-6">
    <h3 className="text-lg font-semibold mb-4">Banking Information</h3>
    <div className="grid grid-cols-3 gap-4"> {/* Changed from grid-cols-2 to grid-cols-3 */}
      <div>
        <p className="text-gray-500 text-sm">Bank Name</p>
        <p className="font-medium">{data.bankName}</p>
      </div>
      <div>
        <p className="text-gray-500 text-sm">Account Number</p>
        <p className="font-medium">XXXX{data.accountNumber.slice(-4)}</p>
      </div>
      <div>
        <p className="text-gray-500 text-sm">Average Balance</p>
        <p className="font-medium">₹{data.averageBalance.toLocaleString()}</p>
      </div>
    </div>
    
    {/* We'll add transaction details later */}
    <div className="mt-8">
      <h4 className="text-md font-semibold mb-3">Recent Transactions</h4>
      <p className="text-gray-500 italic">No recent transactions to display</p>
    </div>
  </div>
);

const BureauContent = ({ data }: { data: CustomerCase['details']['bureau'] }) => (
  <div className="space-y-6">
    <h3 className="text-lg font-semibold mb-4">Credit Bureau Information</h3>
    <div className="grid grid-cols-2 gap-6">
      <div>
        <p className="text-gray-500 text-sm">Credit Score</p>
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 text-blue-600 font-semibold">
            {data.creditScore}
          </div>
          <div className="ml-3">
            {data.creditScore >= 750 ? (
              <p className="text-green-600 font-medium">Excellent</p>
            ) : data.creditScore >= 700 ? (
              <p className="text-blue-600 font-medium">Good</p>
            ) : data.creditScore >= 650 ? (
              <p className="text-yellow-600 font-medium">Fair</p>
            ) : (
              <p className="text-red-600 font-medium">Poor</p>
            )}
          </div>
        </div>
      </div>
      <div>
        <p className="text-gray-500 text-sm">Outstanding Loans</p>
        <p className="font-medium">{data.outstandingLoans}</p>
      </div>
    </div>
    
    {/* We'll add payment history later */}
    <div className="mt-8">
      <h4 className="text-md font-semibold mb-3">Payment History</h4>
      <p className="text-gray-500 italic">No payment history to display</p>
    </div>
  </div>
);

const FinancialsContent = ({ 
  data, 
  pdDetails 
}: { 
  data: CustomerCase['details']['financials'],
  pdDetails: CustomerCase['details']['pdDetails']
}) => (
  <div className="space-y-6">
    <h3 className="text-lg font-semibold mb-4">Financial Analysis</h3>
    <div className="grid grid-cols-3 gap-4"> {/* Changed from grid-cols-2 to grid-cols-3 */}
      <div>
        <p className="text-gray-500 text-sm">Monthly Income</p>
        <p className="font-medium">₹{data.monthlyIncome.toLocaleString()}</p>
      </div>
      <div>
        <p className="text-gray-500 text-sm">Monthly Expenses</p>
        <p className="font-medium">₹{data.monthlyExpenses.toLocaleString()}</p>
      </div>
      <div>
        <p className="text-gray-500 text-sm">Risk Score</p>
        <p className="font-medium">{pdDetails.riskScore}/100</p>
      </div>
      <div>
        <p className="text-gray-500 text-sm">Risk Category</p>
        <p className="font-medium">{pdDetails.riskCategory}</p>
      </div>
      <div>
        <p className="text-gray-500 text-sm">Probability of Default</p>
        <p className="font-medium">{(pdDetails.probabilityOfDefault * 100).toFixed(2)}%</p>
      </div>
    </div>
  </div>
);

const DocumentsContent = ({ data }: { data: CustomerCase['details']['additional'] }) => (
  <div className="space-y-6">
    <h3 className="text-lg font-semibold mb-4">Documents & Notes</h3>
    
    <div className="mb-8">
      <h4 className="text-md font-semibold mb-3">Documents</h4>
      {data.documents.length > 0 ? (
        <div className="grid grid-cols-3 gap-4"> {/* Changed from grid-cols-2 to grid-cols-3 */}
          {data.documents.map((doc, index) => (
            <div key={index} className="p-4 border rounded-lg flex items-center">
              <FileText size={24} className="text-blue-500 mr-3" />
              <div>
                <p className="font-medium">{doc.name}</p>
                <p className="text-xs text-gray-500">{doc.type}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">No documents uploaded</p>
      )}
    </div>
    
    <div>
      <h4 className="text-md font-semibold mb-3">Notes</h4>
      <textarea 
        className="w-full border rounded-lg p-3 min-h-24"
        placeholder="Add notes about this case..."
        defaultValue={data.comments}
      />
    </div>
  </div>
);

const DueDiligenceContent = () => {
  // State to track our cards
  const [ddCards, setDdCards] = useState([
    { id: 1, heading: 'Online Activity' },
    { id: 2, heading: 'Media Check' },
    { id: 3, heading: 'Residence checks' },
    { id: 4, heading: 'Online Risk Check' },
  ]);

  // List of available headings for new cards
  const availableHeadings = ['Online Activity', 'Media Check', 'Residence checks', 'Online Risk Check'];

  // Function to add a new card
  const addNewCard = () => {
    const newId = ddCards.length > 0 ? Math.max(...ddCards.map(c => c.id)) + 1 : 1;
    setDdCards([...ddCards, { id: newId, heading: availableHeadings[0] }]);
  };

  // Function to remove a card
  const removeCard = (idToRemove: number) => {
    if (ddCards.length > 4) { // Ensure we keep the original 4 cards
      setDdCards(ddCards.filter(card => card.id !== idToRemove));
    }
  };

  // Function to update card heading (for dynamic cards)
  const updateCardHeading = (id: number, newHeading: string) => {
    setDdCards(ddCards.map(card => 
      card.id === id ? {...card, heading: newHeading} : card
    ));
  };

  // State for history card content
  const [businessModelContent, setBusinessModelContent] = useState(
    "The business is a medium-sized manufacturing company specializing in automotive parts. They operate with a B2B model, supplying to major car manufacturers across the country. Their revenue streams include direct sales to manufacturers, aftermarket parts distribution, and recently developed maintenance service contracts."
  );
  
  const [backgroundContent, setBackgroundContent] = useState(
    "Founded in 2010, the company has grown steadily over the past decade. The founder has 15+ years of experience in the automotive industry. The business survived the economic downturn in 2020 by pivoting to include essential vehicle parts. They have maintained good relationships with suppliers and have a reliable customer base."
  );
  
  const [fundRequirementContent, setFundRequirementContent] = useState(
    "The company seeks funding primarily for capacity expansion due to increased demand from two major automotive manufacturers. Secondary use of funds includes modernizing equipment to improve efficiency and reduce costs. They also plan to allocate a portion for developing new product lines to diversify revenue streams."
  );

  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [urls, setUrls] = useState('');
  const [analysisType, setAnalysisType] = useState('basic');

  return (
    <div className="space-y-6">
      {/* MOVED: History Section (now at the top) */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold mb-0">History</h3>
          <button 
            className="px-4 py-2 rounded-md text-sm flex items-center shadow-sm bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white hover:opacity-90 transition-opacity"
            onClick={() => setShowConnectDialog(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
            Connect+
          </button>
        </div>
        <h3 className="text-lg font-semibold mb-4">History</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <HistoryCard 
            title="Business Model" 
            content={businessModelContent}
            onSave={setBusinessModelContent}
          />
          <HistoryCard 
            title="Background" 
            content={backgroundContent}
            onSave={setBackgroundContent}
          />
          <HistoryCard 
            title="Fund Requirement Reasons" 
            content={fundRequirementContent}
            onSave={setFundRequirementContent}
          />
        </div>
      </div>

      {/* MOVED: DD Checks Section (now below History) */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Due Diligence Checks</h3>
          <button
            onClick={addNewCard}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Checks
          </button>
        </div>

        <div className="space-y-4">
          {ddCards.map((card) => (
            <DDCard 
              key={card.id} 
              id={card.id}
              heading={card.heading} 
              isDynamic={card.id > 4} // First 4 cards are fixed
              onRemove={() => removeCard(card.id)}
              availableHeadings={availableHeadings}
              onHeadingChange={(heading) => updateCardHeading(card.id, heading)}
            />
          ))}
        </div>
      </div>

      {showConnectDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden animate-fadeIn">
            <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-purple-50 to-pink-50">
              <h3 className="font-semibold text-lg">Connect External Data</h3>
              <button 
                onClick={() => setShowConnectDialog(false)}
                className="p-1.5 rounded-full hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter URLs for analysis
                </label>
                <textarea 
                  rows={3} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com, https://another-site.com"
                  value={urls}
                  onChange={(e) => setUrls(e.target.value)}
                />
                <p className="mt-1 text-xs text-gray-500">Enter multiple URLs separated by commas</p>
              </div>

              <div className="mb-6">
                <p className="block text-sm font-medium text-gray-700 mb-2">Analysis Type</p>
                
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="analysisType"
                      value="basic"
                      checked={analysisType === 'basic'}
                      onChange={() => setAnalysisType('basic')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900">Company Profiling</span>
                      <p className="text-xs text-gray-500 mt-0.5">Basic information about the company</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="analysisType"
                      value="deep"
                      checked={analysisType === 'deep'}
                      onChange={() => setAnalysisType('deep')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900">Company Profiling + Deep Analysis</span>
                      <p className="text-xs text-gray-500 mt-0.5">Extended information with financial insights</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end p-4 border-t bg-gray-50">
              <button
                onClick={() => setShowConnectDialog(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 mr-3"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Process URLs and analysis
                  setShowConnectDialog(false);
                  // Add your magic logic here
                  alert(`Processing ${analysisType === 'basic' ? 'Basic' : 'Deep'} analysis for URLs: ${urls}`);
                }}
                className="px-4 py-2 rounded-md text-white 
                  bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700
                  flex items-center shadow-md transition-colors"
              >
                <span className="mr-1">Build Magic</span>
                <span className="flex">
                  {[...Array(3)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${i > 0 ? '-ml-1' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// DD Card component for due diligence checks
const DDCard = ({ 
  id,
  heading, 
  isDynamic = false,
  onRemove,
  availableHeadings = [],
  onHeadingChange
}: { 
  id: number;
  heading: string;
  isDynamic?: boolean;
  onRemove: () => void;
  availableHeadings?: string[];
  onHeadingChange: (heading: string) => void;
}) => {
  // State for dropdowns and inputs
  const [source, setSource] = useState('');
  const [result, setResult] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isDocAttached, setIsDocAttached] = useState(false);
  const [isAssisted, setIsAssisted] = useState(false);

  return (
    <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
      <div className="grid grid-cols-5 divide-x">
        {/* First chunk - Non-editable heading */}
        <div className="p-2 bg-gray-50 flex items-center">
          {isDynamic ? (
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-xs"
              value={heading}
              onChange={(e) => onHeadingChange(e.target.value)}
            >
              {availableHeadings.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          ) : (
            <h4 className="font-medium text-gray-700 text-sm">{heading}</h4>
          )}
        </div>

        {/* Second chunk - Dropdown */}
        <div className="p-2">
          <label className="block text-xs font-medium text-gray-500 mb-0.5">Source</label>
          <select
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-xs h-7"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          >
            <option value="">Select Source</option>
            <option value="google">Google</option>
            <option value="linkedin">LinkedIn</option>
            <option value="facebook">Facebook</option>
            <option value="twitter">Twitter</option>
            <option value="instagram">Instagram</option>
            <option value="official">Official Records</option>
            <option value="field">Field Visit</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Third chunk - Text input 1 */}
        <div className="p-2">
          <label className="block text-xs font-medium text-gray-500 mb-0.5">Result</label>
          <input
            type="text"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-xs h-7"
            placeholder="Enter result"
            value={result}
            onChange={(e) => setResult(e.target.value)}
          />
        </div>

        {/* Fourth chunk - Text input 2 */}
        <div className="p-2">
          <label className="block text-xs font-medium text-gray-500 mb-0.5">Remarks</label>
          <input
            type="text"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-xs h-7"
            placeholder="Add remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>

        {/* Fifth chunk - Action buttons */}
        <div className="p-2 flex items-center justify-center space-x-2">
          <button
            onClick={() => setIsDocAttached(!isDocAttached)}
            className={`p-1.5 rounded-full ${isDocAttached ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'} hover:bg-gray-200 transition-colors`}
            title="Attach Document"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"></path>
            </svg>
          </button>
          
          <button
            onClick={() => setIsAssisted(!isAssisted)}
            className={`p-1.5 rounded-full ${isAssisted ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500'} hover:bg-gray-200 transition-colors`}
            title="AI Assist"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.26 12 2"></polygon>
            </svg>
          </button>
          
          {isDynamic && (
            <button
              onClick={onRemove}
              className="p-1.5 rounded-full bg-gray-100 text-red-500 hover:bg-gray-200 transition-colors"
              title="Remove Card"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Add this function right after the DDCard component but before the DueDiligenceContent component:

// History Card component for Due Diligence
const HistoryCard = ({ 
  title, 
  content,
  onSave
}: { 
  title: string;
  content: string;
  onSave: (newContent: string) => void;
}) => {
  const [showDialog, setShowDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const handleExpand = () => {
    setEditMode(false);
    setShowDialog(true);
  };

  const handleEdit = () => {
    setEditMode(true);
    setShowDialog(true);
    setEditedContent(content);
  };

  const handleSave = () => {
    onSave(editedContent);
    setShowDialog(false);
  };

  return (
    <div className="relative bg-white border rounded-lg shadow-sm p-4 h-full flex flex-col overflow-hidden">
      {/* Top right buttons */}
      <div className="absolute top-2 right-2 flex space-x-1.5">
        <button 
          className="p-1.5 rounded-full bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors shadow-sm"
          title="AI Assist"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.26 12 2"></polygon>
          </svg>
        </button>
        <button 
          className="p-1.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors shadow-sm"
          title="Voice Input"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
            <line x1="12" y1="19" x2="12" y2="23"></line>
            <line x1="8" y1="23" x2="16" y2="23"></line>
          </svg>
        </button>
      </div>

      {/* Title */}
      <h4 className="font-medium text-gray-800 mb-3 pr-16">{title}</h4>

      {/* Content */}
      <div className="flex-grow overflow-hidden">
        <p className="text-gray-600 text-sm line-clamp-4">{content}</p>
      </div>

      {/* Bottom buttons */}
      <div className="flex justify-between items-center pt-3 mt-2">
        <button 
          className="p-1.5 rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors shadow-sm"
          title="Delete"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
        <div className="flex space-x-1.5">
          <button 
            onClick={handleEdit}
            className="p-1.5 rounded-full bg-gray-50 text-blue-600 hover:bg-blue-50 transition-colors shadow-sm"
            title="Edit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8m-3-4h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path>
            </svg>
          </button>
          <button 
            onClick={handleExpand}
            className="p-1.5 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors shadow-sm"
            title="Expand"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h6v6"></path>
              <path d="M10 14 21 3"></path>
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-semibold text-lg">{title}</h3>
              <button 
                onClick={() => setShowDialog(false)}
                className="p-1.5 rounded-full hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="p-4">
              {editMode ? (
                <textarea
                  className="w-full border rounded-md p-3 min-h-[200px] focus:ring-blue-500 focus:border-blue-500"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                />
              ) : (
                <div className="max-h-[300px] overflow-y-auto p-1">
                  <p className="text-gray-700 whitespace-pre-wrap">{content}</p>
                </div>
              )}
            </div>
            <div className="flex justify-end p-4 border-t space-x-2 bg-gray-50">
              <button
                onClick={() => setShowDialog(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              {editMode && (
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const RTRContent = () => {
  // State to store grid data (40 rows x 6 columns)
  const [gridData, setGridData] = useState(() => {
    // Initialize with 40 rows of empty data
    return Array(40).fill(0).map((_, rowIndex) => ({
      id: rowIndex + 1,
      loan: `Loan ${rowIndex + 1}`,
      type: '',
      monthsPaid: '',
      tenure: '',
      currentBalance: '',
      emi: '',
      lender: '',
      bank: '',
      lastPaid: ''
    }));
  });

  // Function to update a cell in the grid
  const updateCell = (rowId: number, field: string, value: string) => {
    setGridData(gridData.map(row => 
      row.id === rowId ? {...row, [field]: value} : row
    ));
  };

  // Calculate some statistics based on the grid data
  const calculateStats = () => {
    // Count filled rows (any row with some data entered)
    const filledRows = gridData.filter(row => 
      row.type || row.monthsPaid || row.tenure || row.currentBalance || row.emi);
    
    if (filledRows.length === 0) return { 
      totalLoans: 0, 
      completed: 0, 
      active: 0, 
      highValue: 0 
    };
    
    // Count different types of loans based on your needs
    const completed = filledRows.filter(row => 
      row.monthsPaid && row.tenure && Number(row.monthsPaid) >= Number(row.tenure)).length;
    const active = filledRows.length - completed;
    const highValue = filledRows.filter(row => 
      row.currentBalance && Number(row.currentBalance.replace(/[^0-9.-]+/g, '')) > 100000).length;
    
    return {
      totalLoans: filledRows.length,
      completed,
      active,
      highValue,
      onTime: 0, // Placeholder value, update with actual calculation if needed
      totalEMIs: filledRows.length // Placeholder value, update with actual calculation if needed
    };
  };

  const stats = calculateStats();
  const [showConnectDialog, setShowConnectDialog] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Repayment Track Record (RTR)</h3>
        <button 
          className="px-4 py-2 rounded-md text-sm flex items-center shadow-sm bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white hover:opacity-90 transition-opacity"
          onClick={() => setShowConnectDialog(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
          Connect+
        </button>
      </div>

      {/* Connect Dialog */}
      {showConnectDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-xl overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-purple-50 to-pink-50">
              <h3 className="font-semibold text-lg">Connect Bank Statements</h3>
              <button 
                onClick={() => setShowConnectDialog(false)}
                className="p-1.5 rounded-full hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600 mb-2">Drag and drop bank statement files here, or</p>
                <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md cursor-pointer hover:bg-blue-700">
                  <span>Browse Files</span>
                  <input type="file" className="sr-only" multiple onChange={(e) => {
                    // Handle file selection
                    console.log(e.target.files);
                  }} />
                </label>
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Supported Banks</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    HDFC Bank
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    SBI
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Axis Bank
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    ICICI Bank
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Kotak
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-end p-4 border-t bg-gray-50">
              <button
                onClick={() => setShowConnectDialog(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Process files and close dialog
                  alert("Processing bank statements...");
                  setShowConnectDialog(false);
                }}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md hover:opacity-90"
              >
                Process Statements
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Statistics boxes */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total Loans</p>
          <p className="text-xl font-semibold">{stats.totalLoans}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Active Loans</p>
          <p className="text-xl font-semibold text-blue-600">{stats.active}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Completed Loans</p>
          <p className="text-xl font-semibold text-green-600">{stats.completed}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">High Value Loans</p>
          <p className="text-xl font-semibold text-purple-600">{stats.highValue}</p>
        </div>
      </div>
      
      {/* Editable grid */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        {/* Add height constraint for 7 rows and smooth scrolling */}
        <div className="overflow-y-auto overflow-x-auto" style={{ maxHeight: '350px' }}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th scope="col" className="sticky left-0 z-20 bg-gray-50 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loan
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Months Paid
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tenure
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Balance
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  EMI
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lender
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bank
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Paid
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {gridData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {/* First cell with sticky positioning */}
                  <td className="sticky left-0 bg-white z-10 px-3 py-2 whitespace-nowrap text-sm text-gray-700 border-r">
                    <input
                      type="text"
                      className="block w-full px-2 py-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={row.loan}
                      onChange={(e) => updateCell(row.id, 'loan', e.target.value)}
                    />
                  </td>
                  
                  {/* Type */}
                  <td className="px-3 py-2 whitespace-nowrap">
                    <select
                      className="block w-full px-2 py-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={row.type}
                      onChange={(e) => updateCell(row.id, 'type', e.target.value)}
                    >
                      <option value="">Select Type</option>
                      <option value="Personal">Personal</option>
                      <option value="Home">Home</option>
                      <option value="Auto">Auto</option>
                      <option value="Business">Business</option>
                      <option value="Education">Education</option>
                    </select>
                  </td>
                  
                  {/* Months Paid */}
                  <td className="px-3 py-2 whitespace-nowrap">
                    <input
                      type="number"
                      className="block w-full px-2 py-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={row.monthsPaid}
                      onChange={(e) => updateCell(row.id, 'monthsPaid', e.target.value)}
                    />
                  </td>
                  
                  {/* Tenure */}
                  <td className="px-3 py-2 whitespace-nowrap">
                    <input
                      type="number"
                      className="block w-full px-2 py-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={row.tenure}
                      onChange={(e) => updateCell(row.id, 'tenure', e.target.value)}
                    />
                  </td>
                  
                  {/* Current Balance */}
                  <td className="px-3 py-2 whitespace-nowrap">
                    <input
                      type="text"
                      className="block w-full px-2 py-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="₹ Amount"
                      value={row.currentBalance}
                      onChange={(e) => updateCell(row.id, 'currentBalance', e.target.value)}
                    />
                  </td>
                  
                  {/* EMI */}
                  <td className="px-3 py-2 whitespace-nowrap">
                    <input
                      type="text"
                      className="block w-full px-2 py-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="₹ Amount"
                      value={row.emi}
                      onChange={(e) => updateCell(row.id, 'emi', e.target.value)}
                    />
                  </td>
                  
                  {/* Lender */}
                  <td className="px-3 py-2 whitespace-nowrap">
                    <input
                      type="text"
                      className="block w-full px-2 py-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={row.lender}
                      onChange={(e) => updateCell(row.id, 'lender', e.target.value)}
                    />
                  </td>
                  
                  {/* Bank */}
                  <td className="px-3 py-2 whitespace-nowrap">
                    <input
                      type="text"
                      className="block w-full px-2 py-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={row.bank}
                      onChange={(e) => updateCell(row.id, 'bank', e.target.value)}
                    />
                  </td>
                  
                  {/* Last Paid */}
                  <td className="px-3 py-2 whitespace-nowrap">
                    <input
                      type="date"
                      className="block w-full px-2 py-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={row.lastPaid}
                      onChange={(e) => updateCell(row.id, 'lastPaid', e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Summary Section */}
      <div className="mt-6 bg-gray-50 p-4 rounded-lg border">
        <h4 className="text-md font-semibold mb-3">Payment Pattern Analysis</h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">On-Time Payment %</p>
            <p className="font-medium">
              0%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Average Delay</p>
            <p className="font-medium">0 days</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Overall RTR Rating</p>
            <div className="flex items-center">
              {Array(5).fill(0).map((_, i) => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={i < Math.round(((stats.onTime || 0) / (stats.totalEMIs || 1)) * 5) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Summary Section */}
      <div className="mt-6 bg-gray-50 p-4 rounded-lg border">
        <h4 className="text-md font-semibold mb-3">Loan Portfolio Analysis</h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Active Loan %</p>
            <p className="font-medium">
              {stats.totalLoans ? ((stats.active / stats.totalLoans) * 100).toFixed(1) : 0}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Avg. Loan Amount</p>
            <p className="font-medium">
              ₹{gridData
                .filter(row => row.currentBalance)
                .map(row => Number(row.currentBalance.replace(/[^0-9.-]+/g, '')) || 0)
                .reduce((sum, val) => sum + val, 0) / 
                (gridData.filter(row => row.currentBalance).length || 1)
              }
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Overall Health</p>
            <div className="flex items-center">
              {Array(5).fill(0).map((_, i) => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" 
                  fill={i < Math.round((stats.completed / (stats.totalLoans || 1)) * 5) ? "currentColor" : "none"} 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                  className="text-yellow-500">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add this new component alongside other content components
const CreditPlusPlusContent = () => {
  const [selectedModel, setSelectedModel] = useState('deep-pattern');
  const [isSeekingActive, setIsSeekingActive] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeResultTab, setActiveResultTab] = useState('summary');
  const [hasResults, setHasResults] = useState(false);
  
  // Function to handle the seeking process
  const startSeeking = () => {
    setIsProcessing(true);
    
    // Simulate processing with a timer
    setTimeout(() => {
      setIsProcessing(false);
      setHasResults(true);
    }, 2000);
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-6">Credit++ Advanced Analysis</h3>
      
      {/* Model Selection */}
      <div className="bg-white p-6 rounded-lg border shadow-sm mb-8">
        <h4 className="text-md font-semibold mb-4">Select Analysis Model</h4>
        
        <div className="grid grid-cols-2 gap-4">
          <label 
            className={`p-4 border rounded-lg cursor-pointer transition-colors flex items-start ${
              selectedModel === 'deep-pattern' 
                ? 'border-blue-300 bg-blue-50' 
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <input
              type="radio"
              name="creditModel"
              value="deep-pattern"
              checked={selectedModel === 'deep-pattern'}
              onChange={() => setSelectedModel('deep-pattern')}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <div className="ml-3">
              <p className="font-medium text-gray-900">Deep Pattern Model</p>
              <p className="text-sm text-gray-500 mt-1">
                Analyzes historical credit behavior across multiple dimensions to identify 
                patterns invisible to traditional credit scoring models. Best for established 
                credit histories with rich data points.
              </p>
            </div>
          </label>
          
          <label 
            className={`p-4 border rounded-lg cursor-pointer transition-colors flex items-start ${
              selectedModel === 'portfolio-seeker' 
                ? 'border-purple-300 bg-purple-50' 
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <input
              type="radio"
              name="creditModel"
              value="portfolio-seeker"
              checked={selectedModel === 'portfolio-seeker'}
              onChange={() => setSelectedModel('portfolio-seeker')}
              className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
            />
            <div className="ml-3">
              <p className="font-medium text-gray-900">Portfolio Seeker Model</p>
              <p className="text-sm text-gray-500 mt-1">
                Compares applicant profile against similar loan portfolios to predict 
                performance based on cohort analysis. Ideal for less established credit 
                histories or unique financial situations.
              </p>
            </div>
          </label>
        </div>
      </div>
      
      {/* Seeker Button */}
      <div className="flex flex-col items-center justify-center py-8">
        <button 
          onClick={() => setShowConfirmDialog(true)}
          disabled={isProcessing}
          className={`
            h-36 w-36 rounded-full flex items-center justify-center shadow-lg 
            font-bold text-xl text-white relative overflow-hidden
            ${isProcessing 
              ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 bg-size-200 animate-gradient-x cursor-wait' 
              : isSeekingActive 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
            }
            transition-all duration-300
          `}
        >
          {isProcessing ? (
            <div className="animate-spin">
              <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
              </svg>
            </div>
          ) : (
            <span className="flex items-center">
              SEEKER
              {isSeekingActive && (
                <svg className="ml-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5"></path>
                </svg>
              )}
            </span>
          )}
        </button>
        
        <p className="mt-4 text-sm text-gray-500">
          {isProcessing 
            ? "Connecting to data sources and analyzing patterns..." 
            : isSeekingActive 
              ? "Analysis complete. View results below." 
              : "Click SEEKER to initiate the Credit++ analysis"
          }
        </p>
      </div>
      
      {/* Results Section - Only shows after processing */}
      {hasResults && (
        <div className="mt-8 bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="flex border-b">
            <button 
              onClick={() => setActiveResultTab('summary')}
              className={`px-4 py-3 font-medium text-sm ${
                activeResultTab === 'summary' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Summary
            </button>
            <button 
              onClick={() => setActiveResultTab('details')}
              className={`px-4 py-3 font-medium text-sm ${
                activeResultTab === 'details' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Detailed Analysis
            </button>
            <button 
              onClick={() => setActiveResultTab('recommendations')}
              className={`px-4 py-3 font-medium text-sm ${
                activeResultTab === 'recommendations' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Recommendations
            </button>
          </div>
          
          <div className="p-6">
            {activeResultTab === 'summary' && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Credit++ Score</h4>
                  <div className="flex items-center">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl">
                      82
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-blue-800">Very Good</p>
                      <p className="text-xs text-blue-600 mt-1">Top 18% in this category</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-gray-500">Risk Level</p>
                    <p className="font-medium text-green-600">Low Risk</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-gray-500">Default Probability</p>
                    <p className="font-medium">3.2%</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-gray-500">Analysis Confidence</p>
                    <p className="font-medium text-blue-600">High (92%)</p>
                  </div>
                </div>
              </div>
            )}
            
            {activeResultTab === 'details' && (
              <div className="space-y-4">
                <h4 className="font-medium">Detailed Analysis</h4>
                <p className="text-gray-600">Detailed analysis content would appear here...</p>
              </div>
            )}
            
            {activeResultTab === 'recommendations' && (
              <div className="space-y-4">
                <h4 className="font-medium">Recommendations</h4>
                <p className="text-gray-600">Recommendations content would appear here...</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Analysis</h3>
              <p className="text-sm text-gray-500">
                You are about to run a <span className="font-medium">{
                  selectedModel === 'deep-pattern' ? 'Deep Pattern' : 'Portfolio Seeker'
                } Model</span> analysis on this customer's data. This process will analyze all available credit information.
              </p>
              
              <p className="text-sm text-gray-500 mt-2">
                Would you like to proceed?
              </p>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowConfirmDialog(false);
                  setIsSeekingActive(true);
                  startSeeking();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Add this new component alongside other content components
const PDPlusContent = ({ data }: { data: CustomerCase }) => {
  // State for customer selection and PD information
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [showCallDialog, setShowCallDialog] = useState(false);
  const [selectedPD, setSelectedPD] = useState('PD #1');
  const [pdParticipants, setPDParticipants] = useState([
    { id: 1, name: data.customerName }
  ]);
  
  // Get all customers from basics component (in a real app, this would come from API)
  const allCustomers = [
    { id: '1', name: data.customerName, mobile: '9876543210', pincode: '560001' },
    { id: '2', name: 'Jane Smith', mobile: '8765432109', pincode: '400001' },
    { id: '3', name: 'Robert Johnson', mobile: '7654321098', pincode: '110001' }
  ];
  
  // Get selected customer details
  const customer = allCustomers.find(c => c.id === selectedCustomer) || allCustomers[0];
  
  // Initialize with first customer
  useEffect(() => {
    if (!selectedCustomer && allCustomers.length > 0) {
      setSelectedCustomer(allCustomers[0].id);
    }
  }, []);

  // Add new participant
  const addParticipant = () => {
    const newId = pdParticipants.length > 0 
      ? Math.max(...pdParticipants.map(p => p.id)) + 1 
      : 1;
    setPDParticipants([...pdParticipants, { id: newId, name: '' }]);
  };

  // Update participant
  const updateParticipant = (id: number, name: string) => {
    setPDParticipants(pdParticipants.map(p => 
      p.id === id ? { ...p, name } : p
    ));
  };

  // Remove participant
  const removeParticipant = (id: number) => {
    if (pdParticipants.length > 1) {
      setPDParticipants(pdParticipants.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* "For PD" Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
          <span className="w-1.5 h-5 bg-blue-500 rounded-sm mr-2"></span>
          For PD
        </h3>
        
        <div className="grid grid-cols-10 gap-4">
          {/* 30% width card */}
          <div className="col-span-3 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Customer
            </label>
            <select
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm mb-4"
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
            >
              {allCustomers.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            
            {customer && (
              <div className="mt-4">
                <p className="text-sm text-gray-500">Mobile Number</p>
                <div className="flex items-center mt-1">
                  <p className="text-lg font-medium">{customer.mobile}</p>
                  <button 
                    onClick={() => setShowCallDialog(true)}
                    className="ml-3 p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-all hover:scale-110 animate-pulse-slow"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* 70% width card with map */}
          <div className="col-span-7 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex h-full">
              {/* 40% dropdown area */}
              <div className="w-2/5 pr-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Location
                </label>
                <select
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm mb-3"
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                >
                  {allCustomers.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                
                <div className="mt-3">
                  <p className="text-sm text-gray-500">Pincode</p>
                  <p className="text-xl font-medium">{customer?.pincode}</p>
                </div>
                
                <div className="mt-3">
                  <p className="text-sm text-gray-500">Address Type</p>
                  <div className="flex mt-1 space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Residential
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Verified
                    </span>
                  </div>
                </div>
              </div>
              
              {/* 60% map area */}
              <div className="w-3/5 bg-gray-100 rounded-lg overflow-hidden relative">
                {/* Placeholder for map - in a real app, use a map library */}
                <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                  <img 
                    src={`https://via.placeholder.com/600x400.png?text=Map+for+${customer?.pincode || '560001'}`} 
                    alt="Location Map" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white p-2 rounded-lg shadow-lg">
                      <p className="font-semibold">{customer?.pincode}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* PD Voice Summary */}
      <div className="mt-8">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <h4 className="text-md font-semibold mb-4">PD Voice Summary</h4>
          
          <div className="flex">
            {/* 20% width - Participants */}
            <div className="w-1/5 pr-4 border-r">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-gray-700">Participants</p>
                <button 
                  onClick={addParticipant}
                  className="p-1 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
              </div>
              
              {/* Participants data grid */}
              <div className="space-y-2 mb-4">
                {pdParticipants.map((participant) => (
                  <div key={participant.id} className="flex items-center space-x-1">
                    <select
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs"
                      value={participant.name}
                      onChange={(e) => updateParticipant(participant.id, e.target.value)}
                    >
                      <option value="">Select</option>
                      {allCustomers.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                    
                    {pdParticipants.length > 1 && (
                      <button 
                        onClick={() => removeParticipant(participant.id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              {/* PD selection */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PD Number
                </label>
                <select
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                  value={selectedPD}
                  onChange={(e) => setSelectedPD(e.target.value)}
                >
                  <option value="PD #1">PD #1</option>
                  <option value="PD #2">PD #2</option>
                  <option value="PD #3">PD #3</option>
                </select>
              </div>
            </div>
            
            {/* 80% width - Split into two equal cards */}
            <div className="w-4/5 pl-4 grid grid-cols-2 gap-4">
              {/* Full Summary Card */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative">
                <h5 className="font-medium text-gray-800 mb-2">Full Summary</h5>
                <textarea
                  className="w-full h-32 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Enter the full PD summary here..."
                ></textarea>
                
                {/* Upload button */}
                <div className="absolute bottom-3 right-3">
                  <button className="p-1.5 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Key Highlights Card */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h5 className="font-medium text-gray-800 mb-2">Key Highlights</h5>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <span className="inline-block bg-blue-100 text-blue-800 rounded-full p-1 mr-2 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </span>
                    <input
                      type="text"
                      className="block w-full p-1.5 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Key highlight 1"
                    />
                  </div>
                  <div className="flex items-start">
                    <span className="inline-block bg-blue-100 text-blue-800 rounded-full p-1 mr-2 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </span>
                    <input
                      type="text"
                      className="block w-full p-1.5 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Key highlight 2"
                    />
                  </div>
                  <div className="flex items-start">
                    <span className="inline-block bg-blue-100 text-blue-800 rounded-full p-1 mr-2 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </span>
                    <input
                      type="text"
                      className="block w-full p-1.5 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Key highlight 3"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Post-PD section */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
          <span className="w-1.5 h-5 bg-blue-500 rounded-sm mr-2"></span>
          Post-PD
        </h3>
        
        <div className="grid grid-cols-3 gap-4">
          {/* File upload options */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h5 className="font-medium text-gray-800 mb-3">PD Report</h5>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm text-gray-500 mb-2">Drag and drop file here, or</p>
              <button className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
                Browse Files
              </button>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h5 className="font-medium text-gray-800 mb-3">Photos</h5>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-gray-500 mb-2">Upload site photos</p>
              <button className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
                Select Photos
              </button>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h5 className="font-medium text-gray-800 mb-3">Supporting Documents</h5>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm text-gray-500 mb-2">Upload any additional documents</p>
              <button className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
                Browse Files
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call Dialog */}
      {showCallDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="p-5">
              <h3 className="text-lg font-medium text-center mb-4">Call this number?</h3>
              <p className="text-2xl font-semibold text-center mb-6">{customer?.mobile}</p>
              
              <div className="flex justify-between space-x-2">
                <button
                  onClick={() => setShowCallDialog(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Later
                </button>
                <button
                  onClick={() => {
                    alert(`Calling ${customer?.mobile}`);
                    setShowCallDialog(false);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Call
                </button>
                <button
                  onClick={() => {
                    alert(`Initiating enhanced call with ${customer?.mobile}`);
                    setShowCallDialog(false);
                  }}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white rounded-lg hover:opacity-90"
                >
                  Call+
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseDetails;


