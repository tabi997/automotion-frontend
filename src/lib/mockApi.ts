import { Vehicle, VehicleFilters, VehicleSort, PaginatedVehicles } from '@/types/vehicle';
import { Lead } from '@/types/common';
import vehiclesData from '@/data/vehicles.json';
import { carBrands } from '@/data/carBrands';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class MockAPI {
  private static vehicles: Vehicle[] = vehiclesData.vehicles as Vehicle[];

  static async getVehicles(
    filters: VehicleFilters = {},
    sort: VehicleSort = { field: 'dateAdded', direction: 'desc' },
    page: number = 1,
    limit: number = 12
  ): Promise<PaginatedVehicles> {
    await delay(300); // Simulate network delay

    let filtered = [...this.vehicles];

    // Apply filters
    if (filters.brand) {
      filtered = filtered.filter(v => 
        v.brand.toLowerCase().includes(filters.brand!.toLowerCase())
      );
    }
    
    if (filters.model) {
      filtered = filtered.filter(v => 
        v.model.toLowerCase().includes(filters.model!.toLowerCase())
      );
    }
    
    if (filters.bodyType) {
      filtered = filtered.filter(v => v.bodyType === filters.bodyType);
    }
    
    if (filters.fuelType) {
      filtered = filtered.filter(v => v.fuelType === filters.fuelType);
    }
    
    if (filters.transmission) {
      filtered = filtered.filter(v => v.transmission === filters.transmission);
    }
    
    if (filters.condition) {
      filtered = filtered.filter(v => v.condition === filters.condition);
    }
    
    if (filters.yearMin) {
      filtered = filtered.filter(v => v.year >= filters.yearMin!);
    }
    
    if (filters.yearMax) {
      filtered = filtered.filter(v => v.year <= filters.yearMax!);
    }
    
    if (filters.mileageMin) {
      filtered = filtered.filter(v => v.mileage >= filters.mileageMin!);
    }
    
    if (filters.mileageMax) {
      filtered = filtered.filter(v => v.mileage <= filters.mileageMax!);
    }
    
    if (filters.priceMin) {
      filtered = filtered.filter(v => v.price >= filters.priceMin!);
    }
    
    if (filters.priceMax) {
      filtered = filtered.filter(v => v.price <= filters.priceMax!);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(v => 
        v.brand.toLowerCase().includes(searchLower) ||
        v.model.toLowerCase().includes(searchLower) ||
        v.description.toLowerCase().includes(searchLower) ||
        v.features.some(f => f.toLowerCase().includes(searchLower))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: number | Date, bValue: number | Date;
      
      switch (sort.field) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'year':
          aValue = a.year;
          bValue = b.year;
          break;
        case 'mileage':
          aValue = a.mileage;
          bValue = b.mileage;
          break;
        case 'dateAdded':
          aValue = new Date(a.dateAdded);
          bValue = new Date(b.dateAdded);
          break;
        default:
          return 0;
      }
      
      if (sort.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Apply pagination
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const vehicles = filtered.slice(startIndex, endIndex);

    return {
      vehicles,
      total,
      page,
      limit,
      totalPages
    };
  }

  static async getVehicleById(id: string): Promise<Vehicle | null> {
    await delay(200);
    return this.vehicles.find(v => v.id === id) || null;
  }

  static async submitLead(lead: Lead): Promise<{ success: boolean; id: string }> {
    await delay(500); // Simulate form submission
    
    const id = Math.random().toString(36).substr(2, 9);
    
    // In real app, this would save to database
    console.log('Lead submitted:', { ...lead, id, createdAt: new Date().toISOString() });
    
    return { success: true, id };
  }

  static async uploadImages(files: File[]): Promise<string[]> {
    await delay(800); // Simulate file upload
    
    // In real app, this would upload to cloud storage
    return files.map((file, index) => `/demo/uploads/${Date.now()}-${index}-${file.name}`);
  }

  static async calculateFinancing(
    amount: number,
    downPayment: number,
    termMonths: number,
    interestRate: number = 4.5
  ): Promise<{
    monthlyPayment: number;
    totalInterest: number;
    totalAmount: number;
  }> {
    await delay(300);
    
    const loanAmount = amount - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    
    const monthlyPayment = loanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
      (Math.pow(1 + monthlyRate, termMonths) - 1);
    
    const totalAmount = monthlyPayment * termMonths + downPayment;
    const totalInterest = totalAmount - amount;
    
    return {
      monthlyPayment: Math.round(monthlyPayment),
      totalInterest: Math.round(totalInterest),
      totalAmount: Math.round(totalAmount)
    };
  }

  // Helper methods for filters
  static getBrands(): string[] {
    return carBrands.map(b => b.brand);
  }

  static getModelsForBrand(brand: string): string[] {
    return carBrands.find(b => b.brand === brand)?.models ?? [];
  }

  static getPriceRange(): { min: number; max: number } {
    const prices = this.vehicles.map(v => v.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }

  static getYearRange(): { min: number; max: number } {
    const years = this.vehicles.map(v => v.year);
    return {
      min: Math.min(...years),
      max: Math.max(...years)
    };
  }

  static getMileageRange(): { min: number; max: number } {
    const mileages = this.vehicles.map(v => v.mileage);
    return {
      min: Math.min(...mileages),
      max: Math.max(...mileages)
    };
  }
}