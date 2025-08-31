-- Fix RLS policies for lead_order table

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public insert on lead_order" ON public.lead_order;

-- Create new policies
CREATE POLICY "Allow public insert on lead_order" 
ON public.lead_order 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Allow public select (for lead viewing if needed)
CREATE POLICY "Allow public select own leads" 
ON public.lead_order 
FOR SELECT 
TO public 
USING (true);

-- Allow authenticated users to update leads
CREATE POLICY "Allow authenticated update own leads" 
ON public.lead_order 
FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Allow authenticated users to delete leads (admin functionality)
CREATE POLICY "Allow authenticated delete leads" 
ON public.lead_order 
FOR DELETE 
TO authenticated 
USING (true);
