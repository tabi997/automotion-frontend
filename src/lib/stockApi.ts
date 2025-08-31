import { supabase } from '@/integrations/supabase/client';
import { StockVehicle } from '@/types/vehicle';

export class StockAPI {
  static async getVehicles(): Promise<StockVehicle[]> {
    const { data, error } = await supabase
      .from('stock')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

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
