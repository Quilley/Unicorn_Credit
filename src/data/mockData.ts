import { CustomerCase } from '../types';

export const mockCases: CustomerCase[] = [
  {
    id: 'CAS001',
    customerName: 'John Doe',
    loanAmount: 500000,
    status: 'assigned',
    details: {
      basics: {
        name: 'John Doe',
        age: 35,
        occupation: 'Personal Loan',
        annualIncome: 1200000
      },
      banking: {
        accountNumber: '1234567890',
        bankName: 'State Bank',
        averageBalance: 100000,
        transactions: []
      },
      bureau: {
        creditScore: 750,
        outstandingLoans: 0,
        paymentHistory: []
      },
      financials: {
        monthlyIncome: 100000,
        monthlyExpenses: 40000,
        assets: [],
        liabilities: []
      },
      pdDetails: {
        probabilityOfDefault: 0.05,
        riskScore: 85,
        riskCategory: 'Low Risk'
      },
      additional: {
        comments: '',
        documents: []
      }
    }
  },
  {
    id: 'CAS002',
    customerName: 'Jane Smith',
    loanAmount: 750000,
    status: 'draft',
    details: {
      basics: {
        name: 'Jane Smith',
        age: 42,
        occupation: 'Home Loan',
        annualIncome: 2500000
      },
      banking: {
        accountNumber: '9876543210',
        bankName: 'HDFC Bank',
        averageBalance: 350000,
        transactions: []
      },
      bureau: {
        creditScore: 820,
        outstandingLoans: 1,
        paymentHistory: []
      },
      financials: {
        monthlyIncome: 208000,
        monthlyExpenses: 75000,
        assets: [],
        liabilities: []
      },
      pdDetails: {
        probabilityOfDefault: 0.02,
        riskScore: 92,
        riskCategory: 'Very Low Risk'
      },
      additional: {
        comments: '',
        documents: []
      }
    }
  },
  {
    id: 'CAS003',
    customerName: 'Robert Johnson',
    loanAmount: 1200000,
    status: 'submitted',
    details: {
      basics: {
        name: 'Robert Johnson',
        age: 38,
        occupation: 'Business Loan',
        annualIncome: 3000000
      },
      banking: {
        accountNumber: '1122334455',
        bankName: 'Axis Bank',
        averageBalance: 420000,
        transactions: []
      },
      bureau: {
        creditScore: 780,
        outstandingLoans: 2,
        paymentHistory: []
      },
      financials: {
        monthlyIncome: 250000,
        monthlyExpenses: 100000,
        assets: [],
        liabilities: []
      },
      pdDetails: {
        probabilityOfDefault: 0.03,
        riskScore: 88,
        riskCategory: 'Low Risk'
      },
      additional: {
        comments: '',
        documents: []
      }
    }
  }
];