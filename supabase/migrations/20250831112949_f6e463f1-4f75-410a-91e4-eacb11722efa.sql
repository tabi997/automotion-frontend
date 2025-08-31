-- Create tables for leads and contact messages

-- Table for sell car leads
CREATE TABLE public.lead_sell (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Car details
  marca TEXT NOT NULL,
  model TEXT NOT NULL,
  an INTEGER NOT NULL CHECK (an >= 1995 AND an <= EXTRACT(YEAR FROM CURRENT_DATE)),
  km INTEGER NOT NULL CHECK (km > 0),
  combustibil TEXT NOT NULL,
  transmisie TEXT NOT NULL,
  caroserie TEXT NOT NULL,
  culoare TEXT,
  vin TEXT,
  pret NUMERIC,
  negociabil BOOLEAN DEFAULT false,
  
  -- Location
  judet TEXT NOT NULL,
  oras TEXT NOT NULL,
  
  -- Images (Cloudinary public IDs)
  images TEXT[] DEFAULT '{}',
  
  -- Contact details
  nume TEXT NOT NULL,
  telefon TEXT NOT NULL,
  email TEXT NOT NULL,
  preferinta_contact TEXT,
  interval_orar TEXT,
  
  -- GDPR consent
  gdpr BOOLEAN NOT NULL DEFAULT false
);

-- Table for finance leads
CREATE TABLE public.lead_finance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Finance details
  pret NUMERIC NOT NULL CHECK (pret > 1000),
  avans NUMERIC NOT NULL DEFAULT 0 CHECK (avans >= 0),
  perioada INTEGER NOT NULL CHECK (perioada BETWEEN 12 AND 84),
  dobanda NUMERIC NOT NULL CHECK (dobanda BETWEEN 1 AND 25),
  
  -- Contact details
  nume TEXT NOT NULL,
  email TEXT NOT NULL,
  telefon TEXT NOT NULL,
  venit_lunar NUMERIC,
  tip_contract TEXT,
  istoric_creditare TEXT,
  
  -- Optional stock link
  link_stoc TEXT,
  mesaj TEXT
);

-- Table for contact messages
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Contact details
  nume TEXT NOT NULL,
  email TEXT NOT NULL,
  telefon TEXT,
  subiect TEXT NOT NULL CHECK (char_length(subiect) >= 5),
  mesaj TEXT NOT NULL CHECK (char_length(mesaj) >= 20),
  
  -- GDPR consent
  gdpr BOOLEAN NOT NULL DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE public.lead_sell ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_finance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (anonymous lead collection)
-- TODO: Restrict these policies later based on business requirements

CREATE POLICY "Allow public insert on lead_sell" 
ON public.lead_sell 
FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Allow public insert on lead_finance" 
ON public.lead_finance 
FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Allow public insert on contact_messages" 
ON public.contact_messages 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_lead_sell_created_at ON public.lead_sell(created_at DESC);
CREATE INDEX idx_lead_sell_marca_model ON public.lead_sell(marca, model);
CREATE INDEX idx_lead_finance_created_at ON public.lead_finance(created_at DESC);
CREATE INDEX idx_contact_messages_created_at ON public.contact_messages(created_at DESC);