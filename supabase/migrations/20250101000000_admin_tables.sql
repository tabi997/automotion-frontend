-- Create vehicles table for admin management
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  mileage INTEGER NOT NULL,
  fuel_type VARCHAR(50) NOT NULL,
  transmission VARCHAR(50) NOT NULL,
  body_type VARCHAR(50) NOT NULL,
  engine_capacity INTEGER,
  horse_power INTEGER,
  color VARCHAR(100),
  images TEXT[],
  main_image VARCHAR(500),
  badges JSONB,
  condition VARCHAR(50) NOT NULL,
  features TEXT[],
  description TEXT,
  location VARCHAR(100),
  date_added TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_urgent BOOLEAN DEFAULT FALSE,
  is_promoted BOOLEAN DEFAULT FALSE,
  financing JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create form_options table for managing dropdown options
CREATE TABLE IF NOT EXISTS form_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  value VARCHAR(100) NOT NULL,
  label VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create form_texts table for managing form texts
CREATE TABLE IF NOT EXISTS form_texts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "key" VARCHAR(100) NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create site_settings table for managing site settings
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "key" VARCHAR(100) NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add processed column to existing lead tables if they don't exist
ALTER TABLE lead_sell ADD COLUMN IF NOT EXISTS processed BOOLEAN DEFAULT FALSE;
ALTER TABLE lead_finance ADD COLUMN IF NOT EXISTS processed BOOLEAN DEFAULT FALSE;
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS processed BOOLEAN DEFAULT FALSE;

-- Insert default form options
INSERT INTO form_options (value, label, category, "order") VALUES
-- Brands
('bmw', 'BMW', 'brands', 1),
('mercedes', 'Mercedes-Benz', 'brands', 2),
('audi', 'Audi', 'brands', 3),
('porsche', 'Porsche', 'brands', 4),
('tesla', 'Tesla', 'brands', 5),
('range_rover', 'Range Rover', 'brands', 6),

-- Fuel Types
('benzina', 'Benzină', 'fuelTypes', 1),
('motorina', 'Motorină', 'fuelTypes', 2),
('hibrid', 'Hibrid', 'fuelTypes', 3),
('electric', 'Electric', 'fuelTypes', 4),
('gpl', 'GPL', 'fuelTypes', 5),

-- Transmissions
('manuala', 'Manuală', 'transmissions', 1),
('automata', 'Automată', 'transmissions', 2),
('cvt', 'CVT', 'transmissions', 3),

-- Body Types
('berlina', 'Berlina', 'bodyTypes', 1),
('break', 'Break', 'bodyTypes', 2),
('suv', 'SUV', 'bodyTypes', 3),
('coupe', 'Coupe', 'bodyTypes', 4),
('cabriolet', 'Cabriolet', 'bodyTypes', 5),
('hatchback', 'Hatchback', 'bodyTypes', 6),
('monovolum', 'Monovolum', 'bodyTypes', 7),

-- Conditions
('nou', 'Nou', 'conditions', 1),
('second-hand', 'Second Hand', 'conditions', 2),
('demo', 'Demo', 'conditions', 3);

-- Insert default form texts
INSERT INTO form_texts ("key", value, description, category) VALUES
('placeholder_brand', 'Selectează marca', 'Placeholder pentru dropdown marca', 'forms'),
('placeholder_model', 'Selectează modelul', 'Placeholder pentru dropdown model', 'forms'),
('placeholder_year', 'Selectează anul', 'Placeholder pentru dropdown an', 'forms'),
('placeholder_fuel', 'Selectează combustibilul', 'Placeholder pentru dropdown combustibil', 'forms'),
('placeholder_transmission', 'Selectează transmisia', 'Placeholder pentru dropdown transmisie', 'forms'),
('placeholder_body', 'Selectează tipul caroseriei', 'Placeholder pentru dropdown tip caroserie', 'forms'),
('placeholder_condition', 'Selectează starea', 'Placeholder pentru dropdown stare', 'forms'),
('validation_required', 'Acest câmp este obligatoriu', 'Mesaj validare câmp obligatoriu', 'validation'),
('validation_email', 'Introduceți o adresă de email validă', 'Mesaj validare email', 'validation'),
('validation_phone', 'Introduceți un număr de telefon valid', 'Mesaj validare telefon', 'validation'),
('success_submit', 'Formularul a fost trimis cu succes!', 'Mesaj succes trimitere formular', 'messages'),
('error_submit', 'A apărut o eroare. Încercați din nou.', 'Mesaj eroare trimitere formular', 'messages');

