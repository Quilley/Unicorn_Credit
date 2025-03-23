from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import uvicorn
from datetime import date, datetime, timedelta
import random

app = FastAPI(title="Underwriter API", description="API for Underwriter CET application")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev server ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define data models that match the React frontend expectations
class PDDetails(BaseModel):
    probabilityOfDefault: float
    riskScore: int
    riskCategory: str

class BankingDetails(BaseModel):
    bankName: str
    accountNumber: str
    averageBalance: float
    transactions: List = []

class BasicsDetails(BaseModel):
    name: str
    age: int
    occupation: str
    businessType: str
    yearsInBusiness: int
    establishmentYear: int
    annualIncome: float = 0

class FinancialDetails(BaseModel):
    monthlyIncome: float
    monthlyExpenses: float
    profitMargin: float

class BureauDetails(BaseModel):
    creditScore: int
    reportDate: str
    outstandingLoans: int = 0
    paymentHistory: List = []

class Document(BaseModel):
    name: str
    type: str

class AdditionalDetails(BaseModel):
    notes: str
    documentsUploaded: int
    completionStatus: float
    documents: List[Document] = []
    comments: str = ""

class CaseDetails(BaseModel):
    basics: BasicsDetails
    banking: BankingDetails
    bureau: BureauDetails
    financials: FinancialDetails
    pdDetails: PDDetails
    additional: AdditionalDetails

class CustomerCase(BaseModel):
    id: str
    customerName: str
    status: str
    assignedTo: str
    loanAmount: float
    timestamp: datetime
    details: CaseDetails

# Generate dummy data
def generate_dummy_cases(num_cases=10):
    statuses = ["assigned", "draft", "submitted"]
    occupations = ["Self-employed", "Salaried", "Business Owner", "Entrepreneur", "Freelancer"]
    business_types = ["Retail", "Services", "Manufacturing", "Technology", "Healthcare"]
    assignees = ["Rahul Sharma", "Priya Patel", "Amar Singh", "Diya Kapoor"]
    
    cases = []
    
    for i in range(1, num_cases + 1):
        status = random.choice(statuses)
        loan_amount = random.randint(100000, 10000000)
        
        # Generate a timestamp within the last 30 days
        days_ago = random.randint(0, 30)
        timestamp = datetime.now() - timedelta(days=days_ago)
        
        # Create case details
        pd_details = PDDetails(
            probabilityOfDefault=random.uniform(0.01, 0.15),
            riskScore=random.randint(60, 95),
            riskCategory=random.choice(["Low Risk", "Medium Risk", "High Risk"])
        )
        
        banking_details = BankingDetails(
            bankName=random.choice(["HDFC Bank", "SBI", "ICICI Bank", "Axis Bank", "Kotak Mahindra"]),
            accountNumber=f"XXXX{random.randint(1000, 9999)}",
            averageBalance=random.randint(50000, 1000000)
        )
        
        financials = FinancialDetails(
            monthlyIncome=random.randint(50000, 500000),
            monthlyExpenses=random.randint(20000, 200000),
            profitMargin=random.uniform(0.1, 0.4)
        )
        
        # Adding age as a required field in basics
        age = random.randint(25, 60)
        basics = BasicsDetails(
            name=f"Customer {i}",
            age=age,
            occupation=random.choice(occupations),
            businessType=random.choice(business_types),
            yearsInBusiness=random.randint(1, 20),
            establishmentYear=random.randint(1990, 2020),
            annualIncome=financials.monthlyIncome * 12
        )
        
        # Adding bureau details
        bureau = BureauDetails(
            creditScore=random.randint(600, 850),
            reportDate=(datetime.now() - timedelta(days=random.randint(1, 60))).strftime("%Y-%m-%d"),
            outstandingLoans=random.randint(0, 5)
        )
        
        # Adding documents
        doc_types = ["ID Proof", "Address Proof", "Income Proof", "Bank Statement"]
        documents = [
            Document(
                name=f"Doc_{j+1}.pdf",
                type=random.choice(doc_types)
            ) 
            for j in range(random.randint(0, 3))
        ]
        
        additional = AdditionalDetails(
            notes="These are sample notes for the case.",
            documentsUploaded=len(documents),
            completionStatus=random.uniform(0.1, 1.0),
            documents=documents,
            comments="Sample comments about this case"
        )
        
        details = CaseDetails(
            basics=basics,
            banking=banking_details,
            bureau=bureau,
            financials=financials,
            pdDetails=pd_details,
            additional=additional
        )
        
        # Create the case
        case = CustomerCase(
            id=f"CASE{i:04d}",
            customerName=f"Customer {i}",
            status=status,
            assignedTo=random.choice(assignees),
            loanAmount=loan_amount,
            timestamp=timestamp,
            details=details
        )
        
        cases.append(case)
    
    return cases

# Generate dummy data
dummy_cases = generate_dummy_cases(15)

# API Endpoints - Reorder to fix route conflicts
@app.get("/api/cases/filter/{status}", response_model=List[CustomerCase])
def get_cases_by_status(status: str):
    filtered_cases = [case for case in dummy_cases if case.status == status]
    return filtered_cases

@app.get("/api/cases/{case_id}", response_model=CustomerCase)
def get_case_by_id(case_id: str):
    # Skip if the case_id is "filter" since that's handled by the route above
    if case_id == "filter":
        raise HTTPException(status_code=404, detail="Invalid case ID")
        
    for case in dummy_cases:
        if case.id == case_id:
            return case
    raise HTTPException(status_code=404, detail=f"Case with ID {case_id} not found")

@app.get("/api/cases", response_model=List[CustomerCase])
def get_all_cases():
    return dummy_cases

# Add debugging route
@app.get("/api/debug")
def debug_info():
    """Return debug information about the API"""
    return {
        "routes": [
            {"path": "/api/cases", "method": "GET", "description": "Get all cases"},
            {"path": "/api/cases/filter/{status}", "method": "GET", "description": "Filter cases by status"},
            {"path": "/api/cases/{case_id}", "method": "GET", "description": "Get case by ID"},
        ],
        "cases_count": len(dummy_cases),
        "case_ids": [case.id for case in dummy_cases],
        "sample_case": dummy_cases[0].dict() if dummy_cases else None
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
