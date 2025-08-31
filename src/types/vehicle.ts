export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  originalPrice?: number;
  mileage: number;
  fuelType: 'benzina' | 'motorina' | 'hibrid' | 'electric' | 'gpl';
  transmission: 'manuala' | 'automata' | 'cvt';
  bodyType: 'berlina' | 'break' | 'suv' | 'coupe' | 'cabriolet' | 'hatchback' | 'monovolum';
  engineCapacity: number;
  horsePower: number;
  color: string;
  images: string[];
  mainImage: string;
  badges: VehicleBadge[];
  condition: 'nou' | 'second-hand' | 'demo';
  features: string[];
  description: string;
  location: string;
  dateAdded: string;
  isUrgent?: boolean;
  isPromoted?: boolean;
  financing?: {
    available: boolean;
    monthlyPayment?: number;
    downPayment?: number;
  };
}

export interface VehicleBadge {
  id: string;
  text: string;
  type: 'success' | 'warning' | 'info' | 'urgent';
  icon?: string;
}

export interface VehicleFilters {
  brand?: string;
  model?: string;
  bodyType?: string;
  fuelType?: string;
  transmission?: string;
  condition?: string;
  yearMin?: number;
  yearMax?: number;
  mileageMin?: number;
  mileageMax?: number;
  priceMin?: number;
  priceMax?: number;
  search?: string;
}

export interface VehicleSort {
  field: 'price' | 'year' | 'mileage' | 'dateAdded';
  direction: 'asc' | 'desc';
}

export interface PaginatedVehicles {
  vehicles: Vehicle[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}