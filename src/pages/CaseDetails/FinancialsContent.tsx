import React, { useState } from 'react';
import { CustomerCase } from '../../types';
import { X, Plus } from 'lucide-react';

interface FinancialsContentProps {
  data: CustomerCase['details']['financials'];
  pdDetails: CustomerCase['details']['pdDetails'];
}

// Define data for financial statements
const financialStatementData = {
  'P&L': [
    'Revenue', 
    'Cost of Goods Sold', 
    'Gross Profit', 
    'Operating Expenses', 
    'Salaries and Wages', 
    'Rent', 
    'Utilities', 
    'Marketing and Advertising', 
    'Other Expenses', 
    'EBITDA', 
    'Depreciation and Amortization', 
    'EBIT', 
    'Interest Expenses', 
    'Tax', 
    'Net Profit'
  ],
  'Balance Sheet': [
    'Assets',
    'Current Assets',
    'Cash and Cash Equivalents',
    'Accounts Receivable',
    'Inventory',
    'Prepaid Expenses',
    'Non-Current Assets',
    'Property, Plant and Equipment',
    'Intangible Assets',
    'Investments',
    'Liabilities',
    'Current Liabilities',
    'Accounts Payable',
    'Short-term Loans',
    'Non-Current Liabilities',
    'Long-term Loans',
    'Equity',
    'Share Capital',
    'Retained Earnings'
  ],
  'Cash Flow': [
    'Operating Cash Flow',
    'Net Income',
    'Depreciation and Amortization',
    'Changes in Working Capital',
    'Changes in Accounts Receivable',
    'Changes in Inventory',
    'Changes in Accounts Payable',
    'Investing Cash Flow',
    'Purchase of Property, Plant and Equipment',
    'Sale of Property, Plant and Equipment',
    'Purchase of Investments',
    'Sale of Investments',
    'Financing Cash Flow',
    'Proceeds from Issuing Shares',
    'Proceeds from Long-term Borrowings',
    'Repayment of Long-term Borrowings',
    'Dividends Paid',
    'Net Increase in Cash and Cash Equivalents'
  ],
  'GST': [] // GST will use a different approach
};

// Generate a list of fiscal years (current and past 3 years)
const generateFiscalYears = () => {
  const currentYear = new Date().getFullYear();
  const fiscalYears = [];
  
  for (let i = 0; i < 4; i++) {
    const year = currentYear - i;
    fiscalYears.push(`FY ${year-1}-${(year % 100).toString().padStart(2, '0')}`);
  }
  
  return fiscalYears;
};

const fiscalYears = generateFiscalYears();

