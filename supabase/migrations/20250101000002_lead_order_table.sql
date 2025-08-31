-- Create table for car order leads
CREATE TABLE public.lead_order (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Car preferences
  marca TEXT NOT NULL,
  model TEXT,
  an_min INTEGER CHECK (an_min >= 1995 AND an_min <= EXTRACT(YEAR FROM CURRENT_DATE)),
  an_max INTEGER CHECK (an_max >= 1995 AND an_max <= EXTRACT(YEAR FROM CURRENT_DATE)),
  km_max INTEGER CHECK (km_max > 0),
  combustibil TEXT,
  transmisie TEXT,
  caroserie TEXT,
  culoare TEXT,
  pret_max NUMERIC CHECK (pret_max > 1000),
  pret_min NUMERIC CHECK (pret_min > 1000),
  
  -- Additional preferences
  caracteristici_speciale TEXT[],
  urgent BOOLEAN DEFAULT false,
  observatii TEXT,
  
  -- Contact details
  nume TEXT NOT NULL,
  telefon TEXT NOT NULL,
  email TEXT NOT NULL,
  preferinta_contact TEXT,
  interval_orar TEXT,
  
  -- GDPR consent
  gdpr BOOLEAN NOT NULL DEFAULT false,
  
  -- Status for admin management
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'processed', 'contacted', 'closed'))
);

-- Enable Row Level Security
ALTER TABLE public.lead_order ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (anonymous lead collection)
CREATE POLICY "Allow public insert on lead_order" 
ON public.lead_order 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_lead_order_created_at ON public.lead_order(created_at DESC);
CREATE INDEX idx_lead_order_status ON public.lead_order(status);
CREATE INDEX idx_lead_order_marca ON public.lead_order(marca);
