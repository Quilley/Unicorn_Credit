export interface CustomerCase {
  id: string;
  customerName: string;
  loanAmount: number;
  status: 'assigned' | 'draft' | 'submitted';
  assignedTo: string;
  timestamp: string;
  details: {
    basics: CustomerBasics;
    banking: BankingDetails;
    bureau: BureauDetails;
    financials: FinancialDetails;
    pdDetails: PDDetails;
    additional: AdditionalDetails;
  };
}

export interface CustomerBasics {
  name: string;
  age: number;
  occupation: string;
  businessType: string;
  yearsInBusiness: number;
  establishmentYear: number;
  annualIncome: number;
}

export interface BankingDetails {
  accountNumber: string;
  bankName: string;
  averageBalance: number;
  transactions: Transaction[];
}

export interface BureauDetails {
  creditScore: number;
  reportDate: string;
  outstandingLoans: number;
  paymentHistory: PaymentHistory[];
}

export interface FinancialDetails {
  monthlyIncome: number;
  monthlyExpenses: number;
  profitMargin: number;
}

export interface PDDetails {
  probabilityOfDefault: number;
  riskScore: number;
  riskCategory: string;
}

export interface AdditionalDetails {
  notes: string;
  documentsUploaded: number;
  completionStatus: number;
  documents: Document[];
  comments: string;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: string;
  description: string;
}

export interface PaymentHistory {
  id: string;
  date: string;
  status: 'on_time' | 'late' | 'missed';
  amount: number;
}

export interface Document {
  name: string;
  type: string;
}