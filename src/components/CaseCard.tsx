import React from 'react';
import { motion } from 'framer-motion';
import { CustomerCase } from '../types';
import { ArrowRightCircle, Clock } from 'lucide-react';

interface CaseCardProps {
  case: CustomerCase;
  onClick: () => void;
}

const CaseCard: React.FC<CaseCardProps> = ({ case: customerCase, onClick }) => {
  // Format assignment time (using a dummy date for now)
  const assignmentTime = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="bg-white rounded-lg shadow-sm p-5 cursor-pointer w-[95%] mx-auto flex items-center justify-between"
      onClick={onClick}
      layoutId={`case-card-${customerCase.id}`}
      transition={{ 
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
    >
      <div className="flex items-center space-x-6 flex-grow">
        {/* Case ID */}
        <div className="min-w-24">
          <p className="text-xs text-gray-500 mb-1">Case ID</p>
          <p className="font-medium text-gray-800">{customerCase.id}</p>
        </div>
        
        {/* Customer/Entity Name */}
        <div className="min-w-40 flex-grow">
          <p className="text-xs text-gray-500 mb-1">Customer Name</p>
          <p className="font-medium text-gray-800">{customerCase.customerName}</p>
        </div>
        
        {/* Program Type (using occupation as a proxy) */}
        <div className="min-w-32">
          <p className="text-xs text-gray-500 mb-1">Program Type</p>
          <p className="font-medium text-gray-800">{customerCase.details.basics.occupation}</p>
        </div>
        
        {/* Loan Amount */}
        <div className="min-w-32">
          <p className="text-xs text-gray-500 mb-1">Loan Amount</p>
          <p className="font-medium text-blue-600">₹{customerCase.loanAmount.toLocaleString()}</p>
        </div>
        
        {/* Assignment Time */}
        <div className="min-w-32">
          <p className="text-xs text-gray-500 mb-1">Assignment Date</p>
          <div className="flex items-center gap-1.5 text-gray-700">
            <Clock size={14} />
            <span className="text-sm">{assignmentTime}</span>
          </div>
        </div>
      </div>
      
      {/* Action button */}
      <motion.div 
        whileHover={{ scale: 1.1 }}
        className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 ml-4"
      >
        <ArrowRightCircle size={18} />
      </motion.div>
    </motion.div>
  );
};

export default CaseCard;