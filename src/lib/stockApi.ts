import { supabase } from '@/integrations/supabase/client';
import { StockVehicle } from '@/types/vehicle';

export class StockAPI {
  static async getVehicles(filters: {
    brand?: string;
    model?: string;
    bodyType?: string;
    fuelType?: string;
    priceMin?: number;
    priceMax?: number;
    yearMin?: number;
    yearMax?: number;
    mileageMin?: number;
    mileageMax?: number;
  } = {}): Promise<StockVehicle[]> {
    let query = supabase
      .from('stock')
      .select('*')
      .eq('status', 'active');

    // Apply filters
    if (filters.brand) {
      query = query.eq('marca', filters.brand);
    }
    
    if (filters.model) {
      query = query.eq('model', filters.model);
    }
    
    if (filters.bodyType) {
      query = query.eq('caroserie', filters.bodyType);
    }
    
    if (filters.fuelType) {
      query = query.eq('combustibil', filters.fuelType);
    }
    
    if (filters.priceMin) {
      query = query.gte('pret', filters.priceMin);
    }
    
    if (filters.priceMax) {
      query = query.lte('pret', filters.priceMax);
    }
    
    if (filters.yearMin) {
      query = query.gte('an', filters.yearMin);
    }
    
    if (filters.yearMax) {
      query = query.lte('an', filters.yearMax);
    }
    
    if (filters.mileageMin) {
      query = query.gte('km', filters.mileageMin);
    }
    
    if (filters.mileageMax) {
      query = query.lte('km', filters.mileageMax);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getAllVehicles(): Promise<StockVehicle[]> {
    const { data, error } = await supabase
      .from('stock')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getVehicleById(id: string): Promise<StockVehicle | null> {
    const { data, error } = await supabase
      .from('stock')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async addVehicle(vehicle: Omit<StockVehicle, 'id' | 'created_at' | 'updated_at'>): Promise<void> {
    const { error } = await supabase
      .from('stock')
      .insert([vehicle]);

    if (error) throw error;
  }

  static async updateVehicle(id: string, updates: Partial<Omit<StockVehicle, 'id' | 'created_at' | 'updated_at'>>): Promise<void> {
    const { error } = await supabase
      .from('stock')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
  }

  static async deleteVehicle(id: string): Promise<void> {
    const { error } = await supabase
      .from('stock')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async updateVehicleStatus(id: string, status: string): Promise<void> {
    const { error } = await supabase
      .from('stock')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
  }
}
