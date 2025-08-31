import { supabase } from "@/integrations/supabase/client";
import { SellCarInput, FinanceInput, ContactInput } from "./validation";

// Generic response type
interface ActionResponse {
  success: boolean;
  error?: string;
  data?: any;
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
        images: data.images,
        nume: data.nume,
        telefon: data.telefon,
        email: data.email,
        preferinta_contact: data.preferinta_contact,
        interval_orar: data.interval_orar,
        gdpr: data.gdpr
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
        mesaj: data.mesaj
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
        gdpr: data.gdpr
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