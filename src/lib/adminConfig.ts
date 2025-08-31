import { supabase } from "@/integrations/supabase/client";

// Tipuri pentru configurația de administrare
export interface AdminConfig {
  formOptions: FormOptionsConfig;
  formTexts: FormTextsConfig;
  siteSettings: SiteSettingsConfig;
}

export interface FormOptionsConfig {
  brands: FormOption[];
  fuelTypes: FormOption[];
  transmissions: FormOption[];
  bodyTypes: FormOption[];
  conditions: FormOption[];
}

export interface FormOption {
  value: string;
  label: string;
  order: number;
}

export interface FormTextsConfig {
  forms: FormText[];
  validation: FormText[];
  messages: FormText[];
}

export interface FormText {
  key: string;
  value: string;
  description: string;
}

export interface SiteSettingsConfig {
  site: SiteSetting[];
  contact: SiteSetting[];
  social: SiteSetting[];
  seo: SiteSetting[];
}

export interface SiteSetting {
  key: string;
  value: string;
  description: string;
}

// Funcții pentru încărcarea configurației
export async function loadAdminConfig(): Promise<AdminConfig> {
  try {
    const [formOptions, formTexts, siteSettings] = await Promise.all([
      loadFormOptions(),
      loadFormTexts(),
      loadSiteSettings()
    ]);

    return {
      formOptions,
      formTexts,
      siteSettings
    };
  } catch (error) {
    console.error('Error loading admin config:', error);
    throw error;
  }
}

async function loadFormOptions(): Promise<FormOptionsConfig> {
  const { data, error } = await supabase
    .from('form_options')
    .select('*')
    .order('category')
    .order('order');

  if (error) throw error;

  const options = data || [];
  
  return {
    brands: options.filter(o => o.category === 'brands'),
    fuelTypes: options.filter(o => o.category === 'fuelTypes'),
    transmissions: options.filter(o => o.category === 'transmissions'),
    bodyTypes: options.filter(o => o.category === 'bodyTypes'),
    conditions: options.filter(o => o.category === 'conditions')
  };
}

async function loadFormTexts(): Promise<FormTextsConfig> {
  const { data, error } = await supabase
    .from('form_texts')
    .select('*')
    .order('category')
    .order('key');

  if (error) throw error;

  const texts = data || [];
  
  return {
    forms: texts.filter(t => t.category === 'forms'),
    validation: texts.filter(t => t.category === 'validation'),
    messages: texts.filter(t => t.category === 'messages')
  };
}

async function loadSiteSettings(): Promise<SiteSettingsConfig> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .order('category')
    .order('key');

  if (error) throw error;

  const settings = data || [];
  
  return {
    site: settings.filter(s => s.category === 'site'),
    contact: settings.filter(s => s.category === 'contact'),
    social: settings.filter(s => s.category === 'social'),
    seo: settings.filter(s => s.category === 'seo')
  };
}

// Funcții utilitare pentru formulare
export function getFormOptionValue(options: FormOption[], key: string): string {
  const option = options.find(o => o.value === key);
  return option ? option.label : key;
}

export function getFormTextValue(texts: FormText[], key: string): string {
  const text = texts.find(t => t.key === key);
  return text ? text.value : key;
}

export function getSiteSettingValue(settings: SiteSetting[], key: string): string {
  const setting = settings.find(s => s.key === key);
  return setting ? setting.value : key;
}

// Hook personalizat pentru utilizarea configurației în componente
export function useAdminConfig() {
  const [config, setConfig] = useState<AdminConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAdminConfig()
      .then(setConfig)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { config, loading, error };
}