-- Insert default site settings
INSERT INTO site_settings ("key", value, description, category) VALUES
('site_name', 'AutoOrder', 'Numele site-ului', 'site'),
('site_tagline_ro', 'Mașini premium la comandă', 'Slogan site în română', 'site'),
('site_tagline_en', 'Premium cars on demand', 'Slogan site în engleză', 'site'),
('contact_phone', '+40 721 234 567', 'Numărul de telefon de contact', 'contact'),
('contact_email', 'contact@autoorder.ro', 'Adresa de email de contact', 'contact'),
('contact_address', 'Strada Victoriei 123, București, România', 'Adresa de contact', 'contact'),
('social_facebook', 'https://facebook.com/autoorder', 'Link Facebook', 'social'),
('social_instagram', 'https://instagram.com/autoorder', 'Link Instagram', 'social'),
('seo_title', 'AutoOrder - Mașini Premium la Comandă', 'Titlu SEO principal', 'seo'),
('seo_description', 'Găsește mașina perfectă din stocul nostru premium sau comandă exact vehiculul dorit. Finanțare rapidă și servicii complete.', 'Descriere SEO principală', 'seo');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vehicles_brand ON vehicles(brand);
CREATE INDEX IF NOT EXISTS idx_vehicles_model ON vehicles(model);
CREATE INDEX IF NOT EXISTS idx_vehicles_condition ON vehicles(condition);
CREATE INDEX IF NOT EXISTS idx_vehicles_created_at ON vehicles(created_at);

CREATE INDEX IF NOT EXISTS idx_form_options_category ON form_options(category);
CREATE INDEX IF NOT EXISTS idx_form_options_order ON form_options("order");

CREATE INDEX IF NOT EXISTS idx_form_texts_category ON form_texts(category);
CREATE INDEX IF NOT EXISTS idx_form_texts_key ON form_texts("key");

CREATE INDEX IF NOT EXISTS idx_site_settings_category ON site_settings(category);
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings("key");

CREATE INDEX IF NOT EXISTS idx_lead_sell_processed ON lead_sell(processed);
CREATE INDEX IF NOT EXISTS idx_lead_sell_created_at ON lead_sell(created_at);

CREATE INDEX IF NOT EXISTS idx_lead_finance_processed ON lead_finance(processed);
CREATE INDEX IF NOT EXISTS idx_lead_finance_created_at ON lead_finance(created_at);

CREATE INDEX IF NOT EXISTS idx_contact_messages_processed ON contact_messages(processed);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_texts ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to form options and texts
CREATE POLICY "Allow public read access to form options" ON form_options
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to form texts" ON form_texts
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to site settings" ON site_settings
  FOR SELECT USING (true);

-- Create policies for admin full access (you'll need to implement proper authentication)
CREATE POLICY "Allow admin full access to vehicles" ON vehicles
  FOR ALL USING (true);

CREATE POLICY "Allow admin full access to form options" ON form_options
  FOR ALL USING (true);

CREATE POLICY "Allow admin full access to form texts" ON form_texts
  FOR ALL USING (true);

CREATE POLICY "Allow admin full access to site settings" ON site_settings
  FOR ALL USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_form_options_updated_at BEFORE UPDATE ON form_options
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_form_texts_updated_at BEFORE UPDATE ON form_texts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
