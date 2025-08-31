-- Create stock table for vehicle listings
CREATE TABLE IF NOT EXISTS public.stock (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    marca TEXT NOT NULL,
    model TEXT NOT NULL,
    an INTEGER NOT NULL,
    km INTEGER NOT NULL,
    pret INTEGER NOT NULL,
    combustibil TEXT NOT NULL,
    transmisie TEXT NOT NULL,
    caroserie TEXT NOT NULL,
    culoare TEXT,
    vin TEXT,
    negociabil BOOLEAN DEFAULT false,
    images TEXT[],
    descriere TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add status column to existing tables if they don't have it
ALTER TABLE IF EXISTS public.lead_sell ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new';
ALTER TABLE IF EXISTS public.lead_finance ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new';
ALTER TABLE IF EXISTS public.contact_messages ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new';

-- Enable RLS
ALTER TABLE public.stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_sell ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_finance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for stock table
CREATE POLICY "Allow authenticated users to view stock" ON public.stock
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert stock" ON public.stock
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update stock" ON public.stock
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete stock" ON public.stock
    FOR DELETE USING (auth.role() = 'authenticated');

-- RLS Policies for lead tables (allow public insert, authenticated view/update)
CREATE POLICY "Allow public to insert lead_sell" ON public.lead_sell
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to view lead_sell" ON public.lead_sell
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update lead_sell" ON public.lead_sell
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public to insert lead_finance" ON public.lead_finance
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to view lead_finance" ON public.lead_finance
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update lead_finance" ON public.lead_finance
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public to insert contact_messages" ON public.contact_messages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to view contact_messages" ON public.contact_messages
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update contact_messages" ON public.contact_messages
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_stock_updated_at BEFORE UPDATE ON public.stock
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
