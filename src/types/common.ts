export interface Brand {
  id: string;
  name: string;
  logo: string;
  models: string[];
  isPopular?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  text: string;
  vehicle?: string;
  location: string;
  date: string;
}

export interface Lead {
  id?: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  type: 'buyback' | 'financing' | 'contact' | 'order';
  vehicleId?: string;
  vin?: string;
  images?: string[];
  createdAt?: string;
}

export interface FinancingCalculation {
  loanAmount: number;
  downPayment: number;
  interestRate: number;
  termMonths: number;
  monthlyPayment: number;
  totalInterest: number;
  totalAmount: number;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  schedule: {
    [key: string]: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface USP {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface ProcessStep {
  id: string;
  step: number;
  title: string;
  description: string;
  icon: string;
}