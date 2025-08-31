import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type StockRow = Database["public"]["Tables"]["stock"]["Row"];
type StockInsert = Database["public"]["Tables"]["stock"]["Insert"];
type StockUpdate = Database["public"]["Tables"]["stock"]["Update"];

type LeadSellRow = Database["public"]["Tables"]["lead_sell"]["Row"];
type LeadFinanceRow = Database["public"]["Tables"]["lead_finance"]["Row"];
type ContactMessageRow = Database["public"]["Tables"]["contact_messages"]["Row"];
type LeadOrderRow = Database["public"]["Tables"]["lead_order"]["Row"];

// Stock Management
export async function getStock(): Promise<StockRow[]> {
  const { data, error } = await supabase
    .from("stock")
    .select("*")
    .order("created_at", { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function createListing(input: StockInsert): Promise<{ data: StockRow | null; error: unknown }> {
  return await supabase.from("stock").insert([input]).select().single();
}

export async function updateListing(id: string, input: StockUpdate): Promise<{ data: StockRow | null; error: unknown }> {
  return await supabase.from("stock").update(input).eq("id", id).select().single();
}

export async function deleteListing(id: string): Promise<{ error: unknown }> {
  return await supabase.from("stock").delete().eq("id", id);
}

// Order Lead Management
export async function createOrderLead(input: Database["public"]["Tables"]["lead_order"]["Insert"]): Promise<{ data: LeadOrderRow | null; error: unknown }> {
  return await supabase.from("lead_order").insert([input]).select().single();
}

// Leads Management
export async function getSellLeads(): Promise<LeadSellRow[]> {
  const { data, error } = await supabase
    .from("lead_sell")
    .select("*")
    .order("created_at", { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function getFinanceLeads(): Promise<LeadFinanceRow[]> {
  const { data, error } = await supabase
    .from("lead_finance")
    .select("*")
    .order("created_at", { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function getContactLeads(): Promise<ContactMessageRow[]> {
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function getOrderLeads(): Promise<LeadOrderRow[]> {
  const { data, error } = await supabase
    .from("lead_order")
    .select("*")
    .order("created_at", { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function setLeadStatus(
  table: "lead_sell" | "lead_finance" | "contact_messages" | "lead_order", 
  id: string, 
  status: string
): Promise<{ error: unknown }> {
  return await supabase.from(table).update({ status }).eq("id", id);
}

// Dashboard Stats
export async function getDashboardStats(): Promise<{
  stockCount: number;
  sellLeadsCount: number;
  financeLeadsCount: number;
  contactCount: number;
  orderLeadsCount: number;
}> {
  const [stock, sellLeads, financeLeads, contact, orderLeads] = await Promise.all([
    supabase.from("stock").select("*", { count: "exact", head: true }),
    supabase.from("lead_sell").select("*", { count: "exact", head: true }),
    supabase.from("lead_finance").select("*", { count: "exact", head: true }),
    supabase.from("contact_messages").select("*", { count: "exact", head: true }),
    supabase.from("lead_order").select("*", { count: "exact", head: true })
  ]);

  return {
    stockCount: stock.count || 0,
    sellLeadsCount: sellLeads.count || 0,
    financeLeadsCount: financeLeads.count || 0,
    contactCount: contact.count || 0,
    orderLeadsCount: orderLeads.count || 0
  };
}
