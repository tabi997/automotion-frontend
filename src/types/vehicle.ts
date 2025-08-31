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
  vin?: string;
  negotiable?: boolean;
  images: string[];
  mainImage: string;
  badges: VehicleBadge[];
  condition: 'nou' | 'second-hand' | 'demo';
  features: string[];
  description: string;
  location: string;
  dateAdded: string;
  status?: 'active' | 'inactive' | 'sold';
  updatedAt?: string;
  isUrgent?: boolean;
  isPromoted?: boolean;
  financing?: {
    available: boolean;
    monthlyPayment?: number;
    downPayment?: number;
  };
  openlane_url?: string;
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

// New type matching the database structure
export interface StockVehicle {
  id: string;
  marca: string;
  model: string;
  an: number;
  km: number;
  pret: number;
  combustibil: string;
  transmisie: string;
  caroserie: string;
  culoare?: string;
  vin?: string;
  negociabil?: boolean;
  images?: string[];
  descriere?: string;
  status: string;
  openlane_url?: string;
  created_at: string;
  updated_at: string;
}