// Configurație implicită pentru fallback
export const defaultAdminConfig: AdminConfig = {
  formOptions: {
    brands: [
      { value: 'bmw', label: 'BMW', order: 1 },
      { value: 'mercedes', label: 'Mercedes-Benz', order: 2 },
      { value: 'audi', label: 'Audi', order: 3 },
      { value: 'porsche', label: 'Porsche', order: 4 },
      { value: 'tesla', label: 'Tesla', order: 5 },
      { value: 'range_rover', label: 'Range Rover', order: 6 }
    ],
    fuelTypes: [
      { value: 'benzina', label: 'Benzină', order: 1 },
      { value: 'motorina', label: 'Motorină', order: 2 },
      { value: 'hibrid', label: 'Hibrid', order: 3 },
      { value: 'electric', label: 'Electric', order: 4 },
      { value: 'gpl', label: 'GPL', order: 5 }
    ],
    transmissions: [
      { value: 'manuala', label: 'Manuală', order: 1 },
      { value: 'automata', label: 'Automată', order: 2 },
      { value: 'cvt', label: 'CVT', order: 3 }
    ],
    bodyTypes: [
      { value: 'berlina', label: 'Berlina', order: 1 },
      { value: 'break', label: 'Break', order: 2 },
      { value: 'suv', label: 'SUV', order: 3 },
      { value: 'coupe', label: 'Coupe', order: 4 },
      { value: 'cabriolet', label: 'Cabriolet', order: 5 },
      { value: 'hatchback', label: 'Hatchback', order: 6 },
      { value: 'monovolum', label: 'Monovolum', order: 7 }
    ],
    conditions: [
      { value: 'nou', label: 'Nou', order: 1 },
      { value: 'second-hand', label: 'Second Hand', order: 2 },
      { value: 'demo', label: 'Demo', order: 3 }
    ]
  },
  formTexts: {
    forms: [
      { key: 'placeholder_brand', value: 'Selectează marca', description: 'Placeholder pentru dropdown marca' },
      { key: 'placeholder_model', value: 'Selectează modelul', description: 'Placeholder pentru dropdown model' },
      { key: 'placeholder_year', value: 'Selectează anul', description: 'Placeholder pentru dropdown an' },
      { key: 'placeholder_fuel', value: 'Selectează combustibilul', description: 'Placeholder pentru dropdown combustibil' },
      { key: 'placeholder_transmission', value: 'Selectează transmisia', description: 'Placeholder pentru dropdown transmisie' },
      { key: 'placeholder_body', value: 'Selectează tipul caroseriei', description: 'Placeholder pentru dropdown tip caroserie' },
      { key: 'placeholder_condition', value: 'Selectează starea', description: 'Placeholder pentru dropdown stare' }
    ],
    validation: [
      { key: 'validation_required', value: 'Acest câmp este obligatoriu', description: 'Mesaj validare câmp obligatoriu' },
      { key: 'validation_email', value: 'Introduceți o adresă de email validă', description: 'Mesaj validare email' },
      { key: 'validation_phone', value: 'Introduceți un număr de telefon valid', description: 'Mesaj validare telefon' }
    ],
    messages: [
      { key: 'success_submit', value: 'Formularul a fost trimis cu succes!', description: 'Mesaj succes trimitere formular' },
      { key: 'error_submit', value: 'A apărut o eroare. Încercați din nou.', description: 'Mesaj eroare trimitere formular' }
    ]
  },
  siteSettings: {
    site: [
      { key: 'site_name', value: 'AutoOrder', description: 'Numele site-ului' },
      { key: 'site_tagline_ro', value: 'Mașini premium la comandă', description: 'Slogan site în română' },
      { key: 'site_tagline_en', value: 'Premium cars on demand', description: 'Slogan site în engleză' }
    ],
    contact: [
      { key: 'contact_phone', value: '+40 721 234 567', description: 'Numărul de telefon de contact' },
      { key: 'contact_email', value: 'contact@autoorder.ro', description: 'Adresa de email de contact' },
      { key: 'contact_address', value: 'Strada Victoriei 123, București, România', description: 'Adresa de contact' }
    ],
    social: [
      { key: 'social_facebook', value: 'https://facebook.com/autoorder', description: 'Link Facebook' },
      { key: 'social_instagram', value: 'https://instagram.com/autoorder', description: 'Link Instagram' }
    ],
    seo: [
      { key: 'seo_title', value: 'AutoOrder - Mașini Premium la Comandă', description: 'Titlu SEO principal' },
      { key: 'seo_description', value: 'Găsește mașina perfectă din stocul nostru premium sau comandă exact vehiculul dorit. Finanțare rapidă și servicii complete.', description: 'Descriere SEO principală' }
    ]
  }
};

// Import necesar pentru useState și useEffect
import { useState, useEffect } from 'react';
