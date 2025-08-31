import { supabase } from "@/integrations/supabase/client";
import { SellCarInput, FinanceInput, ContactInput } from "./validation";

// Generic response type
interface ActionResponse {
  success: boolean;
  error?: string;
  data?: unknown;
  message?: string;
}

/**
 * Submit a sell car lead to Supabase
 * TODO: Add authentication gating if needed
 */
export async function submitSellLead(data: SellCarInput): Promise<ActionResponse> {
  try {
    const { error } = await supabase
      .from('lead_sell')
      .insert([{
        marca: data.marca,
        model: data.model,
        an: data.an,
        km: data.km,
        combustibil: data.combustibil,
        transmisie: data.transmisie,
        caroserie: data.caroserie,
        culoare: data.culoare,
        vin: data.vin,
        pret: data.pret,
        negociabil: data.negociabil,
        judet: data.judet,
        oras: data.oras,
        images: data.images || [],
        nume: data.nume,
        telefon: data.telefon,
        email: data.email,
        preferinta_contact: data.preferinta_contact,
        interval_orar: data.interval_orar,
        gdpr: data.gdpr,
        status: 'new'
      }]);

    if (error) {
      console.error('Error submitting sell lead:', error);
      return { success: false, error: 'Eroare la trimiterea datelor. Vă rugăm încercați din nou.' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error submitting sell lead:', error);
    return { success: false, error: 'Eroare la trimiterea datelor. Vă rugăm încercați din nou.' };
  }
}

/**
 * Submit a finance lead to Supabase
 * TODO: Add authentication gating if needed
 */
export async function submitFinanceLead(data: FinanceInput): Promise<ActionResponse> {
  try {
    const { error } = await supabase
      .from('lead_finance')
      .insert([{
        pret: data.pret,
        avans: data.avans,
        perioada: data.perioada,
        dobanda: data.dobanda,
        nume: data.nume,
        email: data.email,
        telefon: data.telefon,
        venit_lunar: data.venit_lunar,
        tip_contract: data.tip_contract,
        istoric_creditare: data.istoric_creditare,
        link_stoc: data.link_stoc,
        mesaj: data.mesaj,
        status: 'new'
      }]);

    if (error) {
      console.error('Error submitting finance lead:', error);
      return { success: false, error: 'Eroare la trimiterea datelor. Vă rugăm încercați din nou.' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error submitting finance lead:', error);
    return { success: false, error: 'Eroare la trimiterea datelor. Vă rugăm încercați din nou.' };
  }
}

/**
 * Submit a contact message to Supabase
 * TODO: Add authentication gating if needed
 */
export async function submitContactMessage(data: ContactInput): Promise<ActionResponse> {
  try {
    const { error } = await supabase
      .from('contact_messages')
      .insert([{
        nume: data.nume,
        email: data.email,
        telefon: data.telefon,
        subiect: data.subiect,
        mesaj: data.mesaj,
        gdpr: data.gdpr,
        status: 'new'
      }]);

    if (error) {
      console.error('Error submitting contact message:', error);
      return { success: false, error: 'Eroare la trimiterea datelor. Vă rugăm încercați din nou.' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error submitting contact message:', error);
    return { success: false, error: 'Eroare la trimiterea datelor. Vă rugăm încercați din nou.' };
  }
}

/**
 * Calculate monthly payment for a loan
 * Formula: PMT = P * (r * (1 + r)^n) / ((1 + r)^n - 1)
 */
export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  termMonths: number
): {
  monthlyPayment: number;
  totalInterest: number;
  totalAmount: number;
  dae: number;
} {
  // Validate inputs to prevent errors
  if (principal <= 0 || annualRate <= 0 || termMonths <= 0) {
    return {
      monthlyPayment: 0,
      totalInterest: 0,
      totalAmount: 0,
      dae: 0
    };
  }
  
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = termMonths;
  
  // Calculate monthly payment
  const monthlyPayment = principal * 
    (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
    (Math.pow(1 + monthlyRate, numPayments) - 1);
  
  const totalAmount = monthlyPayment * numPayments;
  const totalInterest = totalAmount - principal;
  
  // Approximate DAE (Annual Percentage Rate) - simplified calculation
  const dae = annualRate + 2; // Adding estimated fees
  
  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
    dae: Math.round(dae * 100) / 100
  };
}

// Admin Actions

/**
 * Get all vehicles for admin
 */
export async function getAdminVehicles(): Promise<ActionResponse> {
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching vehicles:', error);
      return { success: false, error: 'Eroare la încărcarea vehiculelor.' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return { success: false, error: 'Eroare la încărcarea vehiculelor.' };
  }
}

/**
 * Add new vehicle
 */
export async function addVehicle(vehicleData: unknown): Promise<ActionResponse> {
  try {
    const { error } = await supabase
      .from('vehicles')
      .insert([vehicleData]);

    if (error) {
      console.error('Error adding vehicle:', error);
      return { success: false, error: 'Eroare la adăugarea vehiculului.' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error adding vehicle:', error);
    return { success: false, error: 'Eroare la adăugarea vehiculului.' };
  }
}

/**
 * Update vehicle
 */
export async function updateVehicle(id: string, vehicleData: unknown): Promise<ActionResponse> {
  try {
    const { error } = await supabase
      .from('vehicles')
      .update(vehicleData)
      .eq('id', id);

    if (error) {
      console.error('Error updating vehicle:', error);
      return { success: false, error: 'Eroare la actualizarea vehiculului.' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating vehicle:', error);
    return { success: false, error: 'Eroare la actualizarea vehiculului.' };
  }
}

/**
 * Delete vehicle
 */
export async function deleteVehicle(id: string): Promise<ActionResponse> {
  try {
    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting vehicle:', error);
      return { success: false, error: 'Eroare la ștergerea vehiculului.' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    return { success: false, error: 'Eroare la ștergerea vehiculului.' };
  }
}

/**
 * Get all leads for admin
 */
export async function getAdminLeads(): Promise<ActionResponse> {
  try {
    const [sellLeads, financeLeads, contactMessages] = await Promise.all([
      supabase.from('lead_sell').select('*').order('created_at', { ascending: false }),
      supabase.from('lead_finance').select('*').order('created_at', { ascending: false }),
      supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
    ]);

    if (sellLeads.error || financeLeads.error || contactMessages.error) {
      console.error('Error fetching leads:', { sellLeads: sellLeads.error, financeLeads: financeLeads.error, contactMessages: contactMessages.error });
      return { success: false, error: 'Eroare la încărcarea lead-urilor.' };
    }

    return { 
      success: true, 
      data: {
        sellLeads: sellLeads.data || [],
        financeLeads: financeLeads.data || [],
        contactMessages: contactMessages.data || []
      }
    };
  } catch (error) {
    console.error('Error fetching leads:', error);
    return { success: false, error: 'Eroare la încărcarea lead-urilor.' };
  }
}

/**
 * Mark lead as processed
 */
export async function markLeadProcessed(table: string, id: string): Promise<ActionResponse> {
  try {
    const { error } = await supabase
      .from(table)
      .update({ processed: true })
      .eq('id', id);

    if (error) {
      console.error('Error marking lead as processed:', error);
      return { success: false, error: 'Eroare la marcarea lead-ului.' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error marking lead as processed:', error);
    return { success: false, error: 'Eroare la marcarea lead-ului.' };
  }
}

/**
 * Get admin dashboard stats
 */
export async function getAdminStats(): Promise<ActionResponse> {
  try {
    const [vehicles, sellLeads, financeLeads, contactMessages] = await Promise.all([
      supabase.from('vehicles').select('*', { count: 'exact', head: true }),
      supabase.from('lead_sell').select('*', { count: 'exact', head: true }),
      supabase.from('lead_finance').select('*', { count: 'exact', head: true }),
      supabase.from('contact_messages').select('*', { count: 'exact', head: true })
    ]);

    if (vehicles.error || sellLeads.error || financeLeads.error || contactMessages.error) {
      console.error('Error fetching stats:', { vehicles: vehicles.error, sellLeads: sellLeads.error, financeLeads: financeLeads.error, contactMessages: contactMessages.error });
      return { success: false, error: 'Eroare la încărcarea statisticilor.' };
    }

    return { 
      success: true, 
      data: {
        vehicles: vehicles.count || 0,
        sellLeads: sellLeads.count || 0,
        financeLeads: financeLeads.count || 0,
        contactMessages: contactMessages.count || 0
      }
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return { success: false, error: 'Eroare la încărcarea statisticilor.' };
  }
}

/**
 * Delete old leads based on age criteria
 */
export async function deleteOldLeads(options: {
  table: string;
  daysOld: number;
  onlyProcessed?: boolean;
}): Promise<ActionResponse> {
  try {
    const { table, daysOld, onlyProcessed = false } = options;
    
    // Calculate the cutoff date
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    // Build the query
    let query = supabase
      .from(table as any)
      .delete()
      .lt('created_at', cutoffDate.toISOString());
    
    // If only processed leads should be deleted
    if (onlyProcessed) {
      query = query.eq('status', 'processed');
    }
    
    const { error, count } = await query;

    if (error) {
      console.error('Error deleting old leads:', error);
      return { success: false, error: 'Eroare la ștergerea lead-urilor vechi.' };
    }

    return { 
      success: true, 
      data: { deletedCount: count || 0 },
      message: `${count || 0} lead-uri vechi au fost șterse cu succes.`
    };
  } catch (error) {
    console.error('Error deleting old leads:', error);
    return { success: false, error: 'Eroare la ștergerea lead-urilor vechi.' };
  }
}

/**
 * Delete old leads from all tables
 */
export async function deleteOldLeadsFromAllTables(options: {
  daysOld: number;
  onlyProcessed?: boolean;
}): Promise<ActionResponse> {
  try {
    const { daysOld, onlyProcessed = false } = options;
    
    const tables = ['lead_sell', 'lead_finance', 'contact_messages'];
    const results = await Promise.all(
      tables.map(table => deleteOldLeads({ table, daysOld, onlyProcessed }))
    );
    
    const totalDeleted = results.reduce((sum, result) => {
      if (result.success && result.data?.deletedCount) {
        return sum + (result.data.deletedCount as number);
      }
      return sum;
    }, 0);
    
    const hasErrors = results.some(result => !result.success);
    
    if (hasErrors) {
      return { 
        success: false, 
        error: 'Unele lead-uri nu au putut fi șterse. Verificați log-urile pentru detalii.',
        data: { totalDeleted, results }
      };
    }
    
    return { 
      success: true, 
      data: { totalDeleted },
      message: `${totalDeleted} lead-uri vechi au fost șterse cu succes din toate tabelele.`
    };
  } catch (error) {
    console.error('Error deleting old leads from all tables:', error);
    return { success: false, error: 'Eroare la ștergerea lead-urilor vechi din toate tabelele.' };
  }
}

/**
 * Get lead statistics for cleanup
 */
export async function getLeadCleanupStats(): Promise<ActionResponse> {
  try {
    const [sellLeads, financeLeads, contactMessages] = await Promise.all([
      supabase
        .from('lead_sell')
        .select('created_at, status')
        .order('created_at', { ascending: true }),
      supabase
        .from('lead_finance')
        .select('created_at, status')
        .order('created_at', { ascending: true }),
      supabase
        .from('contact_messages')
        .select('created_at, status')
        .order('created_at', { ascending: true })
    ]);

    if (sellLeads.error || financeLeads.error || contactMessages.error) {
      console.error('Error fetching cleanup stats:', { 
        sellLeads: sellLeads.error, 
        financeLeads: financeLeads.error, 
        contactMessages: contactMessages.error 
      });
      return { success: false, error: 'Eroare la încărcarea statisticilor de cleanup.' };
    }

    const now = new Date();
    const getOldLeadsCount = (leads: any[], daysOld: number, onlyProcessed: boolean = false) => {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);
      
      return leads.filter(lead => {
        const isOld = new Date(lead.created_at) < cutoffDate;
        return onlyProcessed ? (isOld && lead.status === 'processed') : isOld;
      }).length;
    };

    const stats = {
      sellLeads: {
        total: sellLeads.data?.length || 0,
        old30Days: getOldLeadsCount(sellLeads.data || [], 30),
        old90Days: getOldLeadsCount(sellLeads.data || [], 90),
        old30DaysProcessed: getOldLeadsCount(sellLeads.data || [], 30, true),
        old90DaysProcessed: getOldLeadsCount(sellLeads.data || [], 90, true),
      },
      financeLeads: {
        total: financeLeads.data?.length || 0,
        old30Days: getOldLeadsCount(financeLeads.data || [], 30),
        old90Days: getOldLeadsCount(financeLeads.data || [], 90),
        old30DaysProcessed: getOldLeadsCount(financeLeads.data || [], 30, true),
        old90DaysProcessed: getOldLeadsCount(financeLeads.data || [], 90, true),
      },
      contactMessages: {
        total: contactMessages.data?.length || 0,
        old30Days: getOldLeadsCount(contactMessages.data || [], 30),
        old90Days: getOldLeadsCount(contactMessages.data || [], 90),
        old30DaysProcessed: getOldLeadsCount(contactMessages.data || [], 30, true),
        old90DaysProcessed: getOldLeadsCount(contactMessages.data || [], 90, true),
      }
    };

    return { success: true, data: stats };
  } catch (error) {
    console.error('Error fetching cleanup stats:', error);
    return { success: false, error: 'Eroare la încărcarea statisticilor de cleanup.' };
  }
}