const FinancialsContent: React.FC<FinancialsContentProps> = ({ data, pdDetails }) => {
  const [statementType, setStatementType] = useState<string>('P&L');
  const [columns, setColumns] = useState<string[]>([fiscalYears[0], fiscalYears[1]]);
  const [gridData, setGridData] = useState<Record<string, Record<string, Record<string, string>>>>({});

  // Function to add a column
  const addColumn = () => {
    if (columns.length < 6) { // Limit to 6 columns (including first column)
      const availableYears = fiscalYears.filter(year => !columns.includes(year));
      if (availableYears.length > 0) {
        setColumns([...columns, availableYears[0]]);
      }
    }
  };

  // Function to remove a column
  const removeColumn = (columnIndex: number) => {
    if (columns.length > 1) {
      setColumns(columns.filter((_, index) => index !== columnIndex));
      
      // Clean up gridData for removed column
      const updatedGridData = { ...gridData };
      
      if (statementType in updatedGridData) {
        Object.keys(updatedGridData[statementType]).forEach(row => {
          if (updatedGridData[statementType][row]) {
            const { [columns[columnIndex]]: _, ...rest } = updatedGridData[statementType][row];
            updatedGridData[statementType][row] = rest;
          }
        });
      }
      
      setGridData(updatedGridData);
    }
  };

  // Function to update cell data
  const updateCell = (row: string, column: string, value: string): void => {
    const updatedGridData = { ...gridData };
    
    if (!updatedGridData[statementType]) {
      updatedGridData[statementType] = {};
    }
    
    if (!updatedGridData[statementType][row]) {
      updatedGridData[statementType][row] = {} as Record<string, string>;
    }
    
    updatedGridData[statementType][row][column] = value;
    setGridData(updatedGridData);
  };

  // Get cell value
  const getCellValue = (row: string, column: string): string => {
    if (
      gridData[statementType] && 
      gridData[statementType][row] && 
      gridData[statementType][row][column] !== undefined
    ) {
      return gridData[statementType][row][column];
    }
    return '';
  };

  // Function to generate GST content
  const renderGSTContent = () => {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h4 className="text-md font-semibold mb-4">GST Return Filing Status</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Month
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    GSTR-1
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    GSTR-3B
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.from({ length: 12 }).map((_, index) => {
                  const date = new Date();
                  date.setMonth(date.getMonth() - index);
                  const month = date.toLocaleString('default', { month: 'long' });
                  const year = date.getFullYear();
                  
                  return (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {month} {year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <select 
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          defaultValue="filed"
                        >
                          <option value="filed">Filed</option>
                          <option value="pending">Pending</option>
                          <option value="delayed">Delayed</option>
                          <option value="not_applicable">Not Applicable</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <select 
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          defaultValue="filed"
                        >
                          <option value="filed">Filed</option>
                          <option value="pending">Pending</option>
                          <option value="delayed">Delayed</option>
                          <option value="not_applicable">Not Applicable</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Compliant
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h4 className="text-md font-semibold mb-4">GST Details</h4>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-gray-500 text-sm mb-1">GSTIN</p>
              <input
                type="text"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="29ABCDE1234F1Z5"
              />
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Registration Date</p>
              <input
                type="date"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Compliance Rating</p>
              <select 
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                defaultValue="5"
              >
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Good</option>
                <option value="3">3 - Average</option>
                <option value="2">2 - Below Average</option>
                <option value="1">1 - Poor</option>
              </select>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Filing Frequency</p>
              <select 
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                defaultValue="monthly"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Financial Analysis</h3>
        
        <div className="flex space-x-2">
          <select
            className="block w-auto rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={statementType}
            onChange={(e) => setStatementType(e.target.value)}
          >
            <option value="P&L">P&L</option>
            <option value="Balance Sheet">Balance Sheet</option>
            <option value="Cash Flow">Cash Flow</option>
            <option value="GST">GST</option>
          </select>
          
          {statementType !== 'GST' && (
            <button
              onClick={addColumn}
              disabled={columns.length >= 6 || columns.length >= fiscalYears.length}
              className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center ${
                columns.length >= 6 || columns.length >= fiscalYears.length
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              }`}
            >
              <Plus size={16} className="mr-1" />
              Add Year
            </button>
          )}
        </div>
      </div>
      
      {statementType === 'GST' ? (
        renderGSTContent()
      ) : (
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-64">
                    Item
                  </th>
                  
                  {columns.map((column, columnIndex) => (
                    <th 
                      key={column} 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48"
                    >
                      <div className="flex items-center justify-between">
                        <select
                          className="block w-36 text-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          value={column}
                          onChange={(e) => {
                            const newColumns = [...columns];
                            newColumns[columnIndex] = e.target.value;
                            setColumns(newColumns);
                          }}
                        >
                          {fiscalYears.map(year => (
                            <option 
                              key={year} 
                              value={year}
                              disabled={columns.includes(year) && columns.indexOf(year) !== columnIndex}
                            >
                              {year}
                            </option>
                          ))}
                        </select>
                        
                        {columnIndex > 0 && (
                          <button
                            onClick={() => removeColumn(columnIndex)}
                            className="text-gray-400 hover:text-red-500 focus:outline-none"
                            title="Remove column"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {financialStatementData[statementType as keyof typeof financialStatementData].map((row, rowIndex) => (
                  <tr 
                    key={row} 
                    className={
                      row === 'Revenue' || 
                      row === 'Gross Profit' || 
                      row === 'EBITDA' || 
                      row === 'EBIT' || 
                      row === 'Net Profit' ||
                      row === 'Assets' ||
                      row === 'Liabilities' ||
                      row === 'Equity' ||
                      row === 'Operating Cash Flow' ||
                      row === 'Investing Cash Flow' ||
                      row === 'Financing Cash Flow' ||
                      row === 'Net Increase in Cash and Cash Equivalents'
                        ? 'bg-gray-50 font-medium'
                        : ''
                    }
                  >
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">
                      {row}
                    </td>
                    
                    {columns.map((column) => (
                      <td key={`${row}-${column}`} className="px-6 py-3 whitespace-nowrap">
                        <input
                          type="text"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          placeholder="₹ 0.00"
                          value={getCellValue(row, column)}
                          onChange={(e) => updateCell(row, column, e.target.value)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Basic Financial KPI Summary */}
      <div className="bg-gray-50 rounded-lg border p-4">
        <h4 className="text-md font-semibold mb-3">Key Financial Indicators</h4>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <p className="text-gray-500 text-sm mb-1">Monthly Income</p>
            <p className="font-medium">₹{data.monthlyIncome.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Monthly Expenses</p>
            <p className="font-medium">₹{data.monthlyExpenses.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Profit Margin</p>
            <p className="font-medium">{(data.profitMargin * 100).toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Risk Score</p>
            <p className="font-medium">{pdDetails.riskScore}/100</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialsContent;